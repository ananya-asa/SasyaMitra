const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const simulator = require('./simulation/farmSimulator');
const farmRouter = require('./routes/farmData');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global simulation timer configuration
let tickIntervalMs = 60000; // Default 1 minute
let tickTimerId = null;

// Serve API Routes
app.use('/api', farmRouter);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Smart Agriculture Digital Twin Simulator Backend is online.');
});

// Compatible status endpoint for the Flutter Dashboard
app.get('/status', (req, res) => {
  const state = simulator.loadState();
  const zoneId = (req.query.zone || 'A').toUpperCase();
  const zone = state.zones.find(z => z.zone_id === zoneId);
  if (!zone) {
    return res.status(404).json({ error: `Zone ${zoneId} not found` });
  }
  
  res.json({
    temperature: zone.temperature,
    humidity: zone.humidity,
    soilMoisture: zone.soil_moisture,
    battery: zone.battery,
    pump: zone.irrigation,
    rain: state.weather.condition === 'RAINY' || state.weather.condition === 'STORM',
    cropStress: zone.crop_health || 'HEALTHY',
    pressure: state.weather.barometric_pressure || 1013.0,
    weatherForecast: zone.weather_forecast || 'STABLE',
    batteryHoursRemaining: zone.battery_time_remaining_hours || 25.0,
    currentDraw: zone.current_draw_ma || 80.0,
    alert: zone.alert || 'NONE',
    smart_trigger_mode: state.smart_trigger_mode || 'AUTOMATED',
    simulation_speed: tickIntervalMs === 3000 ? "DEMO" : "REALTIME",
    simulation_interval: tickIntervalMs,
    lastUpdated: new Date().toISOString()
  });
});

// ==========================================
// MQTT BROKER CLIENT INTEGRATION
// ==========================================
const MQTT_BROKER = 'mqtt://broker.hivemq.com';
console.log('🔌 Connecting to MQTT Broker...');
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log(`================================================================`);
  console.log(`🔗 MQTT Broker connected successfully at: ${MQTT_BROKER}`);
  
  // Subscribe to control topics (ESP32 acts as the decider and publishes commands)
  mqttClient.subscribe('smartfarm/zones/+/control', (err) => {
    if (!err) {
      console.log('📡 Subscribed to: smartfarm/zones/+/control');
      console.log(`================================================================`);
    } else {
      console.error('Failed to subscribe to MQTT control topic:', err);
    }
  });
});

// Listen for incoming decisions from Wokwi ESP32
mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const parts = topic.split('/');
    const zoneId = parts[2].toUpperCase(); // e.g. 'A'

    console.log(`[MQTT Command Received] Topic: ${topic} ->`, payload);

    const state = simulator.loadState();
    const zone = state.zones.find(z => z.zone_id === zoneId);

    if (zone) {
      let stateChanged = false;

      // 1. Actuate Irrigation State
      if (payload.irrigation !== undefined) {
        const isChanged = zone.irrigation !== payload.irrigation;
        zone.irrigation = payload.irrigation;
        if (isChanged) {
          simulator.addLog(`[MQTT ACTION] Zone ${zoneId} irrigation turned ${payload.irrigation ? 'ON' : 'OFF'} by ESP32 Edge Device`);
          stateChanged = true;
        }
      }

      // 2. Actuate Alarm Alerts
      if (payload.alert !== undefined) {
        const isChanged = zone.alert !== payload.alert;
        zone.alert = payload.alert;
        if (isChanged) {
          if (payload.alert !== 'NONE') {
            simulator.addLog(`[MQTT ALERT] Zone ${zoneId} raised status: ${payload.alert}`);
          } else {
            simulator.addLog(`[MQTT INFO] Zone ${zoneId} alert cleared`);
          }
          stateChanged = true;
        }
      }

      // 3. Update Crop Health Prediction from Edge ML Model
      if (payload.crop_health !== undefined) {
        zone.crop_health = payload.crop_health;
        stateChanged = true;
      }

      // 4. Update Water Requirement Prediction from Edge ML Model
      if (payload.water_requirement !== undefined) {
        zone.water_requirement = payload.water_requirement;
        stateChanged = true;
      }

      // 5. Update Weather Forecast Prediction from Edge ML Model
      if (payload.weather_forecast !== undefined) {
        zone.weather_forecast = payload.weather_forecast;
        stateChanged = true;
      }

      if (stateChanged) {
        simulator.saveState();
      }
    }
  } catch (err) {
    console.error('Error processing MQTT message:', err);
  }
});

// Run initial tick to set things up on boot
simulator.tickSimulation();

// Global function to broadcast telemetry for a zone instantly over MQTT
function publishTelemetry(zoneId) {
  try {
    const state = simulator.loadState();
    const zone = state.zones.find(z => z.zone_id === zoneId.toUpperCase());
    if (!zone) return;
    const time = state.simulation_time;
    const telemetryTopic = `smartfarm/zones/${zone.zone_id}/telemetry`;
    const telemetryData = {
      timestamp: `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
      zone_id: zone.zone_id,
      crop: zone.crop,
      temperature: zone.temperature,
      humidity: zone.humidity,
      soil_moisture: zone.soil_moisture,
      light: zone.light,
      irrigation: zone.irrigation ? 'ON' : 'OFF',
      alert: zone.alert,
      smart_trigger_mode: state.smart_trigger_mode || 'AUTOMATED'
    };
    
    mqttClient.publish(telemetryTopic, JSON.stringify(telemetryData));
  } catch (err) {
    console.error(`Error publishing MQTT telemetry for zone ${zoneId}:`, err);
  }
}
global.publishTelemetry = publishTelemetry;

// Start simulation ticks: runs dynamically based on simulation speed
function runSimulationLoop() {
  tickTimerId = setTimeout(() => {
    try {
      const updatedState = simulator.tickSimulation();
      const time = updatedState.simulation_time;
      
      // Log occasionally on the server console
      if (time.minute === 0) {
        console.log(`[Sim Tick] Time ${time.hour.toString().padStart(2, '0')}:00 - Temp: ${updatedState.weather.ambient_temperature}°C - Weather: ${updatedState.weather.condition}`);
      }

      // Publish telemetry for each zone to MQTT so Wokwi ESP32 can consume it
      updatedState.zones.forEach(zone => {
        publishTelemetry(zone.zone_id);
      });

    } catch (error) {
      console.error('Error during simulation loop execution:', error);
    }
    // Schedule the next tick
    runSimulationLoop();
  }, tickIntervalMs);
}

// Start initial execution
runSimulationLoop();

// API endpoint to change the simulation speed dynamically
app.post('/api/simulation-speed', (req, res) => {
  const { speed } = req.body;
  if (speed === 'DEMO') {
    tickIntervalMs = 3000;
    console.log('🔄 Simulation speed switched to: DEMO (3s ticks)');
  } else {
    tickIntervalMs = 60000;
    console.log('🔄 Simulation speed switched to: REALTIME (60s ticks)');
  }
  // Clear active timeout and run immediately to apply changes
  if (tickTimerId) {
    clearTimeout(tickTimerId);
  }
  runSimulationLoop();
  res.json({ success: true, speed, interval: tickIntervalMs });
});

// Helper to detect language
function detectLanguage(text) {
  const hasMalayalam = /[\u0D00-\u0D7F]/.test(text);
  const hasKannada = /[\u0C80-\u0CFF]/.test(text);
  const hasHindi = /[\u0900-\u097F]/.test(text);
  
  const mlKeywords = ["നെല്ല്", "അടയ്ക്ക", "വെള്ളം", "രോഗം", "കാലാവസ്ഥ", "മേഖല", "ചെടി", "എങ്ങനെ"];
  const knKeywords = ["ಬತ್ತ", "ಅಡಿಕೆ", "ನೀರು", "ರೋಗ", "ಹೇಗಿದೆ", "ವಲಯ", "ಕೃಷಿ", "ತಾಪಮಾನ"];
  const hiKeywords = ["धान", "सुपारी", "फसल", "पानी", "मौसम", "तापमान", "कैसी"];
  
  const textLower = text.toLowerCase();
  if (hasMalayalam || mlKeywords.some(k => textLower.includes(k))) return 'ml';
  if (hasKannada || knKeywords.some(k => textLower.includes(k))) return 'kn';
  if (hasHindi || hiKeywords.some(k => textLower.includes(k))) return 'hi';
  return 'en';
}

function generateNlgResponse(zones, weather, lang, question) {
  const zoneA = (zones && zones.find(z => z.zone_id === 'A')) || (zones && zones[0]) || { crop: 'Paddy', soil_moisture: 65, temperature: 27, irrigation: false, alert: 'NONE' };
  const zoneB = (zones && zones.find(z => z.zone_id === 'B')) || (zones && zones[1]) || { crop: 'Arecanut', soil_moisture: 55, temperature: 28, irrigation: false, alert: 'NONE' };

  const questionLower = (question || "").toLowerCase();
  const isPaddyQuery = questionLower.includes('paddy') || questionLower.includes('rice') || questionLower.includes('zone a') || questionLower.includes('നെല്ല്') || questionLower.includes('ഭത്ത') || questionLower.includes('ಬತ್ತ') || questionLower.includes('ಧಾನ್');
  const isArecaQuery = questionLower.includes('arecanut') || questionLower.includes('betel') || questionLower.includes('zone b') || questionLower.includes('അടയ്ക്ക') || questionLower.includes('കമുക്') || questionLower.includes('ಅಡಿಕೆ') || questionLower.includes('ಸುಪಾರಿ');

  const greetingKeys = ["hello", "hi", "hey", "namaste", "ഹലോ", "ഹായ്", "ഹേയ്", "നമസ്കാരം", "ಹಲೋ", "ಹಾಯ್", "ಹೇ", "ನಮಸ್ಕಾರ", "नमस्ते"];
  const isGreeting = greetingKeys.some(k => questionLower.includes(k));

  if (lang === 'kn') {
    if (isGreeting) {
      return `ನಮಸ್ಕಾರ! ಸಸ್ಯಮಿತ್ರ ಕೃಷಿ ಸಹಾಯಕ್ಕೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಭತ್ತ (ವಲಯ A) ಮತ್ತು ಅಡಿಕೆ (ವಲಯ B) ತೋಟದ ಸ್ಥಿತಿಗತಿಯನ್ನು ನಾನು ತಿಳಿಸಬಲ್ಲೆ.`;
    }
    if (isArecaQuery) {
      return `ವಲಯ B ಯಲ್ಲಿರುವ ಅಡಿಕೆ ಬೆಳೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ ${zoneB.soil_moisture}% ಮತ್ತು ತಾಪಮಾನ ${zoneB.temperature}°C ಇದೆ. ${zoneB.irrigation ? 'ನೀರು ಸರಬರಾಜು ಚಾಲನೆಯಲ್ಲಿದೆ.' : (zoneB.soil_moisture < 35 ? 'ತೇವಾಂಶ ಕಡಿಮೆಯಿದೆ, ನೀರುಣಿಸುವುದು ಉತ್ತಮ.' : 'ಬೆಳೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.')}`;
    }
    if (isPaddyQuery) {
      return `ವಲಯ A ಯಲ್ಲಿರುವ ಭತ್ತದ ಬೆಳೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ ${zoneA.soil_moisture}% ಮತ್ತು ತಾಪಮಾನ ${zoneA.temperature}°C ಇದೆ. ${zoneA.irrigation ? 'ಪಂಪ್ ಚಾಲನೆಯಲ್ಲಿದೆ.' : (zoneA.soil_moisture < 50 ? 'ನೀರಿನ ಪ್ರಮಾಣ ಕಡಿಮೆಯಿದೆ, ನೀರುಣಿಸಿ.' : 'ಸ್ಥಿತಿ ಉತ್ತಮವಾಗಿದೆ.')}`;
    }
    return `ನಿಮ್ಮ ತೋಟದಲ್ಲಿ ಭತ್ತದ (ವಲಯ A) ತೇವಾಂಶ ${zoneA.soil_moisture}% ಮತ್ತು ಅಡಿಕೆಯ (ವಲಯ B) ತೇವಾಂಶ ${zoneB.soil_moisture}% ಇದೆ. ಹವಾಮಾನವು ${weather.condition} ಆಗಿದೆ.`;
  } else if (lang === 'ml') {
    if (isGreeting) {
      return `നമസ്കാരം! സസുമിത്ര ഫാം സഹായിയിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ നെല്ല് (മേഖല A), അടയ്ക്ക (മേഖല B) തോട്ടങ്ങളുടെ വിവരങ്ങൾ ഞാൻ പറഞ്ഞുതരാം.`;
    }
    if (isArecaQuery) {
      return `മേഖല B യിലെ അടയ്ക്ക തോട്ടത്തിൽ മണ്ണിലെ ഈർപ്പം ${zoneB.soil_moisture}% ആണ്. ${zoneB.irrigation ? 'നനയ്ക്കൽ നടക്കുന്നു.' : (zoneB.soil_moisture < 35 ? 'ഈർപ്പം കുറവാണ്, നനയ്ക്കുന്നത് നന്നായിരിക്കും.' : 'വിള സുരക്ഷിതമാണ്.')}`;
    }
    if (isPaddyQuery) {
      return `മേഖല A യിലെ നെൽകൃഷിയിൽ മണ്ണിലെ ഈർപ്പം ${zoneA.soil_moisture}% ആണ്. ${zoneA.irrigation ? 'പമ്പ് പ്രവർത്തിക്കുന്നു.' : (zoneA.soil_moisture < 50 ? 'വെള്ളം കുറവാണ്, പമ്പ് ഓൺ ചെയ്യുക.' : 'നില മികച്ചതാണ്.')}`;
    }
    return `നിങ്ങളുടെ തോട്ടത്തിൽ നെല്ലിന്റെ ഈർപ്പം ${zoneA.soil_moisture}% ഉം അടയ്ക്കയുടെ ഈർപ്പം ${zoneB.soil_moisture}% ഉം ആണ്. ഇപ്പോഴത്തെ കാലാവസ്ഥ ${weather.condition} ആണ്.`;
  } else if (lang === 'hi') {
    if (isGreeting) {
      return `नमस्ते किसान भाई! सस्यमित्र सहायक में आपका स्वागत है। मैं आपके धान (जोन A) और सुपारी (जोन B) की वास्तविक स्थिति बता सकता हूँ।`;
    }
    if (isArecaQuery) {
      return `जोन B में सुपारी की फसल में नमी ${zoneB.soil_moisture}% और तापमान ${zoneB.temperature}°C है। ${zoneB.irrigation ? 'सिंचाई चालू है।' : (zoneB.soil_moisture < 35 ? 'नमी कम है, सिंचाई की सलाह दी जाती है।' : 'फसल स्वस्थ है।')}`;
    }
    if (isPaddyQuery) {
      return `जोन A में धान की फसल में नमी ${zoneA.soil_moisture}% और तापमान ${zoneA.temperature}°C है। ${zoneA.irrigation ? 'पंप चालू है।' : (zoneA.soil_moisture < 50 ? 'पानी की आवश्यकता है।' : 'स्थिति अनुकूल है।')}`;
    }
    return `आपके खेत में धान (जोन A) की नमी ${zoneA.soil_moisture}% और अरेकानट (जोन B) की नमी ${zoneB.soil_moisture}% है। मौसम ${weather.condition} है।`;
  } else {
    if (isGreeting) {
      return `Hello! Welcome to SasyaMitra. I can give you real-time updates on your Paddy in Zone A and Arecanut in Zone B. How can I help?`;
    }
    if (isArecaQuery) {
      return `In Zone B, your Arecanut plantation has ${zoneB.soil_moisture}% soil moisture at ${zoneB.temperature}°C. ${zoneB.irrigation ? 'Irrigation is currently active.' : (zoneB.soil_moisture < 35 ? 'Soil is getting dry, irrigation is recommended.' : 'Moisture is healthy.')}`;
    }
    if (isPaddyQuery) {
      return `In Zone A, your Paddy field has ${zoneA.soil_moisture}% soil moisture at ${zoneA.temperature}°C. ${zoneA.irrigation ? 'The water pump is actively running.' : (zoneA.soil_moisture < 50 ? 'Moisture is below optimal for paddy, consider pumping water.' : 'Crop condition is optimal.')}`;
    }
    return `On your farm, Zone A Paddy is at ${zoneA.soil_moisture}% moisture (${zoneA.crop_health}), and Zone B Arecanut is at ${zoneB.soil_moisture}% moisture (${zoneB.crop_health}). The weather is ${weather.condition}.`;
  }
}

// API endpoint for voice-recognition chat integration
app.get('/api/voice-chat', async (req, res) => {
  const query = req.query.query || "";
  if (!query) {
    return res.json({ response: "No query text provided." });
  }

  const state = simulator.loadState();
  const zoneA = (state.zones && state.zones.find(z => z.zone_id === 'A')) || state.zones[0];
  const zoneB = (state.zones && state.zones.find(z => z.zone_id === 'B')) || state.zones[1] || zoneA;
  const weather = state.weather;
  const lang = detectLanguage(query);

  const contextStr = `
GROUND-TRUTH FARM CONTEXT:
Platform: SasyaMitra Smart Agri-Digital Twin
General Weather: ${weather.condition}, Ambient Temp: ${weather.ambient_temperature || weather.temperature}°C, Humidity: ${weather.ambient_humidity || weather.humidity}%, Barometric Pressure: ${weather.barometric_pressure} hPa

CROPS ON THIS FARM (STRICTLY ONLY PADDY AND ARECANUT):
1. ZONE A - PADDY (Rice Field):
   - Crop: Paddy
   - Soil Moisture: ${zoneA.soil_moisture}% (Optimal range: 60% - 80%; critically dry if below 40%)
   - Field Temperature: ${zoneA.temperature}°C
   - Humidity: ${zoneA.humidity}%
   - Irrigation Pump: ${zoneA.irrigation ? 'ACTIVE (PUMPING WATER)' : 'OFF (STANDBY)'}
   - Edge Crop Health (XGBoost): ${zoneA.crop_health}
   - Weather Forecast: ${zoneA.weather_forecast || 'STABLE'}
   - Alert Status: ${zoneA.alert}

2. ZONE B - ARECANUT (Betel Nut Plantation):
   - Crop: Arecanut
   - Soil Moisture: ${zoneB.soil_moisture}% (Optimal range: 45% - 65%; critically dry if below 30%)
   - Field Temperature: ${zoneB.temperature}°C
   - Humidity: ${zoneB.humidity}%
   - Irrigation Valve: ${zoneB.irrigation ? 'ACTIVE (IRRIGATING)' : 'OFF (STANDBY)'}
   - Edge Crop Health (XGBoost): ${zoneB.crop_health}
   - Weather Forecast: ${zoneB.weather_forecast || 'STABLE'}
   - Alert Status: ${zoneB.alert}
`;

  let aiResponse = null;

  // 1. Try Groq API first (Online LLM)
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey && groqApiKey !== 'your_groq_api_key_here') {
    try {
      console.log('[API Voice Chat] Attempting Groq API...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [
            {
              role: 'system',
              content: `You are "SasyaMitra Farm Copilot" — an expert AI agronomist dedicated to this specific farm.
MANDATORY RULES:
1. CROPS ON THIS FARM: This farm has ONLY TWO crops:
   - Zone A is PADDY (Rice)
   - Zone B is ARECANUT (Betel nut plantation)
   EXACT CROP NAMES PER LANGUAGE (Use ONLY these words):
   - English: "Paddy" (Zone A) and "Arecanut" (Zone B).
   - Kannada: "ಭತ್ತ" (Zone A) and "ಅಡಿಕೆ" (Zone B). Never say ಗೋಧಿ or ತೆಂಗು!
   - Malayalam: "നെല്ല്" (Zone A) and "അടയ്ക്ക" (Zone B).
   - Hindi: "धान" (Zone A) and "सुपारी" (Zone B).
2. STRICT DATA ACCURACY:
   - Quote the EXACT live sensor numbers provided in the telemetry above (e.g. "${zoneA.soil_moisture}% for Paddy", "${zoneB.soil_moisture}% for Arecanut").
   - If the user asks generally ("how are my crops?", "farm status?"), report on BOTH Paddy (Zone A) and Arecanut (Zone B) with their live moisture and health.
   - If the user asks specifically about Paddy, focus on Zone A.
   - If the user asks specifically about Arecanut, focus on Zone B.
3. CONVERSATIONAL TONE & VOICE FORMATTING:
   - Keep answers concise: 2 to 3 sentences maximum.
   - Respond directly without preamble (do NOT say "since you asked in Kannada I will reply in Kannada").
   - No asterisks (*), markdown formatting, bold text, or bullet points, because your output will be directly read aloud by Text-to-Speech!
4. LANGUAGE:
   - If user asks in Malayalam, reply in natural, fluent Malayalam.
   - If user asks in Kannada, reply in natural, fluent Kannada.
   - If user asks in Hindi, reply in natural, fluent Hindi.
   - Otherwise, reply in English.

${contextStr}`
            },
            { role: 'user', content: query }
          ],
          temperature: 0.6,
          max_tokens: 250
        }),
        signal: AbortSignal.timeout(4000)
      });

      if (response.status === 200) {
        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content?.trim();
        console.log('[API Voice Chat] Groq response successful.');
      } else {
        console.warn(`[API Voice Chat] Groq returned status ${response.status}`);
      }
    } catch (err) {
      console.log('[API Voice Chat] Groq call failed or timed out:', err.message);
    }
  }

  // 2. Try Local Ollama if Groq wasn't used or failed
  if (!aiResponse) {
    try {
      console.log('[API Voice Chat] Attempting local Ollama...');
      const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3:4b',
          messages: [
            {
              role: 'system',
              content: `You are SasyaMitra Farm Copilot. This farm strictly has only Paddy (Zone A) and Arecanut (Zone B). Answer concisely in 2 sentences based on this live telemetry:\n${contextStr}`
            },
            { role: 'user', content: query }
          ],
          temperature: 0.6,
          max_tokens: 200,
          stream: false
        }),
        signal: AbortSignal.timeout(3000)
      });

      if (ollamaResponse.status === 200) {
        const data = await ollamaResponse.json();
        aiResponse = data.choices?.[0]?.message?.content?.trim() || data.response?.trim();
        console.log('[API Voice Chat] Local Ollama response successful.');
      }
    } catch (err) {
      console.log('[API Voice Chat] Local Ollama not available. Using local NLG...');
    }
  }

  // 3. Fallback to local rule-based NLG
  if (!aiResponse) {
    aiResponse = generateNlgResponse(state.zones, weather, lang, query);
  }

  // 4. Try Sarvam TTS if API key is configured
  let base64Audio = null;
  const sarvamApiKey = process.env.SARVAM_API_KEY;
  if (sarvamApiKey && sarvamApiKey !== 'your_sarvam_api_key_here') {
    try {
      console.log('[API Voice Chat] Attempting Sarvam TTS...');
      let targetLang = 'en-IN';
      if (lang === 'ml') targetLang = 'ml-IN';
      else if (lang === 'kn') targetLang = 'kn-IN';
      else if (lang === 'hi') targetLang = 'hi-IN';

      const ttsResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': sarvamApiKey
        },
        body: JSON.stringify({
          text: aiResponse,
          target_language_code: targetLang,
          speaker: 'shubh',
          model: 'bulbul:v3'
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (ttsResponse.status === 200) {
        const ttsData = await ttsResponse.json();
        if (ttsData.audios && ttsData.audios[0]) {
          base64Audio = ttsData.audios[0];
          console.log('[API Voice Chat] Sarvam TTS conversion successful.');
        }
      } else {
        console.warn(`[API Voice Chat] Sarvam TTS returned status ${ttsResponse.status}`);
      }
    } catch (err) {
      console.log('[API Voice Chat] Sarvam TTS failed:', err.message);
    }
  }

  console.log(`[Voice Chat API] Q: "${query}" (${lang.toUpperCase()}) -> A: "${aiResponse}"`);
  res.json({
    success: true,
    transcription: query,
    language: lang,
    response: aiResponse,
    audio: base64Audio
  });
});

// Start Listening HTTP Server for Dashboard Polling
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🌱 SMART AGRICULTURE DIGITAL TWIN SIMULATOR BACKEND RUNNING`);
  console.log(`================================================================`);
  console.log(`Express HTTP Port: ${PORT}`);
  console.log(`MQTT Server:       ${MQTT_BROKER}`);
  console.log(`MQTT Telemetry:    smartfarm/zones/:zoneId/telemetry`);
  console.log(`MQTT Controls:     smartfarm/zones/:zoneId/control`);
  console.log(`Simulation Loop:   Running every ${tickIntervalMs / 1000} seconds`);
  console.log(`================================================================`);
});

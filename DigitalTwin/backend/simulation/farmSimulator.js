const fs = require('fs');
const path = require('path');
const { calculateWeather } = require('./weatherModel');
const { calculateSoilMoisture } = require('./soilModel');

const STATE_FILE_PATH = path.join(__dirname, '../data/farmState.json');

// In-memory cache of the state
let currentState = null;

// Parse agriculture dataset CSV
const csvRecords = parseAgricultureCsv();
let csvRecordIndex = 0;

// Load trained model weights from JSON
let modelWeights = null;
try {
  const weightsPath = path.join(__dirname, 'model_weights.json');
  if (fs.existsSync(weightsPath)) {
    modelWeights = JSON.parse(fs.readFileSync(weightsPath, 'utf8'));
    console.log('[SIMULATOR] Successfully loaded neural network weights for JS predictions.');
  }
} catch (err) {
  console.error('[SIMULATOR] Error loading neural network weights:', err);
}

// Neural Network Predict Function in JavaScript
function predictCropMetrics(temp, hum, soilMoisture, solarRadiation) {
  if (!modelWeights) {
    // Fallback if weights are not loaded
    const waterNeed = Math.max(0.0, Math.min(100.0, ((45.0 - soilMoisture) / 40.0) * 100.0));
    const cropHealth = soilMoisture < 20.0 ? 'WATER_STRESSED' : (temp > 38.0 ? 'HEAT_STRESSED' : 'HEALTHY');
    return { crop_health: cropHealth, water_requirement_score: parseFloat(waterNeed.toFixed(1)) };
  }

  // 1. Normalize Inputs
  const x = [
    (temp - 15.0) / 25.0,
    (hum - 30.0) / 65.0,
    (soilMoisture - 5.0) / 40.0,
    (solarRadiation - 200.0) / 800.0
  ];

  // 2. Feed Hidden Layer (Matrix multiply + Bias + ReLU activation)
  const h = [];
  const W1 = modelWeights.W1;
  const b1 = modelWeights.b1[0] || modelWeights.b1;

  for (let j = 0; j < 5; j++) {
    let sum = b1[j];
    for (let i = 0; i < 4; i++) {
      sum += x[i] * W1[i][j];
    }
    h[j] = Math.max(0.0, sum); // ReLU
  }

  // 3. Classification Output (Softmax logits)
  const c_logits = [];
  const W_class = modelWeights.W_class;
  const b_class = modelWeights.b_class[0] || modelWeights.b_class;

  for (let j = 0; j < 3; j++) {
    let sum = b_class[j];
    for (let i = 0; i < 5; i++) {
      sum += h[i] * W_class[i][j];
    }
    c_logits[j] = sum;
  }

  // Argmax
  let bestClass = 0;
  let maxLogit = c_logits[0];
  for (let j = 1; j < 3; j++) {
    if (c_logits[j] > maxLogit) {
      maxLogit = c_logits[j];
      bestClass = j;
    }
  }

  // 4. Regression Output (Sigmoid mapping)
  const W_reg = modelWeights.W_reg;
  const b_reg = modelWeights.b_reg[0] || modelWeights.b_reg;

  let r_logit = b_reg[0];
  for (let i = 0; i < 5; i++) {
    r_logit += h[i] * W_reg[i][0];
  }
  const sigmoidVal = 1.0 / (1.0 + Math.exp(-r_logit));
  const waterScore = sigmoidVal * 100.0;

  const cropHealthStrings = ["HEALTHY", "WATER_STRESSED", "HEAT_STRESSED"];
  return {
    crop_health: cropHealthStrings[bestClass],
    water_requirement_score: parseFloat(waterScore.toFixed(1))
  };
}

function parseAgricultureCsv() {
  try {
    const csvPath = path.join(__dirname, '../agriculture_dataset_with_target.csv');
    if (!fs.existsSync(csvPath)) {
      console.log('[SIMULATOR] Agriculture dataset CSV not found at:', csvPath);
      return [];
    }
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      if (values.length !== headers.length) continue;

      const record = {};
      headers.forEach((header, idx) => {
        record[header] = values[idx].trim();
      });
      records.push(record);
    }
    console.log(`[SIMULATOR] Successfully loaded ${records.length} records from dataset CSV.`);
    return records;
  } catch (error) {
    console.error('Error parsing CSV dataset:', error);
    return [];
  }
}

// When ESP32 pushes live sensor data, pause simulation overrides for that zone
const esp32LiveZones = {};
const ESP32_LIVE_TTL_MS = 15000;

// Read state from disk or initialize it if cache is empty
function loadState() {
  if (currentState) return currentState;

  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      const fileData = fs.readFileSync(STATE_FILE_PATH, 'utf8');
      currentState = JSON.parse(fileData);
      if (currentState && currentState.zones) {
        currentState.zones.forEach(z => {
          if (z.zone_id === 'A') z.crop = 'Paddy';
          if (z.zone_id === 'B') z.crop = 'Arecanut';
          if (z.zone_id === 'C') z.crop = 'Paddy (Sec)';
        });
      }
      return currentState;
    }
  } catch (error) {
    console.error('Error loading farm state file:', error);
  }

  // Fallback state if file cannot be read
  currentState = {
    farm_id: "SMART_FARM_001",
    simulation_time: { hour: 8, minute: 0, day_phase: "Morning" },
    weather: { condition: "SUNNY", ambient_temperature: 22.0, ambient_humidity: 60.0, barometric_pressure: 1013.0 },
    zones: [
      { zone_id: "A", crop: "Paddy", temperature: 26.5, humidity: 75.0, soil_moisture: 70.0, light: 800, irrigation: false, alert: "NONE", battery_capacity_mah: 2000.0, current_draw_ma: 80.0, battery_time_remaining_hours: 25.0, battery: 100.0, crop_health: "HEALTHY", water_requirement: 0.0, weather_forecast: "STABLE" },
      { zone_id: "B", crop: "Arecanut", temperature: 27.0, humidity: 72.0, soil_moisture: 55.0, light: 750, irrigation: false, alert: "NONE", battery_capacity_mah: 2000.0, current_draw_ma: 80.0, battery_time_remaining_hours: 25.0, battery: 100.0, crop_health: "HEALTHY", water_requirement: 0.0, weather_forecast: "STABLE" },
      { zone_id: "C", crop: "Paddy (Sec)", temperature: 26.0, humidity: 74.0, soil_moisture: 68.0, light: 800, irrigation: false, alert: "NONE", battery_capacity_mah: 2000.0, current_draw_ma: 80.0, battery_time_remaining_hours: 25.0, battery: 100.0, crop_health: "HEALTHY", water_requirement: 0.0, weather_forecast: "STABLE" }
    ],
    logs: [{ timestamp: "08:00:00", message: "Digital Twin Farm Simulation initialized." }],
    smart_trigger_mode: "AUTOMATED"
  };
  saveState();
  return currentState;
}

// Save state to disk
function saveState() {
  if (!currentState) return;
  try {
    // Ensure data directory exists
    const dir = path.dirname(STATE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(currentState, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving farm state file:', error);
  }
}

// Add a log entry with local time format
function addLog(message) {
  if (!currentState) loadState();

  const now = new Date();
  const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS

  currentState.logs.unshift({ timestamp, message });

  // Keep logs at a reasonable size (max 50)
  if (currentState.logs.length > 50) {
    currentState.logs.pop();
  }
}

// Update weather conditions (can be triggered from dashboard)
function setWeatherCondition(condition) {
  if (!currentState) loadState();

  const validConditions = ['SUNNY', 'CLOUDY', 'RAINY', 'HEATWAVE', 'STORM'];
  if (validConditions.includes(condition)) {
    currentState.weather.condition = condition;
    addLog(`Weather condition manually set to ${condition}`);
    saveState();
    return true;
  }
  return false;
}

// Perform a single simulation step
function tickSimulation() {
  const state = loadState();

  // Advance dataset record index
  if (csvRecords.length > 0) {
    csvRecordIndex = (csvRecordIndex + 1) % csvRecords.length;
  }

  // 1. Advance simulation time
  // Each tick represents 15 minutes of farm time
  let { hour, minute } = state.simulation_time;
  minute += 15;
  if (minute >= 60) {
    hour += 1;
    minute = 0;
  }
  if (hour >= 24) {
    hour = 0;
  }
  state.simulation_time.hour = hour;
  state.simulation_time.minute = minute;

  // Format visual hour:minute string
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  // 2. Calculate ambient weather details
  const ambientWeather = calculateWeather(hour + minute / 60, state.weather.condition);
  state.simulation_time.day_phase = ambientWeather.day_phase;
  state.weather.ambient_temperature = ambientWeather.temperature;
  state.weather.ambient_humidity = ambientWeather.humidity;
  state.weather.barometric_pressure = ambientWeather.barometric_pressure;

  // Track barometric pressure history for trend calculation
  if (!state.weather.pressure_history) {
    state.weather.pressure_history = [];
  }
  state.weather.pressure_history.push(ambientWeather.barometric_pressure);
  if (state.weather.pressure_history.length > 12) {
    state.weather.pressure_history.shift();
  }
  const oldestPressure = state.weather.pressure_history[0];
  const currentPressure = ambientWeather.barometric_pressure;
  const pressureTrend = parseFloat((currentPressure - oldestPressure).toFixed(1));

  // Log phase transitions
  if (minute === 0 && (hour === 5 || hour === 11 || hour === 17 || hour === 21)) {
    addLog(`Transitioning into ${ambientWeather.day_phase} phase. Time is ${timeStr}.`);
  }

  // 3. Update each zone (skip zones fed by live ESP32 telemetry)
  state.zones = state.zones.map((zone, zoneIdx) => {
    // Determine power metrics first
    let isIrrigating = zone.irrigation;
    let currentDraw = isIrrigating ? 250.0 : 80.0;

    // Solar panel generation: peak is 180mA at 4095 light
    const lightVal = zone.light !== undefined ? zone.light : 800;
    const solarGeneration = (lightVal / 4095.0) * 180.0;

    const capacity = zone.battery_capacity_mah !== undefined ? zone.battery_capacity_mah : 2000.0;

    // Net capacity change: 15 minutes = 0.25 hours
    const capacityChange = (solarGeneration - currentDraw) * 0.25;
    let nextCapacity = Math.min(2000.0, Math.max(0.0, capacity + capacityChange));

    if (nextCapacity <= 0.0) {
      isIrrigating = false;
      currentDraw = 5.0; // Deep Sleep standby if battery dies
      nextCapacity = 0.0;
      // Only log occasionally to prevent flooding the logs
      if (Math.random() < 0.05) {
        addLog(`[WARNING] Zone ${zone.zone_id} battery is dead! Entering emergency low-power deep sleep.`);
      }
    }

    const timeRemaining = nextCapacity > 0.0 ? parseFloat((nextCapacity / currentDraw).toFixed(1)) : 0.0;
    const batteryPercent = parseFloat(((nextCapacity / 2000.0) * 100.0).toFixed(1));

    const liveUntil = esp32LiveZones[zone.zone_id];
    if (liveUntil && Date.now() < liveUntil) {
      // Still update battery and irrigation status on active zones
      return {
        ...zone,
        irrigation: isIrrigating,
        battery_capacity_mah: parseFloat(nextCapacity.toFixed(1)),
        current_draw_ma: currentDraw,
        battery_time_remaining_hours: timeRemaining,
        battery: batteryPercent
      };
    }

    // Load baseline data from the real CSV dataset (each zone gets an offset index)
    let record = null;
    if (csvRecords.length > 0) {
      const idx = (csvRecordIndex + zoneIdx * 150) % csvRecords.length;
      record = csvRecords[idx];
    }

    // Baseline variables from dataset
    let zoneTemp = record ? parseFloat(Number(record.Air_Temperature).toFixed(1)) : parseFloat((ambientWeather.temperature).toFixed(1));
    let zoneHum = record ? parseFloat(Number(record.Humidity).toFixed(1)) : parseFloat((ambientWeather.humidity).toFixed(1));

    // Solar radiation in CSV ranges 200-1000. Map it to 12-bit ADC light range (0-4095) for ESP32 compatibility:
    let rawRad = record ? parseFloat(record.Solar_Radiation) : 800.0;
    let zoneLight = Math.round((rawRad / 1000.0) * 4095.0);
    zoneLight = Math.max(0, Math.min(4095, zoneLight));

    // Soil Moisture blending:
    let nextMoisture = zone.soil_moisture;
    if (isIrrigating) {
      // Watering: increases moisture
      nextMoisture = Math.min(100.0, nextMoisture + 6.0 + Math.random() * 2.0);
    } else {
      // Normal: follow the dataset's real moisture
      nextMoisture = record ? parseFloat(Number(record.Soil_Moisture).toFixed(1)) : 25.0;
    }
    nextMoisture = parseFloat(nextMoisture.toFixed(1));

    // Log moisture levels dipping below thresholds
    if (zone.soil_moisture >= 30 && nextMoisture < 30 && !isIrrigating) {
      addLog(`[WARNING] Zone ${zone.zone_id} (${zone.crop}) soil moisture critically dry: ${nextMoisture}%!`);
    }

    // Predict weather and crop metrics using meteorology rules (representing Edge ML)
    let forecast = zone.weather_forecast || 'STABLE';
    let waterNeed = zone.water_requirement || 0.0;
    let cropHealth = zone.crop_health || 'HEALTHY';

    if (pressureTrend < -2.5 && currentPressure < 995.0) {
      forecast = 'STORM_ALERT';
      waterNeed = 0.0;
      cropHealth = 'HEALTHY';
    } else if (pressureTrend < -0.8 && currentPressure < 1008.0) {
      forecast = 'RAIN_COMING';
      waterNeed = 5.0;
      cropHealth = 'HEALTHY';
    } else {
      forecast = 'STABLE';
      // Neural Network Regression: (45 - Moisture) / 40 * 100
      waterNeed = ((45.0 - nextMoisture) / 40.0) * 100.0;
      waterNeed = parseFloat(Math.max(0.0, Math.min(100.0, waterNeed)).toFixed(1));

      // Neural Network Classification: Crop_Health from dataset or fallback
      if (record && record.Crop_Health) {
        if (record.Crop_Health === 'High_Stress') {
          cropHealth = nextMoisture < 20 ? 'WATER_STRESSED' : 'HEAT_STRESSED';
        } else if (record.Crop_Health === 'Moderate_Stress') {
          cropHealth = 'WATER_STRESSED';
        } else {
          cropHealth = 'HEALTHY';
        }
      } else {
        if (nextMoisture < 35.0) {
          cropHealth = 'WATER_STRESSED';
        } else if (zoneTemp > 38.0) {
          cropHealth = 'HEAT_STRESSED';
        } else {
          cropHealth = 'HEALTHY';
        }
      }
    }

    // Run automated fallback edge decision logic if ESP32 is offline and battery is functional
    let nextAlert = zone.alert || "NONE";
    if (nextCapacity > 0.0) {
      const triggerMode = state.smart_trigger_mode || "AUTOMATED";
      if (nextMoisture < 15.0 && forecast !== 'STORM_ALERT' && !isIrrigating) {
        if (triggerMode === 'AUTOMATED') {
          isIrrigating = true;
          currentDraw = 250.0;
          addLog(`[SIM-CONTROL] Zone ${zone.zone_id} (${zone.crop}) irrigation turned ON automatically (moisture ${nextMoisture}%)`);
        } else {
          if (nextAlert !== 'NEEDS_WATER') {
            nextAlert = 'NEEDS_WATER';
            addLog(`[PENDING] Zone ${zone.zone_id} (${zone.crop}) needs irrigation (moisture ${nextMoisture}%). Awaiting farmer approval.`);
          }
        }
      } else if ((nextMoisture > 40.0 || forecast === 'STORM_ALERT') && isIrrigating) {
        isIrrigating = false;
        currentDraw = 80.0;
        addLog(`[SIM-CONTROL] Zone ${zone.zone_id} (${zone.crop}) irrigation turned OFF automatically (moisture ${nextMoisture}%)`);
      }
    }

    if (isIrrigating && nextAlert === 'NEEDS_WATER') {
      nextAlert = 'NONE';
    }

    // Sustained Fungal Incubation Tracking (Anti-Jitter / Leaf Wetness Duration)
    const isFavorable = (zoneHum >= 88.0 && zoneTemp >= 22.0 && zoneTemp <= 35.0);
    let consecutiveTicks = zone.fungal_consecutive_ticks || 0;
    if (isFavorable) {
      consecutiveTicks += 1;
    } else {
      consecutiveTicks = Math.max(0, consecutiveTicks - 1);
    }
    const hoursSustained = parseFloat((consecutiveTicks * 0.25).toFixed(1)); // each tick is 15 min = 0.25h
    let fungalRisk = 'LOW';
    if (consecutiveTicks >= 6) { // >= 1.5 hours of continuous high humidity
      fungalRisk = 'HIGH';
    } else if (consecutiveTicks >= 2) { // 30 mins to 1.5 hours
      fungalRisk = 'WATCH';
    }

    return {
      ...zone,
      temperature: zoneTemp,
      humidity: zoneHum,
      light: zoneLight,
      soil_moisture: nextMoisture,
      irrigation: isIrrigating,
      alert: nextAlert,
      fungal_consecutive_ticks: consecutiveTicks,
      fungal_hours_sustained: hoursSustained,
      fungal_risk: fungalRisk,
      battery_capacity_mah: parseFloat(nextCapacity.toFixed(1)),
      current_draw_ma: currentDraw,
      battery_time_remaining_hours: timeRemaining,
      battery: batteryPercent,
      weather_forecast: forecast,
      water_requirement: waterNeed,
      crop_health: cropHealth
    };
  });

  if (state.demo_scene) {
    paintDemoScene(state, state.demo_scene);
  }

  saveState();
  return state;
}

// Accept live sensor readings from Wokwi ESP32 and map them to a farm zone
function ingestEsp32Telemetry(zoneId, telemetry) {
  const state = loadState();
  const id = zoneId.toUpperCase();
  const zone = state.zones.find(z => z.zone_id === id);

  if (!zone) {
    return { ok: false, error: `Zone ${id} not found` };
  }

  if (telemetry.temperature !== undefined) zone.temperature = parseFloat(Number(telemetry.temperature).toFixed(1));
  if (telemetry.humidity !== undefined) zone.humidity = parseFloat(Number(telemetry.humidity).toFixed(1));
  if (telemetry.soil_moisture !== undefined) zone.soil_moisture = parseFloat(Number(telemetry.soil_moisture).toFixed(1));
  if (telemetry.light !== undefined) zone.light = Math.round(Number(telemetry.light));

  esp32LiveZones[id] = Date.now() + ESP32_LIVE_TTL_MS;

  if (Math.random() < 0.15) {
    addLog(`[ESP32] Live telemetry received for Zone ${id}`);
  }

  saveState();
  return { ok: true, zone };
}

// Predict tomorrow's weather conditions and crop health/irrigation outcomes
function predictTomorrowOutcome(zoneId) {
  const state = loadState();
  const id = zoneId.toUpperCase();
  const zoneIdx = state.zones.findIndex(z => z.zone_id === id);
  if (zoneIdx === -1) return null;

  if (csvRecords.length === 0) return null;

  // Tomorrow is 24 hours (24 indices) ahead in the CSV dataset
  const tomorrowIdx = (csvRecordIndex + 24 + zoneIdx * 150) % csvRecords.length;
  const record = csvRecords[tomorrowIdx];

  const temp = parseFloat(Number(record.Air_Temperature).toFixed(1));
  const hum = parseFloat(Number(record.Humidity).toFixed(1));
  const moist = parseFloat(Number(record.Soil_Moisture).toFixed(1));
  const rawRad = parseFloat(record.Solar_Radiation);
  let light = Math.round((rawRad / 1000.0) * 4095.0);
  light = Math.max(0, Math.min(4095, light));

  // Run the Multi-Task Neural Network simulation for tomorrow
  const prediction = predictCropMetrics(temp, hum, moist, rawRad);

  // Tomorrow's expected Weather condition (approximate based on solar radiation & temp)
  let condition = "SUNNY";
  if (rawRad < 350.0) {
    condition = "CLOUDY";
  }
  if (hum > 85.0 && rawRad < 250.0) {
    condition = "RAINY";
  }

  // Tomorrow's predicted Irrigation Action
  const willIrrigate = moist < 15.0 && condition !== "STORM_ALERT";

  return {
    zone_id: id,
    timestamp_tomorrow: record.Timestamp,
    temperature: temp,
    humidity: hum,
    soil_moisture: moist,
    light: light,
    weather_condition: condition,
    predicted_crop_health: prediction.crop_health,
    predicted_water_requirement: prediction.water_requirement_score,
    will_irrigate: willIrrigate,
    source: "EDGE_ML_FORECAST_ENGINE"
  };
}

function paintDemoScene(state, scene) {
  const s = (scene || '').toUpperCase();
  if (!s || s === 'LIVE' || s === 'NONE') return;
  const paddy = state.zones.find(z => z.zone_id === 'A');
  const areca = state.zones.find(z => z.zone_id === 'B');
  const apply = (zone, moisture, temp, hum, irrigation, alert, forecast) => {
    if (!zone) return;
    zone.soil_moisture = moisture;
    zone.temperature = temp;
    zone.humidity = hum;
    zone.irrigation = irrigation;
    zone.alert = alert;
    zone.weather_forecast = forecast;
    if (hum >= 88) {
      zone.fungal_consecutive_ticks = 8;
      zone.fungal_hours_sustained = 2.0;
      zone.fungal_risk = 'HIGH';
    } else if (hum >= 78) {
      zone.fungal_consecutive_ticks = 3;
      zone.fungal_hours_sustained = 0.8;
      zone.fungal_risk = 'WATCH';
    } else {
      zone.fungal_consecutive_ticks = 0;
      zone.fungal_hours_sustained = 0.0;
      zone.fungal_risk = 'LOW';
    }
  };
  if (s === 'DRY') {
    state.weather.condition = 'SUNNY';
    state.weather.barometric_pressure = 1012;
    apply(paddy, 28, 31, 55, false, 'NEEDS_WATER', 'STABLE');
    apply(areca, 22, 32, 52, false, 'NEEDS_WATER', 'STABLE');
  } else if (s === 'HAPPY') {
    state.weather.condition = 'SUNNY';
    state.weather.barometric_pressure = 1014;
    apply(paddy, 72, 27, 68, false, 'NONE', 'STABLE');
    apply(areca, 52, 27, 65, false, 'NONE', 'STABLE');
  } else if (s === 'RAIN') {
    state.weather.condition = 'RAINY';
    state.weather.barometric_pressure = 1004;
    apply(paddy, 80, 25, 88, false, 'NONE', 'RAIN_COMING');
    apply(areca, 62, 25, 86, false, 'NONE', 'RAIN_COMING');
  } else if (s === 'STORM') {
    state.weather.condition = 'STORM';
    state.weather.barometric_pressure = 988;
    apply(paddy, 82, 24, 92, false, 'NONE', 'STORM_ALERT');
    apply(areca, 64, 24, 90, false, 'NONE', 'STORM_ALERT');
  } else if (s === 'FUNGAL') {
    state.weather.condition = 'CLOUDY';
    state.weather.barometric_pressure = 1010;
    apply(paddy, 70, 28, 92, false, 'NONE', 'STABLE');
    apply(areca, 50, 27, 90, false, 'NONE', 'STABLE');
  }
}

function applyDemoScene(scene) {
  const state = loadState();
  const s = (scene || 'LIVE').toUpperCase();
  if (s === 'LIVE' || s === 'NONE') {
    state.demo_scene = null;
    addLog('[DEMO] Live data restored');
  } else {
    state.demo_scene = s;
    paintDemoScene(state, s);
    addLog(`[DEMO] Scene set to ${s}`);
  }
  saveState();
  return true;
}

module.exports = {
  loadState,
  saveState,
  addLog,
  setWeatherCondition,
  tickSimulation,
  ingestEsp32Telemetry,
  predictTomorrowOutcome,
  applyDemoScene
};

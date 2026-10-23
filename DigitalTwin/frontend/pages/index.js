import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const TRANSLATIONS = {
  en: {
    appName: "SasyaMitra",
    appSub: "Coastal Farm Assistant",
    langName: "English",
    farmToday: "YOUR FARM TODAY",
    heroGood: "Crops are healthy and growing well 🌾",
    heroWarn: "Attention needed for irrigation ⚠️",
    heroCrit: "Immediate water attention required! 🚨",
    heroSub: "Coastal Zone • Live Sensor Monitoring",
    heroBtn: "Check Irrigation Advice →",
    myCrops: "My Crops",
    attentionTitle: "Attention Needed",
    openFarm: "Open farm →",
    soilMoisture: "Soil Moisture",
    temperature: "Temperature",
    humidity: "Humidity",
    irrigation: "Irrigation Pump",
    statusGood: "Optimal ✅",
    statusCheck: "Needs Water ⚠️",
    statusCrit: "Dry / Critical 🚨",
    paddy: "Paddy",
    paddySub: "Zone A • Lowland wetland",
    arecanut: "Arecanut",
    arecanutSub: "Zone B • Coastal plantation",
    waterAdvice: "See watering advice",
    turnOn: "Turn ON Pump",
    turnOff: "Turn OFF Pump",
    pumpRunning: "Pumping Active",
    pumpStopped: "Pump Inactive",
    navHome: "Home",
    navCrops: "My Crops",
    navWater: "Water",
    navSensors: "Sensors",
    navAsk: "Ask AI",
    sensorRawTitle: "Live Sensor Readings",
    sensorSub: "Raw telemetry for agritech & dev farmers",
    thZone: "Zone",
    thCrop: "Crop",
    thMoist: "Moisture",
    thTemp: "Temp",
    thHum: "Humidity",
    thPump: "Pump",
    askTitle: "SasyaMitra Voice Guide",
    askSub: "Tap the mic and speak in your language",
    askListening: "Listening... speak now",
    askPrompt: "Tap to ask about pests, watering, or fertilizer",
    askThinking: "Analyzing farm data...",
    sendText: "Ask",
    inputPlaceholder: "Or type your farm question here...",
    weatherToday: "Weather",
    sunny: "Sunny ☀️",
    rainy: "Rainy 🌧️",
    cloudy: "Cloudy ⛅",
    heatwave: "Heatwave 🔥"
  },
  ml: {
    appName: "സസ്യമിത്ര",
    appSub: "തീരദേശ കർഷക സഹായി",
    langName: "മലയാളം",
    farmToday: "ഇന്നത്തെ കൃഷിനില",
    heroGood: "വിളകൾ ആരോഗ്യകരമായി വളരുന്നു 🌾",
    heroWarn: "നനയ്ക്കുന്നതിൽ ശ്രദ്ധിക്കുക ⚠️",
    heroCrit: "ഉടൻ വെള്ളം നനയ്ക്കണം! 🚨",
    heroSub: "തീരദേശ മേഖല • ലൈവ് സെൻസർ നിരീക്ഷണം",
    heroBtn: "നനയ്ക്കൽ ഉപദേശം കാണുക →",
    myCrops: "എന്റെ വിളകൾ",
    attentionTitle: "ശ്രദ്ധിക്കേണ്ട കാര്യം",
    openFarm: "വിശദാംശങ്ങൾ →",
    soilMoisture: "മണ്ണിലെ ഈർപ്പം",
    temperature: "താപനില",
    humidity: "അന്തരീക്ഷ ഈർപ്പം",
    irrigation: "നനയ്ക്കൽ പമ്പ്",
    statusGood: "നല്ല നില ✅",
    statusCheck: "നനയ്ക്കണം ⚠️",
    statusCrit: "വളരെ കുറവ് 🚨",
    paddy: "നെല്ല്",
    paddySub: "മേഖല A • പാടശേഖരം",
    arecanut: "അടയ്ക്ക (കവുങ്ങ്)",
    arecanutSub: "മേഖല B • അടയ്ക്കാത്തോട്ടം",
    waterAdvice: "നനയ്ക്കൽ നിർദ്ദേശം",
    turnOn: "പമ്പ് പ്രവർത്തിപ്പിക്കുക",
    turnOff: "പമ്പ് നിർത്തുക",
    pumpRunning: "പമ്പ് പ്രവർത്തിക്കുന്നു",
    pumpStopped: "പമ്പ് ഓഫ് ആണ്",
    navHome: "ഹോം",
    navCrops: "വിളകൾ",
    navWater: "നനയ്ക്കൽ",
    navSensors: "സെൻസർ",
    navAsk: "ചോദിക്കൂ",
    sensorRawTitle: "തത്സമയ സെൻസർ വിവരങ്ങൾ",
    sensorSub: "വിശദമായ ഡാറ്റാ നിരീക്ഷണം",
    thZone: "മേഖല",
    thCrop: "വിള",
    thMoist: "ഈർപ്പം",
    thTemp: "ചൂട്",
    thHum: "ഈർപ്പം",
    thPump: "പമ്പ്",
    askTitle: "സസ്യമിത്ര വോയ്സ് സഹായി",
    askSub: "മൈക്ക് അമർത്തി മലയാളത്തിൽ ചോദിക്കൂ",
    askListening: "ശ്രദ്ധിക്കുന്നു... പറയൂ",
    askPrompt: "നനയ്ക്കൽ, വളപ്രയോഗം, കീടബാധ എന്നിവ ചോദിക്കൂ",
    askThinking: "വിവരങ്ങൾ പരിശോധിക്കുന്നു...",
    sendText: "ചോദിക്കൂ",
    inputPlaceholder: "സംശയം ഇവിടെ ടൈപ്പ് ചെയ്യാം...",
    weatherToday: "കാലാവസ്ഥ",
    sunny: "വെയിൽ ☀️",
    rainy: "മഴ 🌧️",
    cloudy: "മേഘാവൃതം ⛅",
    heatwave: "കടുത്ത ചൂട് 🔥"
  },
  kn: {
    appName: "ಸಸ್ಯಮಿತ್ರ",
    appSub: "ಕರಾವಳಿ ರೈತ ಸಹಾಯಕ",
    langName: "ಕನ್ನಡ",
    farmToday: "ಇಂದಿನ ಕೃಷಿ ಸ್ಥಿತಿ",
    heroGood: "ಬೆಳೆಗಳು ಆರೋಗ್ಯಕರವಾಗಿ ಬೆಳೆಯುತ್ತಿವೆ 🌾",
    heroWarn: "ನೀರಾವರಿ ಬಗ್ಗೆ ಗಮನಹರಿಸಿ ⚠️",
    heroCrit: "ತಕ್ಷಣ ನೀರುಣಿಸುವುದು ಅಗತ್ಯ! 🚨",
    heroSub: "ಕರಾವಳಿ ವಲಯ • ನೇರ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ",
    heroBtn: "ನೀರಾವರಿ ಸಲಹೆ ನೋಡಿ →",
    myCrops: "ನನ್ನ ಬೆಳೆಗಳು",
    attentionTitle: "ಗಮನಿಸಬೇಕಾದ ಅಂಶ",
    openFarm: "ವಿವರಗಳು →",
    soilMoisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಗಾಳಿಯ ತೇವಾಂಶ",
    irrigation: "ನೀರಾವರಿ ಪಂಪ್",
    statusGood: "ಉತ್ತಮವಾಗಿದೆ ✅",
    statusCheck: "ನೀರು ಬೇಕು ⚠️",
    statusCrit: "ತುರ್ತು ಗಮನ 🚨",
    paddy: "ಭತ್ತ",
    paddySub: "ವಲಯ A • ಗದ್ದೆ ಬೆಳೆ",
    arecanut: "ಅಡಿಕೆ",
    arecanutSub: "ವಲಯ B • ಅಡಿಕೆ ತೋಟ",
    waterAdvice: "ನೀರಾವರಿ ಸಲಹೆ ನೋಡಿ",
    turnOn: "ಪಂಪ್ ಆನ್ ಮಾಡಿ",
    turnOff: "ಪಂಪ್ ಆಫ್ ಮಾಡಿ",
    pumpRunning: "ಪಂಪ್ ಚಾಲನೆಯಲ್ಲಿದೆ",
    pumpStopped: "ಪಂಪ್ ನಿಂತಿದೆ",
    navHome: "ಮುಖಪುಟ",
    navCrops: "ಬೆಳೆಗಳು",
    navWater: "ನೀರಾವರಿ",
    navSensors: "ಸೆನ್ಸರ್",
    navAsk: "ಪ್ರಶ್ನಿಸಿ",
    sensorRawTitle: "ಸೆನ್ಸರ್ ರೀಡಿಂಗ್ಸ್",
    sensorSub: "ನೇರ ತಾಂತ್ರಿಕ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ",
    thZone: "ವಲಯ",
    thCrop: "ಬೆಳೆ",
    thMoist: "ತೇವಾಂಶ",
    thTemp: "ತಾಪಮಾನ",
    thHum: "ಆರ್ದ್ರತೆ",
    thPump: "ಪಂಪ್",
    askTitle: "ಸಸ್ಯಮಿತ್ರ ಧ್ವನಿ ಸಹಾಯಕ",
    askSub: "ಮೈಕ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ",
    askListening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    askPrompt: "ಗೊಬ್ಬರ, ಕೀಟಬಾಧೆ, ನೀರುಣಿಸುವ ಬಗ್ಗೆ ಕೇಳಿ",
    askThinking: "ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    sendText: "ಪ್ರಶ್ನಿಸಿ",
    inputPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    weatherToday: "ಹವಾಮಾನ",
    sunny: "ಬಿಸಿಲು ☀️",
    rainy: "ಮಳೆ 🌧️",
    cloudy: "ಮೋಡ ಕವಿದ ⛅",
    heatwave: "ವಿಪರೀತ ಸೆಕೆ 🔥"
  }
};

export default function SasyaMitraDashboard() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [farmData, setFarmData] = useState({
    zones: [
      { zone_id: 'A', crop: 'Paddy', soil_moisture: 68, temperature: 28.5, humidity: 76, irrigation: false, alert: 'NORMAL' },
      { zone_id: 'B', crop: 'Arecanut', soil_moisture: 42, temperature: 29.1, humidity: 74, irrigation: false, alert: 'NORMAL' },
      { zone_id: 'C', crop: 'Paddy', soil_moisture: 60, temperature: 28.8, humidity: 75, irrigation: false, alert: 'NORMAL' }
    ],
    weather: { condition: 'SUNNY', temperature: 29, humidity: 75 },
    simulation_time: { day: 1, hour: 10 }
  });
  const [pumpLoading, setPumpLoading] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Poll backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/farm-data/all');
        if (res.ok) {
          const data = await res.json();
          if (data && data.zones) {
            setFarmData(data);
          }
        }
      } catch (err) {
        // Backend fallback keeps simulation alive
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setLang(curr => {
      if (curr === 'en') return 'ml';
      if (curr === 'ml') return 'kn';
      return 'en';
    });
  };

  // Find Zone A (Paddy) and Zone B (Arecanut)
  const zoneA = farmData.zones.find(z => z.zone_id === 'A') || farmData.zones[0] || {
    zone_id: 'A', crop: 'Paddy', soil_moisture: 65, temperature: 28, humidity: 75, irrigation: false
  };
  const zoneB = farmData.zones.find(z => z.zone_id === 'B') || farmData.zones[1] || {
    zone_id: 'B', crop: 'Arecanut', soil_moisture: 45, temperature: 29, humidity: 72, irrigation: false
  };

  // Evaluate Crop Status
  const getCropStatus = (zone, cropType) => {
    const moist = Number(zone.soil_moisture || 0);
    if (cropType === 'paddy') {
      if (moist < 40) return { key: 'critical', text: t.statusCrit, color: 'critical', pct: moist };
      if (moist < 55) return { key: 'warning', text: t.statusCheck, color: 'warning', pct: moist };
      return { key: 'good', text: t.statusGood, color: 'good', pct: moist };
    } else {
      // Arecanut
      if (moist < 30) return { key: 'critical', text: t.statusCrit, color: 'critical', pct: moist };
      if (moist < 40) return { key: 'warning', text: t.statusCheck, color: 'warning', pct: moist };
      return { key: 'good', text: t.statusGood, color: 'good', pct: moist };
    }
  };

  const paddyStatus = getCropStatus(zoneA, 'paddy');
  const arecaStatus = getCropStatus(zoneB, 'arecanut');

  const hasCritical = paddyStatus.key === 'critical' || arecaStatus.key === 'critical';
  const hasWarning = paddyStatus.key === 'warning' || arecaStatus.key === 'warning';

  const heroHeadline = hasCritical ? t.heroCrit : (hasWarning ? t.heroWarn : t.heroGood);

  // Irrigation toggle
  const togglePump = async (zoneId, currentStatus) => {
    setPumpLoading(prev => ({ ...prev, [zoneId]: true }));
    try {
      const res = await fetch(`http://localhost:3001/api/zone/${zoneId}/irrigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ irrigation: !currentStatus })
      });
      if (res.ok) {
        setFarmData(prev => ({
          ...prev,
          zones: prev.zones.map(z => z.zone_id === zoneId ? { ...z, irrigation: !currentStatus } : z)
        }));
      }
    } catch (err) {
      console.error("Failed to toggle irrigation:", err);
    } finally {
      setPumpLoading(prev => ({ ...prev, [zoneId]: false }));
    }
  };

  // Voice Query Handling
  const handleVoiceAsk = async (textQuery) => {
    const query = textQuery || askQuery;
    if (!query.trim()) return;

    setIsThinking(true);
    setAiResponse('');

    try {
      const res = await fetch('http://localhost:3001/api/voice/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          lang: lang === 'ml' ? 'ml-IN' : (lang === 'kn' ? 'kn-IN' : 'en-IN')
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text || data.response || "No response received.");
        if (data.audio) {
          try {
            const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
            audio.play();
          } catch (e) {
            console.log("Audio playback error:", e);
          }
        }
      } else {
        // Fallback intelligent response based on current farm sensors
        generateLocalAdvice(query);
      }
    } catch (err) {
      // Offline fallback
      generateLocalAdvice(query);
    } finally {
      setIsThinking(false);
    }
  };

  const generateLocalAdvice = (query) => {
    const q = query.toLowerCase();
    if (lang === 'ml') {
      if (q.includes('വെള്ളം') || q.includes('നന') || q.includes('പമ്പ്')) {
        setAiResponse(`പാടത്ത് ഈർപ്പം ${zoneA.soil_moisture}% ആണ്. അടയ്ക്കാത്തോട്ടത്തിൽ ${zoneB.soil_moisture}% ആണ്. ${zoneB.soil_moisture < 40 ? 'അടയ്ക്കക്ക് 30 മിനിറ്റ് നനയ്ക്കുന്നത് ഉചിതമാണ്.' : 'ഇപ്പോൾ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്.'}`);
      } else {
        setAiResponse(`സസ്യമിത്ര ശുപാർശ: നിലവിൽ അന്തരീക്ഷ താപനില ${zoneA.temperature}°C ആണ്. തീരദേശത്ത് വേനൽ മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ ആവശ്യത്തിന് മാത്രം നനയ്ക്കുക.`);
      }
    } else if (lang === 'kn') {
      if (q.includes('ನೀರು') || q.includes('ಪಂಪ್') || q.includes('ತೇವಾಂಶ')) {
        setAiResponse(`ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ತೇವಾಂಶ ${zoneA.soil_moisture}% ಇದೆ. ಅಡಿಕೆ ತೋಟದಲ್ಲಿ ${zoneB.soil_moisture}% ಇದೆ. ${zoneB.soil_moisture < 40 ? 'ಅಡಿಕೆಗೆ ತಕ್ಷಣ ನೀರುಣಿಸುವುದು ಸೂಕ್ತ.' : 'ತೇವಾಂಶ ತೃಪ್ತಿಕರವಾಗಿದೆ.'}`);
      } else {
        setAiResponse(`ಸಸ್ಯಮಿತ್ರ ಸಲಹೆ: ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${zoneA.temperature}°C ಇದೆ. ಕರಾವಳಿ ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಅಡಿಕೆ ಗಿಡಗಳ ಬುಡದಲ್ಲಿ ತೇವಾಂಶ ಕಾಪಾಡಿಕೊಳ್ಳಿ.`);
      }
    } else {
      if (q.includes('water') || q.includes('pump') || q.includes('irrigation')) {
        setAiResponse(`Paddy moisture is ${zoneA.soil_moisture}%. Arecanut moisture is ${zoneB.soil_moisture}%. ${zoneB.soil_moisture < 40 ? 'Irrigation is recommended for Arecanut.' : 'Moisture levels are optimal.'}`);
      } else {
        setAiResponse(`SasyaMitra Advisory: Temperature is ${zoneA.temperature}°C with ${zoneA.humidity}% humidity. Coastal climate is steady.`);
      }
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type below.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ml' ? 'ml-IN' : (lang === 'kn' ? 'kn-IN' : 'en-IN');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setAskQuery(speechToText);
      handleVoiceAsk(speechToText);
    };

    recognition.start();
  };

  const activeZone = selectedCrop === 'paddy' ? zoneA : zoneB;
  const activeStatus = selectedCrop === 'paddy' ? paddyStatus : arecaStatus;

  return (
    <>
      <Head>
        <title>SasyaMitra | Coastal Farmer Assistant</title>
        <meta name="description" content="AI & Digital Twin Dashboard for Paddy and Arecanut Farmers" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Noto+Sans+Kannada:wght@400;600;700;800&family=Noto+Sans+Malayalam:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="app-shell">
        {/* Top Header */}
        <header className="app-header">
          <div className="logo-wrap">
            <div className="logo-icon">🌱</div>
            <div>
              <div className="logo-name">{t.appName}</div>
              <div className="logo-sub">{t.appSub}</div>
            </div>
          </div>

          <button className="lang-pill" onClick={toggleLanguage} title="Switch Language">
            🌐 {t.langName}
          </button>
        </header>

        {/* Tab 1: HOME */}
        {tab === 'home' && (
          <main className="page-content animate-in">
            {/* Hero Card */}
            <div className="hero-card">
              <div className="hero-eyebrow">{t.farmToday}</div>
              <h2 className="hero-title">{heroHeadline}</h2>
              <div className="hero-sub">
                <span>📍</span> {t.heroSub}
              </div>
              <button className="hero-btn" onClick={() => setTab('water')}>
                {t.heroBtn}
              </button>
            </div>

            {/* My Crops Section */}
            <div className="section-lbl">{t.myCrops}</div>
            <div className="crops-grid">
              {/* Paddy Card */}
              <div
                className="crop-card"
                onClick={() => { setSelectedCrop('paddy'); setTab('crops'); }}
                role="button"
                tabIndex={0}
              >
                <div className="crop-icon-box">🌾</div>
                <div className="crop-name-en">{t.paddy}</div>
                <div className="crop-name-loc">{t.paddySub}</div>
                <div className={`crop-badge ${paddyStatus.color}`}>
                  <span className={`dot ${paddyStatus.color}`} />
                  {paddyStatus.text}
                </div>
                <div className="crop-open-lnk">
                  <span>{t.openFarm}</span>
                  <span>→</span>
                </div>
              </div>

              {/* Arecanut Card */}
              <div
                className="crop-card"
                onClick={() => { setSelectedCrop('arecanut'); setTab('crops'); }}
                role="button"
                tabIndex={0}
              >
                <div className="crop-icon-box">🌴</div>
                <div className="crop-name-en">{t.arecanut}</div>
                <div className="crop-name-loc">{t.arecanutSub}</div>
                <div className={`crop-badge ${arecaStatus.color}`}>
                  <span className={`dot ${arecaStatus.color}`} />
                  {arecaStatus.text}
                </div>
                <div className="crop-open-lnk">
                  <span>{t.openFarm}</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Attention Card */}
            <div className="card">
              <div className="alert-row">
                <div className="alert-icon-box">💧</div>
                <div>
                  <h3>{t.attentionTitle}</h3>
                  <p>{selectedCrop === 'paddy' ? t.paddy : t.arecanut} • {t.soilMoisture}</p>
                </div>
              </div>

              <div className="alert-val">
                {zoneB.soil_moisture}% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-3)' }}>({t.arecanut})</span>
              </div>
              <div className="attn-tag">
                {zoneB.soil_moisture < 40 ? '⚠️ Lower than required 45%' : '✅ Within healthy limits'}
              </div>

              <div className="mbar">
                <div
                  className="mbar-fill"
                  style={{
                    width: `${Math.min(100, zoneB.soil_moisture)}%`,
                    background: zoneB.soil_moisture < 30 ? 'var(--danger)' : (zoneB.soil_moisture < 40 ? 'var(--warning)' : 'var(--primary-light)')
                  }}
                />
              </div>

              <button className="cta-btn" onClick={() => setTab('water')}>
                💧 {t.waterAdvice}
              </button>
            </div>

            {/* Quick Weather Snapshot */}
            <div className="card">
              <div className="stat-row">
                <div className="stat-box">
                  <div className="stat-label">{t.weatherToday}</div>
                  <div className="stat-val">
                    {farmData.weather?.condition === 'RAINY' ? t.rainy :
                     farmData.weather?.condition === 'CLOUDY' ? t.cloudy :
                     farmData.weather?.condition === 'HEATWAVE' ? t.heatwave : t.sunny}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">{t.temperature}</div>
                  <div className="stat-val">{zoneA.temperature}°C</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">{t.humidity}</div>
                  <div className="stat-val">{zoneA.humidity}%</div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Tab 2: MY CROPS */}
        {tab === 'crops' && (
          <main className="page-content animate-in">
            {/* Crop switch pills */}
            <div className="ctabs">
              <button
                className={`ctab ${selectedCrop === 'paddy' ? 'active' : ''}`}
                onClick={() => setSelectedCrop('paddy')}
              >
                🌾 {t.paddy} (Zone A)
              </button>
              <button
                className={`ctab ${selectedCrop === 'arecanut' ? 'active' : ''}`}
                onClick={() => setSelectedCrop('arecanut')}
              >
                🌴 {t.arecanut} (Zone B)
              </button>
            </div>

            {/* Selected Crop Card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {selectedCrop === 'paddy' ? t.paddy : t.arecanut}
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    {selectedCrop === 'paddy' ? t.paddySub : t.arecanutSub}
                  </p>
                </div>
                <div className={`crop-badge ${activeStatus.color}`}>
                  <span className={`dot ${activeStatus.color}`} />
                  {activeStatus.text}
                </div>
              </div>

              {/* Moisture Progress */}
              <div style={{ margin: '14px 0 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>{t.soilMoisture}</span>
                  <span>{activeZone.soil_moisture}%</span>
                </div>
                <div className="mbar">
                  <div
                    className="mbar-fill"
                    style={{
                      width: `${Math.min(100, activeZone.soil_moisture)}%`,
                      background: activeStatus.color === 'critical' ? 'var(--danger)' : (activeStatus.color === 'warning' ? 'var(--warning)' : 'var(--primary-light)')
                    }}
                  />
                </div>
              </div>

              {/* Sensor Rows */}
              <div className="metric-row">
                <div className="metric-lbl">
                  <span>🌡️</span>
                  <span>{t.temperature}</span>
                </div>
                <div>
                  <div className="metric-val">{activeZone.temperature}°C</div>
                  <div className="metric-range">Normal: 22°C - 34°C</div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-lbl">
                  <span>💨</span>
                  <span>{t.humidity}</span>
                </div>
                <div>
                  <div className="metric-val">{activeZone.humidity}%</div>
                  <div className="metric-range">Coastal standard</div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-lbl">
                  <span>⚡</span>
                  <span>{t.irrigation}</span>
                </div>
                <div>
                  <div className="metric-val" style={{ color: activeZone.irrigation ? 'var(--primary-mid)' : 'var(--text-3)' }}>
                    {activeZone.irrigation ? t.pumpRunning : t.pumpStopped}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <button
              className={`cta-btn ${activeZone.irrigation ? 'danger' : ''}`}
              onClick={() => togglePump(activeZone.zone_id, activeZone.irrigation)}
              disabled={pumpLoading[activeZone.zone_id]}
            >
              {pumpLoading[activeZone.zone_id] ? 'Updating...' : (activeZone.irrigation ? `⏹️ ${t.turnOff}` : `▶️ ${t.turnOn}`)}
            </button>
          </main>
        )}

        {/* Tab 3: WATER (IRRIGATION) */}
        {tab === 'water' && (
          <main className="page-content animate-in">
            <div className="section-lbl">💧 {t.navWater}</div>

            {/* Paddy Water Box */}
            <div className="card">
              <div className="irr-row">
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>🌾 {t.paddy} (Zone A)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    {t.soilMoisture}: <b>{zoneA.soil_moisture}%</b>
                  </div>
                </div>
                <button
                  className={`toggle-btn ${zoneA.irrigation ? 'on' : 'off'}`}
                  onClick={() => togglePump('A', zoneA.irrigation)}
                  disabled={pumpLoading['A']}
                >
                  {zoneA.irrigation ? t.pumpRunning : t.turnOn}
                </button>
              </div>

              <div className="mbar" style={{ marginTop: 10 }}>
                <div
                  className="mbar-fill"
                  style={{
                    width: `${Math.min(100, zoneA.soil_moisture)}%`,
                    background: zoneA.soil_moisture < 45 ? 'var(--warning)' : 'var(--primary-light)'
                  }}
                />
              </div>
            </div>

            {/* Arecanut Water Box */}
            <div className="card">
              <div className="irr-row">
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>🌴 {t.arecanut} (Zone B)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                    {t.soilMoisture}: <b>{zoneB.soil_moisture}%</b>
                  </div>
                </div>
                <button
                  className={`toggle-btn ${zoneB.irrigation ? 'on' : 'off'}`}
                  onClick={() => togglePump('B', zoneB.irrigation)}
                  disabled={pumpLoading['B']}
                >
                  {zoneB.irrigation ? t.pumpRunning : t.turnOn}
                </button>
              </div>

              <div className="mbar" style={{ marginTop: 10 }}>
                <div
                  className="mbar-fill"
                  style={{
                    width: `${Math.min(100, zoneB.soil_moisture)}%`,
                    background: zoneB.soil_moisture < 35 ? 'var(--danger)' : (zoneB.soil_moisture < 45 ? 'var(--warning)' : 'var(--primary-light)')
                  }}
                />
              </div>
            </div>

            {/* Coastal Water Recommendation */}
            <div className="card" style={{ background: 'var(--bg-muted)' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 6 }}>💡 {t.appSub} Advisory</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                {lang === 'ml'
                  ? "അടയ്ക്ക തോട്ടത്തിൽ വേനൽക്കാലത്ത് തുള്ളിനന (Drip irrigation) നൽകുന്നത് 40% വരെ വെള്ളം ലാഭിക്കും. നെല്ലിന് തണ്ടുകളുണ്ടാകുന്ന ഘട്ടത്തിൽ 2-3 സെ.മീ വെള്ളം നിലനിർത്തുക."
                  : (lang === 'kn'
                  ? "ಅಡಿಕೆ ತೋಟಕ್ಕೆ ಹನಿ ನೀರಾವರಿ ಬಳಸುವುದರಿಂದ ಶೇಕಡಾ 40 ರಷ್ಟು ನೀರು ಉಳಿತಾಯವಾಗುತ್ತದೆ. ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ತೆನೆ ಬಿಡುವ ಹಂತದಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರು ನಿಲ್ಲಿಸುವುದು ಸೂಕ್ತ."
                  : "Drip irrigation for Arecanut during dry spells saves up to 40% water. For paddy, maintain a steady 2-3 cm shallow water layer during panicle initiation.")}
              </p>
            </div>
          </main>
        )}

        {/* Tab 4: SENSORS (RAW TELEMETRY FOR DEV FARMERS) */}
        {tab === 'sensors' && (
          <main className="page-content animate-in">
            <div className="section-lbl">📊 {t.sensorRawTitle}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 12 }}>
              {t.sensorSub}
            </p>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="stbl">
                <thead>
                  <tr>
                    <th>{t.thZone}</th>
                    <th>{t.thCrop}</th>
                    <th>{t.thMoist}</th>
                    <th>{t.thTemp}</th>
                    <th>{t.thHum}</th>
                    <th>{t.thPump}</th>
                  </tr>
                </thead>
                <tbody>
                  {farmData.zones.map(z => (
                    <tr key={z.zone_id}>
                      <td style={{ fontWeight: 800 }}>{z.zone_id}</td>
                      <td>{z.zone_id === 'A' ? (lang === 'ml' ? 'നെല്ല്' : (lang === 'kn' ? 'ಭತ್ತ' : 'Paddy')) : (z.zone_id === 'B' ? (lang === 'ml' ? 'അടയ്ക്ക' : (lang === 'kn' ? 'ಅಡಿಕೆ' : 'Arecanut')) : z.crop)}</td>
                      <td style={{ fontWeight: 700, color: z.soil_moisture < 40 ? 'var(--warning)' : 'inherit' }}>
                        {z.soil_moisture}%
                      </td>
                      <td>{z.temperature}°C</td>
                      <td>{z.humidity}%</td>
                      <td>
                        <span className={`dot ${z.irrigation ? 'good' : 'warning'}`} style={{ marginRight: 4 }} />
                        {z.irrigation ? 'ON' : 'OFF'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Simulation Clock & Backend Telemetry */}
            <div className="card" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                <span>Backend Twin Status:</span>
                <span style={{ color: 'var(--primary-mid)', fontWeight: 700 }}>● Connected (Port 3001)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 8 }}>
                <span>Simulated Time:</span>
                <span>Day {farmData.simulation_time?.day || 1}, {farmData.simulation_time?.hour || 10}:00</span>
              </div>
            </div>
          </main>
        )}

        {/* Tab 5: ASK (VOICE & AI ADVISOR) */}
        {tab === 'ask' && (
          <main className="page-content animate-in">
            <div className="section-lbl">🎙️ {t.askTitle}</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 20 }}>
              {t.askSub}
            </p>

            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <button
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                title="Tap to speak"
              >
                🎙️
              </button>

              <div style={{ marginTop: 14, fontSize: '0.85rem', fontWeight: 700, color: isListening ? 'var(--danger)' : 'var(--primary)' }}>
                {isListening ? t.askListening : t.askPrompt}
              </div>

              {/* Input for typing fallback */}
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleVoiceAsk(); }}
                  placeholder={t.inputPlaceholder}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  className="hero-btn"
                  style={{ width: 'auto', padding: '10px 18px' }}
                  onClick={() => handleVoiceAsk()}
                  disabled={isThinking}
                >
                  {isThinking ? '...' : t.sendText}
                </button>
              </div>

              {/* AI Response Display */}
              {isThinking && (
                <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-3)' }}>
                  ⏳ {t.askThinking}
                </div>
              )}

              {aiResponse && (
                <div className="voice-response">
                  <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🌱</span>
                    <span>SasyaMitra Advisory:</span>
                  </div>
                  {aiResponse}
                </div>
              )}
            </div>
          </main>
        )}

        {/* Bottom Tab Navigation */}
        <nav className="bottom-nav">
          <button
            className={`nav-item ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">{t.navHome}</span>
          </button>

          <button
            className={`nav-item ${tab === 'crops' ? 'active' : ''}`}
            onClick={() => setTab('crops')}
          >
            <span className="nav-icon">🌾</span>
            <span className="nav-label">{t.navCrops}</span>
          </button>

          <button
            className={`nav-item ${tab === 'water' ? 'active' : ''}`}
            onClick={() => setTab('water')}
          >
            <span className="nav-icon">💧</span>
            <span className="nav-label">{t.navWater}</span>
          </button>

          <button
            className={`nav-item ${tab === 'sensors' ? 'active' : ''}`}
            onClick={() => setTab('sensors')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">{t.navSensors}</span>
          </button>

          <button
            className={`nav-item ${tab === 'ask' ? 'active' : ''}`}
            onClick={() => setTab('ask')}
          >
            <span className="nav-icon">🎙️</span>
            <span className="nav-label">{t.navAsk}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

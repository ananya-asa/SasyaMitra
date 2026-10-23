import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// --- Clean Professional SVG Icons (Lucide-style) ---
const Icons = {
  Sprout: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  ),
  PalmTree: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h11z" />
      <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-9" />
      <path d="M5.8 21a14.7 14.7 0 0 1 6.2-12" />
    </svg>
  ),
  Droplets: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5c-.29 1.75-1.14 3.12-2.29 4.06S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  ),
  Thermometer: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  ),
  Wind: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  ),
  Activity: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Home: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Mic: ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  CheckCircle: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertTriangle: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  AlertCircle: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
  Globe: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  ChevronRight: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Power: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" x2="12" y1="2" y2="12" />
    </svg>
  ),
  Send: ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
};

const TRANSLATIONS = {
  en: {
    appName: "SasyaMitra",
    appSub: "Coastal Agritech Digital Twin",
    langName: "English",
    farmToday: "DAILY FARM OVERVIEW",
    heroGood: "Crop Conditions are Stable & Healthy",
    heroWarn: "Irrigation Attention Required",
    heroCrit: "Critical Moisture Depletion Detected",
    heroSub: "Coastal Agro-Climatic Zone • Real-Time Telemetry",
    heroBtn: "Manage Irrigation Systems",
    myCrops: "Monitored Crops",
    attentionTitle: "Target Moisture Alert",
    openFarm: "View Detailed Telemetry",
    soilMoisture: "Soil Moisture",
    temperature: "Ambient Temperature",
    humidity: "Relative Humidity",
    irrigation: "Irrigation Pump",
    statusGood: "Optimal",
    statusCheck: "Needs Water",
    statusCrit: "Critical Deficit",
    paddy: "Paddy (Rice)",
    paddySub: "Zone A • Lowland wetland paddy",
    arecanut: "Arecanut",
    arecanutSub: "Zone B • High-density coastal plantation",
    waterAdvice: "Review Irrigation Protocol",
    turnOn: "Activate Pump",
    turnOff: "Stop Pump",
    pumpRunning: "Active / Pumping",
    pumpStopped: "Standby / Off",
    navHome: "Dashboard",
    navCrops: "Crops",
    navWater: "Irrigation",
    navSensors: "Telemetry",
    navAsk: "AI Advisor",
    sensorRawTitle: "Sensor Matrix Telemetry",
    sensorSub: "Live hardware sensor readings transmitted to Digital Twin",
    thZone: "Zone ID",
    thCrop: "Target Crop",
    thMoist: "Soil Moisture",
    thTemp: "Temperature",
    thHum: "Humidity",
    thPump: "Pump Status",
    askTitle: "Agronomic AI Advisory",
    askSub: "Ask real-time questions regarding water management, pest prevention, or weather",
    askListening: "Listening... speak now",
    askPrompt: "Click microphone to ask about coastal crops",
    askThinking: "Analyzing field sensors & telemetry...",
    sendText: "Ask AI",
    inputPlaceholder: "Type your agronomic query here...",
    weatherToday: "Weather Condition",
    systemConnected: "Twin Live",
    targetMoisture: "Target Range: 45% - 65%"
  },
  ml: {
    appName: "സസ്യമിത്ര",
    appSub: "തീരദേശ കാർഷിക ഡിജിറ്റൽ ട്വിൻ",
    langName: "മലയാളം",
    farmToday: "ദൈനംദിന കൃഷി നില",
    heroGood: "വിളകൾ ആരോഗ്യകരമായ നിലയിലാണ്",
    heroWarn: "നനയ്ക്കുന്നതിൽ പ്രത്യേക ശ്രദ്ധ വേണം",
    heroCrit: "ഗുരുതരമായ ഈർപ്പക്കുറവ് കണ്ടെത്തി",
    heroSub: "തീരദേശ കാർഷിക മേഖല • തത്സമയ സെൻസർ നിരീക്ഷണം",
    heroBtn: "നനയ്ക്കൽ സംവിധാനം നിയന്ത്രിക്കുക",
    myCrops: "കൃഷി ചെയ്യുന്ന വിളകൾ",
    attentionTitle: "ഈർപ്പ നില മുന്നറിയിപ്പ്",
    openFarm: "വിശദാംശങ്ങൾ കാണുക",
    soilMoisture: "മണ്ണിലെ ഈർപ്പം",
    temperature: "അന്തരീക്ഷ താപനില",
    humidity: "അന്തരീക്ഷ ഈർപ്പം",
    irrigation: "നനയ്ക്കൽ പമ്പ്",
    statusGood: "നല്ല നില",
    statusCheck: "നനയ്ക്കണം",
    statusCrit: "വളരെ കുറവ്",
    paddy: "നെല്ല്",
    paddySub: "മേഖല A • പാടശേഖരം",
    arecanut: "അടയ്ക്ക (കവുങ്ങ്)",
    arecanutSub: "മേഖല B • അടയ്ക്കാത്തോട്ടം",
    waterAdvice: "നനയ്ക്കൽ നിർദ്ദേശം കാണുക",
    turnOn: "പമ്പ് പ്രവർത്തിപ്പിക്കുക",
    turnOff: "പമ്പ് നിർത്തുക",
    pumpRunning: "പ്രവർത്തിക്കുന്നു",
    pumpStopped: "ഓഫ് ആണ്",
    navHome: "ഡാഷ്‌ബോർഡ്",
    navCrops: "വിളകൾ",
    navWater: "നനയ്ക്കൽ",
    navSensors: "സെൻസറുകൾ",
    navAsk: "AI സഹായി",
    sensorRawTitle: "സെൻസർ വിവരങ്ങൾ",
    sensorSub: "ഡിജിറ്റൽ ട്വിൻ തത്സമയ ഡാറ്റാ നിരീക്ഷണം",
    thZone: "മേഖല",
    thCrop: "വിള",
    thMoist: "ഈർപ്പം",
    thTemp: "താപനില",
    thHum: "ആർദ്രത",
    thPump: "പമ്പ് നില",
    askTitle: "സസ്യമിത്ര വോയ്സ് & AI സഹായി",
    askSub: "തീരദേശ കൃഷിയെക്കുറിച്ചുള്ള സംശയങ്ങൾ ചോദിക്കൂ",
    askListening: "ശ്രദ്ധിക്കുന്നു... പറയൂ",
    askPrompt: "മൈക്ക് അമർത്തി സംസാരിക്കുക",
    askThinking: "വിവരങ്ങൾ പരിശോധിക്കുന്നു...",
    sendText: "ചോദിക്കൂ",
    inputPlaceholder: "സംശയങ്ങൾ ഇവിടെ ടൈപ്പ് ചെയ്യാം...",
    weatherToday: "കാലാവസ്ഥ",
    systemConnected: "കണക്റ്റഡ്",
    targetMoisture: "ആവശ്യമായ ഈർപ്പം: 45% - 65%"
  },
  kn: {
    appName: "ಸಸ್ಯಮಿತ್ರ",
    appSub: "ಕರಾವಳಿ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಕೃಷಿ ವೇದಿಕೆ",
    langName: "ಕನ್ನಡ",
    farmToday: "ದೈನಂದಿನ ಕೃಷಿ ಅವಲೋಕನ",
    heroGood: "ಬೆಳೆಗಳು ಆರೋಗ್ಯಕರ ಸ್ಥಿತಿಯಲ್ಲಿವೆ",
    heroWarn: "ನೀರಾವರಿಯ ಬಗ್ಗೆ ಗಮನಹರಿಸುವುದು ಅಗತ್ಯ",
    heroCrit: "ತೇವಾಂಶದ ತೀವ್ರ ಕೊರತೆ ಕಂಡುಬಂದಿದೆ",
    heroSub: "ಕರಾವಳಿ ಕೃಷಿ ವಲಯ • ನೇರ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ",
    heroBtn: "ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ ಪರಿಶೀಲಿಸಿ",
    myCrops: "ಬೆಳೆಗಳ ಸ್ಥಿತಿ",
    attentionTitle: "ತೇವಾಂಶ ಎಚ್ಚರಿಕೆ",
    openFarm: "ಪೂರ್ಣ ಮಾಹಿತಿ ನೋಡಿ",
    soilMoisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಗಾಳಿಯ ತೇವಾಂಶ",
    irrigation: "ನೀರಾವರಿ ಪಂಪ್",
    statusGood: "ಉತ್ತಮವಾಗಿದೆ",
    statusCheck: "ನೀರು ಬೇಕು",
    statusCrit: "ತುರ್ತು ಗಮನ",
    paddy: "ಭತ್ತ",
    paddySub: "ವಲಯ A • ಗದ್ದೆ ಬೆಳೆ",
    arecanut: "ಅಡಿಕೆ",
    arecanutSub: "ವಲಯ B • ಅಡಿಕೆ ತೋಟ",
    waterAdvice: "ನೀರಾವರಿ ಸಲಹೆ ನೋಡಿ",
    turnOn: "ಪಂಪ್ ಆನ್ ಮಾಡಿ",
    turnOff: "ಪಂಪ್ ಆಫ್ ಮಾಡಿ",
    pumpRunning: "ಚಾಲನೆಯಲ್ಲಿದೆ",
    pumpStopped: "ಸ್ಥಗಿತಗೊಂಡಿದೆ",
    navHome: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navCrops: "ಬೆಳೆಗಳು",
    navWater: "ನೀರಾವರಿ",
    navSensors: "ಟೆಲಿಮೆಟ್ರಿ",
    navAsk: "AI ಸಲಹೆಗಾರ",
    sensorRawTitle: "ಸೆನ್ಸರ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಡಾಟಾ",
    sensorSub: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ನೇರ ಸಂವೇದಕ ರೀಡಿಂಗ್ಸ್",
    thZone: "ವಲಯ",
    thCrop: "ಬೆಳೆ",
    thMoist: "ತೇವಾಂಶ",
    thTemp: "ತಾಪಮಾನ",
    thHum: "ಆರ್ದ್ರತೆ",
    thPump: "ಪಂಪ್ ಸ್ಥಿತಿ",
    askTitle: "ಸಸ್ಯಮಿತ್ರ ಧ್ವನಿ ಹಾಗೂ AI ಸಹಾಯಕ",
    askSub: "ಬೆಳೆ, ರೋಗ ಅಥವಾ ನೀರಾವರಿ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ",
    askListening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    askPrompt: "ಧ್ವನಿ ಮೂಲಕ ಪ್ರಶ್ನಿಸಲು ಮೈಕ್ ಒತ್ತಿ",
    askThinking: "ಮಾಹಿತಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    sendText: "ಕೇಳಿ",
    inputPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    weatherToday: "ಹವಾಮಾನ",
    systemConnected: "ಸಕ್ರಿಯವಾಗಿದೆ",
    targetMoisture: "ನಿಗದಿತ ಮಿತಿ: 45% - 65%"
  }
};

export default function SasyaMitraDashboard() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [farmData, setFarmData] = useState({
    zones: [
      { zone_id: 'A', crop: 'Paddy', soil_moisture: 68, temperature: 28.5, humidity: 76, irrigation: false, alert: 'NORMAL' },
      { zone_id: 'B', crop: 'Arecanut', soil_moisture: 41, temperature: 29.2, humidity: 74, irrigation: false, alert: 'NORMAL' },
      { zone_id: 'C', crop: 'Paddy', soil_moisture: 62, temperature: 28.8, humidity: 75, irrigation: false, alert: 'NORMAL' }
    ],
    weather: { condition: 'SUNNY', temperature: 29, humidity: 75 },
    simulation_time: { day: 1, hour: 11 }
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
        // Fallback simulation
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

  const zoneA = farmData.zones.find(z => z.zone_id === 'A') || farmData.zones[0] || {
    zone_id: 'A', crop: 'Paddy', soil_moisture: 68, temperature: 28.5, humidity: 76, irrigation: false
  };
  const zoneB = farmData.zones.find(z => z.zone_id === 'B') || farmData.zones[1] || {
    zone_id: 'B', crop: 'Arecanut', soil_moisture: 41, temperature: 29.2, humidity: 74, irrigation: false
  };

  const getCropStatus = (zone, cropType) => {
    const moist = Number(zone.soil_moisture || 0);
    if (cropType === 'paddy') {
      if (moist < 40) return { key: 'critical', text: t.statusCrit, color: 'critical', pct: moist };
      if (moist < 55) return { key: 'warning', text: t.statusCheck, color: 'warning', pct: moist };
      return { key: 'good', text: t.statusGood, color: 'good', pct: moist };
    } else {
      if (moist < 30) return { key: 'critical', text: t.statusCrit, color: 'critical', pct: moist };
      if (moist < 42) return { key: 'warning', text: t.statusCheck, color: 'warning', pct: moist };
      return { key: 'good', text: t.statusGood, color: 'good', pct: moist };
    }
  };

  const paddyStatus = getCropStatus(zoneA, 'paddy');
  const arecaStatus = getCropStatus(zoneB, 'arecanut');

  const hasCritical = paddyStatus.key === 'critical' || arecaStatus.key === 'critical';
  const hasWarning = paddyStatus.key === 'warning' || arecaStatus.key === 'warning';
  const heroHeadline = hasCritical ? t.heroCrit : (hasWarning ? t.heroWarn : t.heroGood);

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
      console.error("Irrigation request failed:", err);
    } finally {
      setPumpLoading(prev => ({ ...prev, [zoneId]: false }));
    }
  };

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
        generateLocalAdvice(query);
      }
    } catch (err) {
      generateLocalAdvice(query);
    } finally {
      setIsThinking(false);
    }
  };

  const generateLocalAdvice = (query) => {
    const q = query.toLowerCase();
    if (lang === 'ml') {
      if (q.includes('വെള്ളം') || q.includes('നന') || q.includes('പമ്പ്')) {
        setAiResponse(`തത്സമയ വിശകലനം: പാടത്ത് മണ്ണിലെ ഈർപ്പം ${zoneA.soil_moisture}% ആണ് (പര്യാപ്തം). അടയ്ക്കാത്തോട്ടത്തിൽ ${zoneB.soil_moisture}% ആണ്. ${zoneB.soil_moisture < 42 ? 'അടയ്ക്കക്ക് 40 മിനിറ്റ് തുള്ളിനന നൽകുന്നത് ഉചിതമാണ്.' : 'നിലവിൽ ഈർപ്പനില അനുയോജ്യമാണ്.'}`);
      } else {
        setAiResponse(`സസ്യമിത്ര നിർദ്ദേശം: താപനില ${zoneA.temperature}°C, ഈർപ്പം ${zoneA.humidity}%. തീരദേശ വിളകളിൽ കുമിൾരോഗ സാധ്യത ഒഴിവാക്കാൻ വായുസഞ്ചാരം ഉറപ്പാക്കുക.`);
      }
    } else if (lang === 'kn') {
      if (q.includes('ನೀರು') || q.includes('ಪಂಪ್') || q.includes('ತೇವಾಂಶ')) {
        setAiResponse(`ಕ್ಷೇತ್ರ ವಿಶ್ಲೇಷಣೆ: ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ತೇವಾಂಶ ${zoneA.soil_moisture}% ಇದೆ. ಅಡಿಕೆ ತೋಟದಲ್ಲಿ ${zoneB.soil_moisture}% ಇದೆ. ${zoneB.soil_moisture < 42 ? 'ಅಡಿಕೆಗೆ ತಕ್ಷಣ ಹನಿ ನೀರಾವರಿ ಚಾಲನೆ ಮಾಡುವುದು ಸೂಕ್ತ.' : 'ತೇವಾಂಶ ಸೂಕ್ತ ಪ್ರಮಾಣದಲ್ಲಿದೆ.'}`);
      } else {
        setAiResponse(`ಸಸ್ಯಮಿತ್ರ ಕೃಷಿ ಸಲಹೆ: ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${zoneA.temperature}°C ಮತ್ತು ಆರ್ದ್ರತೆ ${zoneA.humidity}%. ಕರಾವಳಿ ಹವಾಗುಣಕ್ಕೆ ತಕ್ಕಂತೆ ಅಡಿಕೆ ತೋಟದಲ್ಲಿ ಬಸಿಗಾಲುವೆ ನಿರ್ವಹಣೆ ಮುಖ್ಯ.`);
      }
    } else {
      if (q.includes('water') || q.includes('pump') || q.includes('irrigation')) {
        setAiResponse(`Digital Twin Telemetry: Paddy field moisture is stable at ${zoneA.soil_moisture}%. Arecanut soil moisture is currently ${zoneB.soil_moisture}%. ${zoneB.soil_moisture < 42 ? 'Scheduled 40-minute drip cycle is recommended for Arecanut.' : 'All root zones have adequate hydration.'}`);
      } else {
        setAiResponse(`SasyaMitra Advisory: Ambient temperature is ${zoneA.temperature}°C with relative humidity at ${zoneA.humidity}%. Conditions are conducive for normal coastal growth cycles.`);
      }
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is unavailable in this environment. You can type your query.");
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
        <title>SasyaMitra | Coastal Agritech Platform</title>
        <meta name="description" content="Professional Digital Twin & Crop Telemetry for Coastal Farmers" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="app-wrapper">
        {/* Professional Header with Desktop Nav */}
        <header className="app-header">
          <div className="app-container">
            <div className="header-inner">
              <div className="brand-section">
                <div className="brand-icon-box">
                  <Icons.Sprout size={22} />
                </div>
                <div>
                  <div className="brand-name">{t.appName}</div>
                  <div className="brand-badge">{t.appSub}</div>
                </div>
              </div>

              {/* Desktop Tabs */}
              <nav className="desktop-nav">
                <button className={`dnav-link ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
                  <Icons.Home size={16} />
                  <span>{t.navHome}</span>
                </button>
                <button className={`dnav-link ${tab === 'crops' ? 'active' : ''}`} onClick={() => setTab('crops')}>
                  <Icons.Sprout size={16} />
                  <span>{t.navCrops}</span>
                </button>
                <button className={`dnav-link ${tab === 'water' ? 'active' : ''}`} onClick={() => setTab('water')}>
                  <Icons.Droplets size={16} />
                  <span>{t.navWater}</span>
                </button>
                <button className={`dnav-link ${tab === 'sensors' ? 'active' : ''}`} onClick={() => setTab('sensors')}>
                  <Icons.Activity size={16} />
                  <span>{t.navSensors}</span>
                </button>
                <button className={`dnav-link ${tab === 'ask' ? 'active' : ''}`} onClick={() => setTab('ask')}>
                  <Icons.Mic size={16} />
                  <span>{t.navAsk}</span>
                </button>
              </nav>

              <div className="header-actions">
                <div className="status-pill">
                  <span className="status-pulse" />
                  <span>{t.systemConnected}</span>
                </div>
                <button className="lang-btn" onClick={toggleLanguage} title="Switch Language">
                  <Icons.Globe size={15} />
                  <span>{t.langName}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="app-container">

            {/* TAB: DASHBOARD / HOME */}
            {tab === 'home' && (
              <div className="animate-fade">
                {/* Responsive Grid: Hero + Attention Alert */}
                <div className="dashboard-grid-hero">
                  {/* Hero Status Panel */}
                  <div className="hero-overview">
                    <div>
                      <div className="hero-badge-tag">
                        <Icons.Activity size={13} />
                        <span>{t.farmToday}</span>
                      </div>
                      <h1 className="hero-title">{heroHeadline}</h1>
                      <div className="hero-subtext">
                        <span>{t.heroSub}</span>
                      </div>
                    </div>
                    <div>
                      <button className="hero-action-btn" onClick={() => setTab('water')}>
                        <span>{t.heroBtn}</span>
                        <Icons.ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Attention Alert Card */}
                  <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ background: 'var(--warning-pale)', color: 'var(--warning)', padding: 8, borderRadius: 8 }}>
                            <Icons.AlertTriangle size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>{t.attentionTitle}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>{t.arecanut} (Zone B)</div>
                          </div>
                        </div>
                        <span className="metric-badge warning">
                          <Icons.AlertTriangle size={13} />
                          <span>{t.statusCheck}</span>
                        </span>
                      </div>

                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-1)', margin: '8px 0 2px' }}>
                        {zoneB.soil_moisture}%
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-3)', marginLeft: 8 }}>
                          {t.soilMoisture}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
                        {t.targetMoisture}
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(100, zoneB.soil_moisture)}%`,
                            background: zoneB.soil_moisture < 30 ? 'var(--danger)' : (zoneB.soil_moisture < 42 ? 'var(--warning)' : 'var(--primary-light)')
                          }}
                        />
                      </div>
                    </div>

                    <button className="secondary-btn" onClick={() => setTab('water')} style={{ width: '100%' }}>
                      <Icons.Droplets size={16} />
                      <span>{t.waterAdvice}</span>
                    </button>
                  </div>
                </div>

                {/* Monitored Crops Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-1)' }}>{t.myCrops}</h2>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-3)', fontWeight: 600 }}>2 Active Agricultural Zones</span>
                </div>

                <div className="crops-responsive-grid">
                  {/* Paddy Card */}
                  <div
                    className="crop-interactive-card"
                    onClick={() => { setSelectedCrop('paddy'); setTab('crops'); }}
                  >
                    <div>
                      <div className="crop-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="crop-icon-frame">
                            <Icons.Sprout size={22} />
                          </div>
                          <div>
                            <div className="crop-name">{t.paddy}</div>
                            <div className="crop-zone">{t.paddySub}</div>
                          </div>
                        </div>
                        <span className={`metric-badge ${paddyStatus.color}`}>
                          {paddyStatus.key === 'good' ? <Icons.CheckCircle size={13} /> : <Icons.AlertTriangle size={13} />}
                          <span>{paddyStatus.text}</span>
                        </span>
                      </div>

                      <div className="metric-tile-grid">
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.soilMoisture}</div>
                          <div className="metric-tile-val">{zoneA.soil_moisture}%</div>
                        </div>
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.temperature}</div>
                          <div className="metric-tile-val">{zoneA.temperature}°C</div>
                        </div>
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.humidity}</div>
                          <div className="metric-tile-val">{zoneA.humidity}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="crop-footer-link">
                      <span>{t.openFarm}</span>
                      <Icons.ChevronRight size={16} />
                    </div>
                  </div>

                  {/* Arecanut Card */}
                  <div
                    className="crop-interactive-card"
                    onClick={() => { setSelectedCrop('arecanut'); setTab('crops'); }}
                  >
                    <div>
                      <div className="crop-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="crop-icon-frame">
                            <Icons.PalmTree size={22} />
                          </div>
                          <div>
                            <div className="crop-name">{t.arecanut}</div>
                            <div className="crop-zone">{t.arecanutSub}</div>
                          </div>
                        </div>
                        <span className={`metric-badge ${arecaStatus.color}`}>
                          {arecaStatus.key === 'good' ? <Icons.CheckCircle size={13} /> : <Icons.AlertTriangle size={13} />}
                          <span>{arecaStatus.text}</span>
                        </span>
                      </div>

                      <div className="metric-tile-grid">
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.soilMoisture}</div>
                          <div className="metric-tile-val" style={{ color: arecaStatus.color === 'warning' ? 'var(--warning)' : 'inherit' }}>
                            {zoneB.soil_moisture}%
                          </div>
                        </div>
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.temperature}</div>
                          <div className="metric-tile-val">{zoneB.temperature}°C</div>
                        </div>
                        <div className="metric-tile">
                          <div className="metric-tile-lbl">{t.humidity}</div>
                          <div className="metric-tile-val">{zoneB.humidity}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="crop-footer-link">
                      <span>{t.openFarm}</span>
                      <Icons.ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CROPS DETAILED */}
            {tab === 'crops' && (
              <div className="animate-fade">
                {/* Crop Switcher */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <button
                    className={selectedCrop === 'paddy' ? 'primary-btn' : 'secondary-btn'}
                    onClick={() => setSelectedCrop('paddy')}
                  >
                    <Icons.Sprout size={16} />
                    <span>{t.paddy} (Zone A)</span>
                  </button>
                  <button
                    className={selectedCrop === 'arecanut' ? 'primary-btn' : 'secondary-btn'}
                    onClick={() => setSelectedCrop('arecanut')}
                  >
                    <Icons.PalmTree size={16} />
                    <span>{t.arecanut} (Zone B)</span>
                  </button>
                </div>

                <div className="panel-card" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        {selectedCrop === 'paddy' ? t.paddy : t.arecanut}
                      </h2>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                        {selectedCrop === 'paddy' ? t.paddySub : t.arecanutSub}
                      </div>
                    </div>
                    <span className={`metric-badge ${activeStatus.color}`}>
                      {activeStatus.key === 'good' ? <Icons.CheckCircle size={13} /> : <Icons.AlertTriangle size={13} />}
                      <span>{activeStatus.text}</span>
                    </span>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                      <span>{t.soilMoisture}</span>
                      <span>{activeZone.soil_moisture}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 10 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, activeZone.soil_moisture)}%`,
                          background: activeStatus.color === 'critical' ? 'var(--danger)' : (activeStatus.color === 'warning' ? 'var(--warning)' : 'var(--primary-light)')
                        }}
                      />
                    </div>
                  </div>

                  <div className="metric-tile-grid">
                    <div className="metric-tile">
                      <div className="metric-tile-lbl">{t.temperature}</div>
                      <div className="metric-tile-val">{activeZone.temperature}°C</div>
                    </div>
                    <div className="metric-tile">
                      <div className="metric-tile-lbl">{t.humidity}</div>
                      <div className="metric-tile-val">{activeZone.humidity}%</div>
                    </div>
                    <div className="metric-tile">
                      <div className="metric-tile-lbl">{t.irrigation}</div>
                      <div className="metric-tile-val" style={{ color: activeZone.irrigation ? 'var(--primary-light)' : 'var(--text-3)' }}>
                        {activeZone.irrigation ? t.pumpRunning : t.pumpStopped}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={`primary-btn ${activeZone.irrigation ? 'danger' : ''}`}
                  onClick={() => togglePump(activeZone.zone_id, activeZone.irrigation)}
                  disabled={pumpLoading[activeZone.zone_id]}
                >
                  <Icons.Power size={16} />
                  <span>
                    {pumpLoading[activeZone.zone_id] ? 'Updating...' : (activeZone.irrigation ? t.turnOff : t.turnOn)}
                  </span>
                </button>
              </div>
            )}

            {/* TAB: WATER / IRRIGATION */}
            {tab === 'water' && (
              <div className="animate-fade">
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.navWater} Control Center</h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Manage automated and manual drip/flood irrigation circuits</p>
                </div>

                <div className="crops-responsive-grid">
                  {/* Paddy Irrigation */}
                  <div className="panel-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.paddy} (Zone A)</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{t.soilMoisture}: {zoneA.soil_moisture}%</div>
                      </div>
                      <button
                        className={zoneA.irrigation ? 'primary-btn danger' : 'primary-btn'}
                        onClick={() => togglePump('A', zoneA.irrigation)}
                        disabled={pumpLoading['A']}
                      >
                        <Icons.Power size={15} />
                        <span>{zoneA.irrigation ? t.pumpRunning : t.turnOn}</span>
                      </button>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, zoneA.soil_moisture)}%`,
                          background: zoneA.soil_moisture < 45 ? 'var(--warning)' : 'var(--primary-light)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Arecanut Irrigation */}
                  <div className="panel-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.arecanut} (Zone B)</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{t.soilMoisture}: {zoneB.soil_moisture}%</div>
                      </div>
                      <button
                        className={zoneB.irrigation ? 'primary-btn danger' : 'primary-btn'}
                        onClick={() => togglePump('B', zoneB.irrigation)}
                        disabled={pumpLoading['B']}
                      >
                        <Icons.Power size={15} />
                        <span>{zoneB.irrigation ? t.pumpRunning : t.turnOn}</span>
                      </button>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, zoneB.soil_moisture)}%`,
                          background: zoneB.soil_moisture < 30 ? 'var(--danger)' : (zoneB.soil_moisture < 42 ? 'var(--warning)' : 'var(--primary-light)')
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="panel-card" style={{ background: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Icons.Droplets size={18} className="" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Agronomic Water Advisory</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                    {lang === 'ml'
                      ? "വേനൽക്കാലത്ത് അടയ്ക്കാത്തോട്ടത്തിൽ തുള്ളിനന (Drip irrigation) നൽകുന്നത് 40% വരെ വെള്ളം ലാഭിക്കാൻ സഹായിക്കും. നെൽപാടങ്ങളിൽ കതിരിടുന്ന ഘട്ടത്തിൽ 2-3 സെ.മീ ആഴത്തിൽ ഈർപ്പം നിലനിർത്തുക."
                      : (lang === 'kn'
                      ? "ಕರಾವಳಿ ಪ್ರದೇಶದಲ್ಲಿ ಅಡಿಕೆ ತೋಟಕ್ಕೆ ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ ಅಳವಡಿಸುವುದರಿಂದ ನೀರಿನ ಸದ್ಬಳಕೆಯಾಗುತ್ತದೆ. ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ಕಾಳು ಕಟ್ಟುವ ಹಂತದಲ್ಲಿ ಅಗತ್ಯ ತೇವಾಂಶ ಇರಬೇಕು."
                      : "Drip irrigation in arecanut plantations prevents soil saturation while saving 35-40% water. For paddy, maintain controlled 2-3 cm standing depth during grain filling.")}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: SENSORS / TELEMETRY */}
            {tab === 'sensors' && (
              <div className="animate-fade">
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.sensorRawTitle}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{t.sensorSub}</p>
                </div>

                <div className="table-responsive">
                  <table className="modern-table">
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
                          <td style={{ fontWeight: 800 }}>Zone {z.zone_id}</td>
                          <td>{z.zone_id === 'A' ? t.paddy : (z.zone_id === 'B' ? t.arecanut : z.crop)}</td>
                          <td style={{ fontWeight: 700, color: z.soil_moisture < 42 ? 'var(--warning)' : 'inherit' }}>
                            {z.soil_moisture}%
                          </td>
                          <td>{z.temperature}°C</td>
                          <td>{z.humidity}%</td>
                          <td>
                            <span className={`metric-badge ${z.irrigation ? 'good' : 'warning'}`}>
                              <span className="status-pulse" style={{ background: z.irrigation ? 'var(--success)' : 'var(--text-muted)' }} />
                              <span>{z.irrigation ? 'RUNNING' : 'IDLE'}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="panel-card" style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-3)' }}>Digital Twin Server</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>Active • Localhost:3001</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: 8 }}>
                    <span style={{ color: 'var(--text-3)' }}>Simulation Clock</span>
                    <span style={{ fontWeight: 700 }}>Day {farmData.simulation_time?.day || 1}, {farmData.simulation_time?.hour || 11}:00</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ASK AI / VOICE */}
            {tab === 'ask' && (
              <div className="animate-fade">
                <div className="panel-card assistant-card">
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 6 }}>{t.askTitle}</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: 24 }}>{t.askSub}</p>

                  <button
                    className={`mic-circle-btn ${isListening ? 'listening' : ''}`}
                    onClick={startListening}
                    title="Tap to speak"
                  >
                    <Icons.Mic size={30} />
                  </button>

                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isListening ? 'var(--danger)' : 'var(--primary)', marginBottom: 20 }}>
                    {isListening ? t.askListening : t.askPrompt}
                  </div>

                  <div style={{ display: 'flex', gap: 10, maxWidth: 520, margin: '0 auto' }}>
                    <input
                      type="text"
                      value={askQuery}
                      onChange={(e) => setAskQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleVoiceAsk(); }}
                      placeholder={t.inputPlaceholder}
                      style={{
                        flex: 1,
                        padding: '11px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    />
                    <button
                      className="primary-btn"
                      onClick={() => handleVoiceAsk()}
                      disabled={isThinking}
                    >
                      <Icons.Send size={15} />
                      <span>{isThinking ? '...' : t.sendText}</span>
                    </button>
                  </div>

                  {isThinking && (
                    <div style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--text-3)' }}>
                      {t.askThinking}
                    </div>
                  )}

                  {aiResponse && (
                    <div className="chat-bubble-res">
                      <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icons.Sprout size={16} />
                        <span>SasyaMitra Advisory:</span>
                      </div>
                      {aiResponse}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Mobile Bottom Navigation (Hidden on Desktop) */}
        <nav className="bottom-nav-mobile">
          <button className={`mobile-nav-item ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
            <Icons.Home size={20} />
            <span>{t.navHome}</span>
          </button>
          <button className={`mobile-nav-item ${tab === 'crops' ? 'active' : ''}`} onClick={() => setTab('crops')}>
            <Icons.Sprout size={20} />
            <span>{t.navCrops}</span>
          </button>
          <button className={`mobile-nav-item ${tab === 'water' ? 'active' : ''}`} onClick={() => setTab('water')}>
            <Icons.Droplets size={20} />
            <span>{t.navWater}</span>
          </button>
          <button className={`mobile-nav-item ${tab === 'sensors' ? 'active' : ''}`} onClick={() => setTab('sensors')}>
            <Icons.Activity size={20} />
            <span>{t.navSensors}</span>
          </button>
          <button className={`mobile-nav-item ${tab === 'ask' ? 'active' : ''}`} onClick={() => setTab('ask')}>
            <Icons.Mic size={20} />
            <span>{t.navAsk}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

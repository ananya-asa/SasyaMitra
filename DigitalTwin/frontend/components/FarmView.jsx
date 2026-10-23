import React, { useState } from 'react';

export default function FarmView({ zones, selectedZoneId, onSelectZone, weather }) {
  const [cropTab, setCropTab] = useState(selectedZoneId === 'B' ? 'B' : 'A');
  const condition = weather?.condition || 'SUNNY';
  const isStorm = condition === 'STORM';
  const isRain = condition === 'RAINY' || isStorm;

  const visible = (zones || []).filter(z => z.zone_id === 'A' || z.zone_id === 'B');
  const shown = visible.filter(z => z.zone_id === cropTab);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Crop twin</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn ${cropTab === 'B' ? 'btn-active' : ''}`} onClick={() => { setCropTab('B'); onSelectZone('B'); }}>ಅಡಿಕೆ</button>
          <button className={`btn ${cropTab === 'A' ? 'btn-active' : ''}`} onClick={() => { setCropTab('A'); onSelectZone('A'); }}>ಭತ್ತ</button>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6 }}>
        2D SVG scene. Driven by FarmState. Demo badge if locked.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 12 }}>
        {shown.map(zone => (
          <CropScene
            key={zone.zone_id}
            zone={zone}
            selected={selectedZoneId === zone.zone_id}
            isRain={isRain}
            isStorm={isStorm}
            onSelect={() => { onSelectZone(zone.zone_id); setCropTab(zone.zone_id); }}
          />
        ))}
      </div>
    </div>
  );
}

function CropScene({ zone, selected, isRain, isStorm, onSelect }) {
  const dry = zone.soil_moisture < 35;
  const happy = !dry && zone.soil_moisture < 85;
  const fungal = zone.humidity >= 88;
  const pump = zone.irrigation === true || zone.irrigation === 'ON';
  const isAreca = zone.crop?.toLowerCase().includes('areca') || zone.zone_id === 'B';
  const droop = dry ? 22 : 0;
  const sky = isStorm ? '#0b1a12' : isRain ? '#163024' : '#1a3d24';

  return (
    <div onClick={onSelect} style={{
      borderRadius: 16,
      overflow: 'hidden',
      border: selected ? '2px solid #c5e05a' : '1px solid rgba(255,255,255,0.12)',
      minHeight: 340,
      background: sky,
      position: 'relative',
      cursor: 'pointer'
    }}>
      {isStorm && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2, pointerEvents: 'none' }} />}
      {fungal && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 40%, rgba(180,200,120,0.25), transparent 55%)', zIndex: 3, pointerEvents: 'none' }} />}
      <svg viewBox="0 0 400 260" width="100%" height="260" style={{ display: 'block' }}>
        {isRain && Array.from({ length: 18 }).map((_, i) => (
          <line key={i} x1={20 + i * 21} y1="0" x2={10 + i * 21} y2="240" stroke="rgba(180,220,255,0.45)" strokeWidth="1.5" className="irrigation-water-active" />
        ))}
        {isAreca ? (
          <>
            <rect x="0" y="190" width="400" height="70" fill={dry ? '#5c4030' : '#2d4a28'} />
            {[40, 110, 190, 270, 340].map((x, i) => (
              <g key={x} transform={`translate(${x},210) rotate(${(i % 2 ? 1 : -1) * droop})`}>
                <rect x="-4" y="-130" width="8" height="130" fill="#4a3324" rx="3" />
                <ellipse cx="0" cy="-140" rx="8" ry="18" fill="#3a281c" />
                {[-50, -20, 20, 50, 80].map((a) => (
                  <path key={a} d={`M 0 -128 Q ${a} ${-90 + droop} ${a * 1.4} ${-40 + droop}`} stroke={dry ? '#c4a35a' : '#3d8c45'} strokeWidth="7" fill="none" />
                ))}
                {!dry && <circle cx="18" cy="-70" r="6" fill="#8b2e2e" />}
                {!dry && <circle cx="-16" cy="-85" r="5" fill="#a33b3b" />}
              </g>
            ))}
          </>
        ) : (
          <>
            <rect x="0" y="150" width="400" height="110" fill={dry ? '#6b5340' : '#1d6a7a'} opacity="0.95" />
            <rect x="0" y={dry ? 210 : 175} width="400" height={dry ? 50 : 85} fill={pump ? '#3aa0c8' : '#2b8aa3'} opacity="0.7" />
            {[30, 70, 110, 150, 190, 230, 270, 310, 350].map((x, i) => (
              <g key={x} transform={`translate(${x},${dry ? 215 : 200}) rotate(${dry ? 18 : 0})`}>
                <path d={`M 0 0 Q -8 ${-40 - (happy ? 10 : 0)} 0 ${-70}`} stroke={dry ? '#c4b56a' : '#b8e05a'} strokeWidth="3" fill="none" />
                <path d={`M 0 0 Q 10 ${-36} 4 ${-62}`} stroke={dry ? '#d1c07a' : '#9ad14a'} strokeWidth="2.5" fill="none" />
              </g>
            ))}
          </>
        )}
        {pump && Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={40 + i * 45} cy={isAreca ? 80 : 140} r="3" fill="#7ec8ff" className="irrigation-water-active" />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 4, color: '#fff', fontWeight: 800 }}>
        {isAreca ? 'Arecanut · ಅಡಿಕೆ' : 'Paddy · ಭತ್ತ'}
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', color: '#f0fdf4', fontSize: 12, zIndex: 4 }}>
        <span>{dry ? 'Drooping' : 'Standing'}</span>
        <span>{Math.round(zone.soil_moisture)}%</span>
        {pump && <span>Pump on</span>}
      </div>
    </div>
  );
}

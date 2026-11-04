import React from 'react';
import { GROUND_FLOOR_LAYOUT } from '../maps/mapData';

export default function GroundFloorSvg({
  selectedRackId,
  onRackClick,
  activePathWaypoints = [],
  animatedMarkerPos = null,
  startNodeId = 'entrance',
  showGrid = false
}) {
  const {
    entrance,
    staffMemberTable,
    idScanners,
    staffDesk,
    headRoom,
    digitalLibrary,
    staircase,
    newspaperStand,
    studyTables,
    diplomaMbaRacks,
    mainRacks
  } = GROUND_FLOOR_LAYOUT;

  // Generate SVG path string from waypoints
  const pathD = activePathWaypoints.length > 1
    ? activePathWaypoints.reduce((acc, wp, idx) => {
        return idx === 0 ? `M ${wp.x} ${wp.y}` : `${acc} L ${wp.x} ${wp.y}`;
      }, '')
    : '';

  // Get selected rack coordinates for pointer arrow
  const selectedRack = [...mainRacks, ...diplomaMbaRacks].find(
    r => r.id === selectedRackId || r.num === selectedRackId || r.name === selectedRackId
  );

  return (
    <svg
      viewBox="0 0 1000 850"
      className="w-full h-full select-none"
      style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.06))' }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="gfFloorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        <linearGradient id="gfWallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id="gfRackGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="gfSelectedRackGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        <linearGradient id="gfRouteGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <marker
          id="routeArrowHead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#10b981" />
        </marker>
      </defs>

      {/* Library Base Floor */}
      <rect x="15" y="15" width="970" height="820" rx="16" fill="url(#gfFloorGrad)" stroke="#cbd5e1" strokeWidth="3" />

      {/* Decorative Walkway Flooring Tiles */}
      <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
        <line x1="20" y1="427" x2="380" y2="427" />
        <line x1="250" y1="150" x2="250" y2="780" />
        <line x1="550" y1="430" x2="550" y2="800" />
      </g>

      {/* OUTER BOUNDARY WALLS */}
      <rect x="20" y="20" width="960" height="810" fill="none" stroke="url(#gfWallGrad)" strokeWidth="6" rx="12" />

      {/* 1. MAIN ENTRANCE (Left Wall) */}
      <g id="gf-entrance" className="cursor-pointer">
        {/* Wall opening gap */}
        <line x1="20" y1={entrance.y} x2="20" y2={entrance.y + entrance.height} stroke="#f8fafc" strokeWidth="10" />
        <rect x="10" y={entrance.y} width="16" height={entrance.height} rx="4" fill="#10b981" />
        {/* Door swing arc */}
        <path d={`M 26 ${entrance.y} A ${entrance.height} ${entrance.height} 0 0 1 ${26 + entrance.height} ${entrance.y + entrance.height}`} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
        <line x1="26" y1={entrance.y} x2="26" y2={entrance.y + entrance.height} stroke="#059669" strokeWidth="4" />
        {/* Entrance Badge */}
        <g transform={`translate(28, ${entrance.y + 20})`}>
          <rect x="0" y="0" width="85" height="36" rx="6" fill="#0f172a" fillOpacity="0.88" />
          <text x="42" y="15" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">ENTRANCE</text>
          <text x="42" y="28" fill="#94a3b8" fontSize="9" textAnchor="middle">INDOOR START</text>
        </g>
      </g>

      {/* 2. STAFF MEMBER SITTING TABLE */}
      <g transform={`translate(${staffMemberTable.x}, ${staffMemberTable.y})`}>
        <rect x="0" y="0" width={staffMemberTable.width} height={staffMemberTable.height} rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        <circle cx="27" cy="20" r="10" fill="#94a3b8" />
        <text x="27" y="52" fill="#475569" fontSize="9" fontWeight="600" textAnchor="middle">Staff Desk</text>
      </g>

      {/* 3. ID CARD SCANNER MACHINES */}
      <g id="gf-scanners">
        {idScanners.map((sc, i) => (
          <g key={sc.id} transform={`translate(${sc.x}, ${sc.y})`}>
            <rect x="0" y="0" width={sc.width} height={sc.height} rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="11" cy="12" r="4" fill="#22c55e" filter="url(#glowEffect)" />
            <line x1="4" y1="24" x2="18" y2="24" stroke="#38bdf8" strokeWidth="2" />
          </g>
        ))}
        <rect x="110" y="352" width="75" height="20" rx="4" fill="#0284c7" />
        <text x="147" y="366" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">ID SCANNERS</text>
      </g>

      {/* 4. STAFF SITTING DESK (L-SHAPED) */}
      <g id="gf-staff-desk">
        <path
          d={`M ${staffDesk.horizontal.x} ${staffDesk.horizontal.y}
              h ${staffDesk.horizontal.width}
              v ${staffDesk.horizontal.height}
              h -${staffDesk.horizontal.width - staffDesk.vertical.width}
              v ${staffDesk.vertical.height}
              h -${staffDesk.vertical.width}
              Z`}
          fill="#e2e8f0"
          stroke="#475569"
          strokeWidth="3"
        />
        <text x={staffDesk.horizontal.x + 90} y={staffDesk.horizontal.y + 22} fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">
          Library Staff Counter
        </text>
        {/* Computer monitors on staff desk */}
        <rect x={staffDesk.horizontal.x + 25} y={staffDesk.horizontal.y + 6} width="22" height="15" rx="2" fill="#0f172a" />
        <rect x={staffDesk.horizontal.x + 85} y={staffDesk.horizontal.y + 6} width="22" height="15" rx="2" fill="#0f172a" />
      </g>

      {/* 5. HEAD OF LIBRARY ROOM */}
      <g id="gf-head-room" transform={`translate(${headRoom.x}, ${headRoom.y})`}>
        <rect x="0" y="0" width={headRoom.width} height={headRoom.height} rx="8" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
        {/* Glass wall strip */}
        <line x1="5" y1="5" x2={headRoom.width - 5} y2="5" stroke="#93c5fd" strokeWidth="4" opacity="0.8" />
        {/* Executive desk inside */}
        <rect x="50" y="30" width="75" height="35" rx="4" fill="#d1d5db" stroke="#6b7280" strokeWidth="1.5" />
        <circle cx="87" cy="48" r="7" fill="#4b5563" />
        <text x={headRoom.width / 2} y="20" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
          Head of Library Room
        </text>
        {/* Door */}
        <line x1="75" y1="0" x2="115" y2="0" stroke="#f1f5f9" strokeWidth="6" />
        <path d="M 75 0 A 40 40 0 0 1 115 40" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
      </g>

      {/* 6. DIGITAL LIBRARY */}
      <g id="gf-digital-library" transform={`translate(${digitalLibrary.x}, ${digitalLibrary.y})`}>
        <rect x="0" y="0" width={digitalLibrary.width} height={digitalLibrary.height} rx="10" fill="#f8fafc" stroke="#1d4ed8" strokeWidth="3" />
        {/* Title Banner */}
        <rect x="10" y="10" width={digitalLibrary.width - 20} height="28" rx="6" fill="#1e3a8a" />
        <text x={digitalLibrary.width / 2} y="28" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
          Digital Library
        </text>
        {/* Computer workstations inside */}
        {[0, 1, 2, 3].map(row => (
          <g key={row} transform={`translate(25, ${55 + row * 38})`}>
            {/* PC 1 */}
            <rect x="0" y="0" width="70" height="24" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="25" y="4" width="20" height="14" rx="2" fill="#0284c7" />
            {/* PC 2 */}
            <rect x="110" y="0" width="70" height="24" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="135" y="4" width="20" height="14" rx="2" fill="#0284c7" />
          </g>
        ))}
        {/* Entrance Door */}
        <rect x={digitalLibrary.width - 6} y="90" width="8" height="40" fill="#10b981" />
        <text x={digitalLibrary.width - 15} y="115" fill="#047857" fontSize="9" fontWeight="bold" textAnchor="end">Door</text>
      </g>

      {/* 7. STEPS (STAIRCASE TO 1ST FLOOR) */}
      <g id="gf-steps" transform={`translate(${staircase.x}, ${staircase.y})`}>
        <rect x="0" y="0" width={staircase.width} height={staircase.height} rx="8" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
        {/* Stair Treads */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(step => (
          <g key={step}>
            <line x1="8" y1={20 + step * 18} x2={staircase.width - 8} y2={20 + step * 18} stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="8" y1={28 + step * 18} x2={staircase.width - 8} y2={28 + step * 18} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
          </g>
        ))}
        {/* Direction Indicator */}
        <rect x="15" y={staircase.height - 32} width={staircase.width - 30} height="24" rx="6" fill="#0284c7" />
        <text x={staircase.width / 2} y={staircase.height - 16} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          STEPS TO 1st FLOOR
        </text>
      </g>

      {/* 8. NEWSPAPER STAND */}
      <g id="gf-newspaper" transform={`translate(${newspaperStand.x}, ${newspaperStand.y})`}>
        <rect x="0" y="0" width={newspaperStand.width} height={newspaperStand.height} rx="8" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
        <line x1="8" y1="18" x2={newspaperStand.width - 8} y2="18" stroke="#f59e0b" strokeWidth="2" />
        <line x1="8" y1="34" x2={newspaperStand.width - 8} y2="34" stroke="#f59e0b" strokeWidth="2" />
        <text x={newspaperStand.width / 2} y="50" fill="#92400e" fontSize="9" fontWeight="bold" textAnchor="middle">
          Newspaper Stand
        </text>
      </g>

      {/* 9. STUDY TABLES */}
      <g id="gf-study-tables">
        {studyTables.map(st => (
          <g key={st.id} transform={`translate(${st.x}, ${st.y})`}>
            {/* Table Top */}
            <rect x="0" y="0" width={st.width} height={st.height} rx="4" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
            {/* Chairs above and below */}
            {[0.15, 0.38, 0.62, 0.85].map((pos, cidx) => (
              <g key={cidx}>
                <rect x={st.width * pos - 8} y="-7" width="16" height="6" rx="2" fill="#9a3412" />
                <rect x={st.width * pos - 8} y={st.height + 1} width="16" height="6" rx="2" fill="#9a3412" />
              </g>
            ))}
            <text x={st.width / 2} y={st.height / 2 + 4} fill="#7c2d12" fontSize="9.5" fontWeight="600" textAnchor="middle">
              Study Table
            </text>
          </g>
        ))}
      </g>

      {/* 10. DIPLOMA & MBA BOOK RACKS (Near Staircase) */}
      <g id="gf-diploma-mba">
        {diplomaMbaRacks.map(r => {
          const isSelected = selectedRackId === r.id || selectedRackId === r.rack_number;
          return (
            <g
              key={r.id}
              transform={`translate(${r.x}, ${r.y})`}
              className="cursor-pointer transition-opacity duration-150 hover:opacity-85"
              onClick={() => onRackClick && onRackClick(r)}
            >
              <rect
                x="0"
                y="0"
                width={r.width}
                height={r.height}
                rx="6"
                fill={isSelected ? 'url(#gfSelectedRackGrad)' : '#0ea5e9'}
                stroke={isSelected ? '#b45309' : '#0369a1'}
                strokeWidth={isSelected ? 3.5 : 2}
                filter={isSelected ? 'url(#glowEffect)' : undefined}
              />
              {/* Center Divider for Section A and Section B */}
              <line x1={r.width / 2} y1="0" x2={r.width / 2} y2={r.height} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={r.width / 4} y="14" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Sec B</text>
              <text x={(r.width * 3) / 4} y="14" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Sec A</text>
              <text x={r.width / 2} y={r.height - 8} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {r.rack_number}
              </text>
            </g>
          );
        })}
      </g>

      {/* 11. MAIN BOOK RACKS (20 Racks in Two Adjacent Columns) */}
      <g id="gf-main-racks">
        {mainRacks.map(r => {
          const isSelected = selectedRackId === r.id || selectedRackId === r.num || selectedRackId === r.name;
          const isCivil = r.name.includes('Civil');
          const isMech = r.name.includes('Mechanical');
          const isEee = r.name.includes('Electrical');
          const isEce = r.name.includes('Electronics');
          const isCse = r.name.includes('Computer');
          const isAim = r.name.includes('Intelligence') || r.name.includes('Machine');

          let baseColor = '#2563eb';
          if (isCivil) baseColor = '#059669';
          else if (isMech) baseColor = '#d97706';
          else if (isEee) baseColor = '#e11d48';
          else if (isEce) baseColor = '#7c3aed';
          else if (isCse) baseColor = '#2563eb';
          else if (isAim) baseColor = '#0891b2';

          return (
            <g
              key={r.id}
              transform={`translate(${r.x}, ${r.y})`}
              className="cursor-pointer transition-opacity duration-150 hover:opacity-85"
              onClick={() => onRackClick && onRackClick(r)}
            >
              {/* Rack Box */}
              <rect
                x="0"
                y="0"
                width={r.w}
                height={r.h}
                rx="5"
                fill={isSelected ? '#f59e0b' : '#ffffff'}
                stroke={isSelected ? '#b45309' : baseColor}
                strokeWidth={isSelected ? 3.5 : 2}
                filter={isSelected ? 'url(#glowEffect)' : undefined}
              />

              {/* Section Divider Line (A and B) */}
              <line x1={r.w / 2} y1="0" x2={r.w / 2} y2={r.h} stroke={isSelected ? '#ffffff' : '#94a3b8'} strokeWidth="1.2" strokeDasharray="2 2" />

              {/* Rack Number Badge */}
              <rect x="4" y="4" width="46" height={r.h - 8} rx="3" fill={isSelected ? '#78350f' : baseColor} />
              <text x="27" y={r.h / 2 + 3.5} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {r.num}
              </text>

              {/* Subject Label */}
              <text
                x={r.w - 8}
                y={r.h / 2 + 3.5}
                fill={isSelected ? '#78350f' : '#1e293b'}
                fontSize="8"
                fontWeight="bold"
                textAnchor="end"
              >
                {r.name.length > 18 ? r.name.substring(0, 16) + '..' : r.name}
              </text>

              {/* Section indicators */}
              <text x={r.w / 2 - 8} y={r.h - 4} fill={isSelected ? '#fff' : '#64748b'} fontSize="6.5">B</text>
              <text x={r.w / 2 + 3} y={r.h - 4} fill={isSelected ? '#fff' : '#64748b'} fontSize="6.5">A</text>
            </g>
          );
        })}
      </g>

      {/* 12. ACTIVE NAVIGATION PATH (Rendered dynamically) */}
      {pathD && (
        <g id="gf-nav-route">
          {/* Path Outer Glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
            filter="url(#glowEffect)"
          />
          {/* Main Route Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#gfRouteGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#routeArrowHead)"
          />
          {/* Animated Dash Overlay */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 10"
            className="animate-[dash_1.5s_linear_infinite]"
            style={{
              animation: 'dashRoute 1.2s linear infinite'
            }}
          />
          {/* Waypoint circles */}
          {activePathWaypoints.map((wp, i) => (
            <circle
              key={i}
              cx={wp.x}
              cy={wp.y}
              r={i === 0 || i === activePathWaypoints.length - 1 ? 7 : 4}
              fill={i === 0 ? '#2563eb' : i === activePathWaypoints.length - 1 ? '#10b981' : '#38bdf8'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
        </g>
      )}

      {/* 13. ANIMATED WALKING MARKER */}
      {animatedMarkerPos && (
        <g transform={`translate(${animatedMarkerPos.x}, ${animatedMarkerPos.y})`}>
          {/* Pulsing radar rings */}
          <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.3">
            <animate attributeName="r" values="12;26;12" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite" />
          </circle>
          {/* Avatar Pin */}
          <circle cx="0" cy="0" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" filter="url(#glowEffect)" />
          {/* Student Person Icon */}
          <circle cx="0" cy="-2" r="3" fill="#ffffff" />
          <path d="M -5 6 Q 0 2 5 6" stroke="#ffffff" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* 14. FLOATING POINTER ARROW AT SELECTED RACK */}
      {selectedRack && (
        <g transform={`translate(${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 15})`}>
          {/* Bouncing animation */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 25};
                    ${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 12};
                    ${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 25}`}
            dur="1.2s"
            repeatCount="indefinite"
          />
          {/* Destination Pin Marker */}
          <path d="M 0 0 L -10 -16 Q -14 -28 0 -28 Q 14 -28 10 -16 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="2" filter="url(#glowEffect)" />
          <circle cx="0" cy="-18" r="4.5" fill="#ffffff" />
          {/* Target rack banner */}
          <rect x="-55" y="-52" width="110" height="20" rx="4" fill="#0f172a" />
          <text x="0" y="-38" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
            {selectedRack.num || selectedRack.rack_number}
          </text>
        </g>
      )}

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes dashRoute {
          from {
            stroke-dashoffset: 36;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}

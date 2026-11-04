import React from 'react';
import { FIRST_FLOOR_LAYOUT } from '../maps/mapData';

export default function FirstFloorSvg({
  selectedRackId,
  onRackClick,
  activePathWaypoints = [],
  animatedMarkerPos = null,
  startNodeId = 'staircase_1f'
}) {
  const {
    staircase,
    laptopChargingBenches,
    projectWorkingRooms,
    studyTables,
    scstRacks,
    referenceRacks
  } = FIRST_FLOOR_LAYOUT;

  // Path SVG string
  const pathD = activePathWaypoints.length > 1
    ? activePathWaypoints.reduce((acc, wp, idx) => {
        return idx === 0 ? `M ${wp.x} ${wp.y}` : `${acc} L ${wp.x} ${wp.y}`;
      }, '')
    : '';

  // Selected rack lookup
  const selectedRack = [...referenceRacks, ...scstRacks].find(
    r => r.id === selectedRackId || r.num === selectedRackId || r.name === selectedRackId || r.rack_number === selectedRackId
  );

  return (
    <svg
      viewBox="0 0 1000 850"
      className="w-full h-full select-none"
      style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.06))' }}
    >
      <defs>
        <linearGradient id="ffFloorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        <linearGradient id="ffWallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        <linearGradient id="ffRouteGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <filter id="ffGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <marker
          id="ffRouteArrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#10b981" />
        </marker>
      </defs>

      {/* Base Floor */}
      <rect x="15" y="15" width="970" height="820" rx="16" fill="url(#ffFloorGrad)" stroke="#cbd5e1" strokeWidth="3" />

      {/* Decorative Walkway lines */}
      <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
        <line x1="365" y1="220" x2="365" y2="780" />
        <line x1="260" y1="220" x2="900" y2="220" />
        <line x1="620" y1="250" x2="620" y2="750" />
      </g>

      {/* OUTER BOUNDARY WALLS */}
      <rect x="20" y="20" width="960" height="810" fill="none" stroke="url(#ffWallGrad)" strokeWidth="6" rx="12" />

      {/* 1. STAIRCASE (Matching Ground Floor Position) */}
      <g id="ff-steps" transform={`translate(${staircase.x}, ${staircase.y})`}>
        <rect x="0" y="0" width={staircase.width} height={staircase.height} rx="8" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(step => (
          <g key={step}>
            <line x1="8" y1={20 + step * 18} x2={staircase.width - 8} y2={20 + step * 18} stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="8" y1={28 + step * 18} x2={staircase.width - 8} y2={28 + step * 18} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
          </g>
        ))}
        {/* Landing Badge */}
        <rect x="15" y="12" width={staircase.width - 30} height="24" rx="6" fill="#0284c7" />
        <text x={staircase.width / 2} y="28" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
          STEPS FROM GF
        </text>
      </g>

      {/* 2. LAPTOP CHARGING AREA (Left Side) */}
      <g id="ff-charging-area">
        {/* Header Badge */}
        <rect x="45" y="42" width="210" height="24" rx="5" fill="#312e81" />
        <text x="150" y="58" fill="#e0e7ff" fontSize="11" fontWeight="bold" textAnchor="middle">
          Laptop Charging Benches
        </text>

        {laptopChargingBenches.map((bench, idx) => (
          <g key={bench.id} transform={`translate(${bench.x}, ${bench.y})`}>
            {/* Long Charging Bench */}
            <rect x="0" y="0" width={bench.width} height={bench.height} rx="5" fill="#ede9fe" stroke="#6366f1" strokeWidth="2" />
            {/* Charging socket indicators along the bench */}
            {[0.12, 0.35, 0.58, 0.82].map((pos, sidx) => (
              <g key={sidx} transform={`translate(${bench.width * pos}, 5)`}>
                <rect x="-8" y="0" width="16" height="18" rx="3" fill="#4338ca" />
                <circle cx="-3" cy="9" r="1.5" fill="#ffffff" />
                <circle cx="3" cy="9" r="1.5" fill="#ffffff" />
              </g>
            ))}
            <text x={bench.width / 2} y={bench.height + 15} fill="#4f46e5" fontSize="8.5" fontWeight="600" textAnchor="middle">
              {bench.label}
            </text>
          </g>
        ))}
      </g>

      {/* 3. PROJECT WORKING ROOMS (Along the top wall) */}
      <g id="ff-project-rooms">
        {projectWorkingRooms.map((room, idx) => (
          <g key={room.id} transform={`translate(${room.x}, ${room.y})`}>
            {/* Room Boundary */}
            <rect x="0" y="0" width={room.width} height={room.height} rx="8" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
            {/* Glass partition accent */}
            <rect x="5" y="5" width={room.width - 10} height="24" rx="4" fill="#1e3a8a" />
            <text x={room.width / 2} y="21" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              Room {idx + 1}
            </text>
            {/* Conference Table */}
            <rect x="25" y="50" width={room.width - 50} height="55" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Chairs */}
            <circle cx="15" cy="77" r="5" fill="#a16207" />
            <circle cx={room.width - 15} cy="77" r="5" fill="#a16207" />
            <circle cx="40" cy="40" r="5" fill="#a16207" />
            <circle cx="65" cy="40" r="5" fill="#a16207" />
            <circle cx="40" cy="115" r="5" fill="#a16207" />
            <circle cx="65" cy="115" r="5" fill="#a16207" />
            {/* Door */}
            <line x1={room.width / 2 - 20} y1={room.height} x2={room.width / 2 + 20} y2={room.height} stroke="#ffffff" strokeWidth="6" />
            <path d={`M ${room.width / 2 - 20} ${room.height} A 25 25 0 0 1 ${room.width / 2 + 20} ${room.height - 20}`} fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={room.width / 2} y={room.height - 6} fill="#1d4ed8" fontSize="8" fontWeight="bold" textAnchor="middle">Door</text>
          </g>
        ))}
      </g>

      {/* 4. STUDY TABLES (Center area) */}
      <g id="ff-study-tables">
        {studyTables.map(st => (
          <g key={st.id} transform={`translate(${st.x}, ${st.y})`}>
            <rect x="0" y="0" width={st.width} height={st.height} rx="4" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
            {[0.12, 0.32, 0.52, 0.72, 0.9].map((pos, cidx) => (
              <g key={cidx}>
                <rect x={st.width * pos - 8} y="-7" width="16" height="6" rx="2" fill="#9a3412" />
                <rect x={st.width * pos - 8} y={st.height + 1} width="16" height="6" rx="2" fill="#9a3412" />
              </g>
            ))}
            <text x={st.width / 2} y={st.height / 2 + 4} fill="#7c2d12" fontSize="9.5" fontWeight="600" textAnchor="middle">
              First Floor Study Table
            </text>
          </g>
        ))}
      </g>

      {/* 5. SC/ST BOOK RACKS (Two separate racks) */}
      <g id="ff-scst-racks">
        {scstRacks.map(r => {
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
                fill={isSelected ? '#f59e0b' : '#7c3aed'}
                stroke={isSelected ? '#b45309' : '#5b21b6'}
                strokeWidth={isSelected ? 3.5 : 2}
                filter={isSelected ? 'url(#ffGlow)' : undefined}
              />
              <line x1={r.width / 2} y1="0" x2={r.width / 2} y2={r.height} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={r.width / 2} y={r.height / 2 + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                {r.rack_number}
              </text>
            </g>
          );
        })}
      </g>

      {/* 6. REFERENCE BOOK RACKS (RIGHT SIDE - EXACTLY 11 RACKS) */}
      <g id="ff-reference-racks">
        {/* Header Label for Reference Area */}
        <rect x="660" y="235" width="190" height="24" rx="5" fill="#047857" />
        <text x="755" y="251" fill="#ecfdf5" fontSize="11" fontWeight="bold" textAnchor="middle">
          REFERENCE BOOK RACKS
        </text>

        {referenceRacks.map(r => {
          const isSelected = selectedRackId === r.id || selectedRackId === r.num || selectedRackId === r.name;
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
                width={r.w}
                height={r.h}
                rx="5"
                fill={isSelected ? '#f59e0b' : '#ffffff'}
                stroke={isSelected ? '#b45309' : '#059669'}
                strokeWidth={isSelected ? 3.5 : 2}
                filter={isSelected ? 'url(#ffGlow)' : undefined}
              />

              {/* Section Divider */}
              <line x1={r.w / 2} y1="0" x2={r.w / 2} y2={r.h} stroke={isSelected ? '#ffffff' : '#cbd5e1'} strokeWidth="1" strokeDasharray="2 2" />

              {/* Rack Number Badge */}
              <rect x="4" y="3" width="50" height={r.h - 6} rx="3" fill={isSelected ? '#78350f' : '#059669'} />
              <text x="29" y={r.h / 2 + 3.5} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {r.num}
              </text>

              {/* Subject Title */}
              <text
                x={r.w - 8}
                y={r.h / 2 + 3.5}
                fill={isSelected ? '#78350f' : '#0f172a'}
                fontSize="8"
                fontWeight="bold"
                textAnchor="end"
              >
                {r.name.length > 25 ? r.name.substring(0, 23) + '..' : r.name}
              </text>
            </g>
          );
        })}
      </g>

      {/* 7. ACTIVE NAVIGATION ROUTE */}
      {pathD && (
        <g id="ff-nav-route">
          <path
            d={pathD}
            fill="none"
            stroke="#818cf8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
            filter="url(#ffGlow)"
          />
          <path
            d={pathD}
            fill="none"
            stroke="url(#ffRouteGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#ffRouteArrow)"
          />
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 10"
            style={{
              animation: 'dashRoute 1.2s linear infinite'
            }}
          />
          {activePathWaypoints.map((wp, i) => (
            <circle
              key={i}
              cx={wp.x}
              cy={wp.y}
              r={i === 0 || i === activePathWaypoints.length - 1 ? 7 : 4}
              fill={i === 0 ? '#4f46e5' : i === activePathWaypoints.length - 1 ? '#10b981' : '#38bdf8'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
        </g>
      )}

      {/* 8. ANIMATED WALKING MARKER */}
      {animatedMarkerPos && (
        <g transform={`translate(${animatedMarkerPos.x}, ${animatedMarkerPos.y})`}>
          <circle cx="0" cy="0" r="18" fill="#6366f1" opacity="0.3">
            <animate attributeName="r" values="12;26;12" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="10" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" filter="url(#ffGlow)" />
          <circle cx="0" cy="-2" r="3" fill="#ffffff" />
          <path d="M -5 6 Q 0 2 5 6" stroke="#ffffff" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* 9. FLOATING POINTER ARROW AT SELECTED RACK */}
      {selectedRack && (
        <g transform={`translate(${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 15})`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 25};
                    ${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 12};
                    ${selectedRack.x + (selectedRack.w || selectedRack.width) / 2}, ${selectedRack.y - 25}`}
            dur="1.2s"
            repeatCount="indefinite"
          />
          <path d="M 0 0 L -10 -16 Q -14 -28 0 -28 Q 14 -28 10 -16 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="2" filter="url(#ffGlow)" />
          <circle cx="0" cy="-18" r="4.5" fill="#ffffff" />
          <rect x="-55" y="-52" width="110" height="20" rx="4" fill="#0f172a" />
          <text x="0" y="-38" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
            {selectedRack.num || selectedRack.rack_number}
          </text>
        </g>
      )}

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

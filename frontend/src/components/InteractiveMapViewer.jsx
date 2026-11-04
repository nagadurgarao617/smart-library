import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Layers,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Scan
} from 'lucide-react';

import GroundFloorSvg from './GroundFloorSvg';
import FirstFloorSvg from './FirstFloorSvg';
import {
  GF_GRAPH,
  FF_GRAPH,
  findShortestPath,
  getRackNodeId
} from '../maps/navigationEngine';

function getStepActionIcon(action) {
  switch (action) {
    case 'left':
      return <CornerUpLeft className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'right':
      return <CornerUpRight className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'straight':
      return <ArrowUp className="w-4 h-4 text-sky-400 shrink-0" />;
    case 'stairs':
      return <Layers className="w-4 h-4 text-purple-400 shrink-0" />;
    case 'scanner':
      return <Scan className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'arrive':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    default:
      return <MapPin className="w-4 h-4 text-sky-400 shrink-0" />;
  }
}

export default function InteractiveMapViewer({
  selectedBook = null,
  initialFloor = 'Ground Floor',
  initialRackId = null,
  onClose = null
}) {
  const [currentFloor, setCurrentFloor] = useState(initialFloor);
  const [selectedRackId, setSelectedRackId] = useState(initialRackId);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startPoint, setStartPoint] = useState(
    currentFloor.includes('First') || currentFloor === '1F' ? 'staircase_1f' : 'entrance'
  );

  // Path & Navigation State
  const [activeRoute, setActiveRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [markerPos, setMarkerPos] = useState(null);
  const [reachedDestination, setReachedDestination] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const animRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Synchronize when selectedBook changes
  useEffect(() => {
    if (selectedBook) {
      const bookFloor = selectedBook.floor || 'Ground Floor';
      setCurrentFloor(bookFloor);
      const rackId = getRackNodeId(bookFloor, selectedBook.rack_number);
      setSelectedRackId(rackId);
      setReachedDestination(false);
      setIsNavigating(false);

      const isFirst = bookFloor.includes('First') || bookFloor === '1F';
      setStartPoint(isFirst ? 'staircase_1f' : 'entrance');
    }
  }, [selectedBook]);

  // Recalculate route whenever floor, startPoint, or selectedRackId changes
  useEffect(() => {
    if (!selectedRackId) {
      setActiveRoute(null);
      setMarkerPos(null);
      return;
    }

    const isFirstFloor = currentFloor.includes('First') || currentFloor === '1F';
    const graph = isFirstFloor ? FF_GRAPH : GF_GRAPH;

    let effectiveStart = startPoint;
    if (!graph.nodes[effectiveStart]) {
      effectiveStart = isFirstFloor ? 'staircase_1f' : 'entrance';
      setStartPoint(effectiveStart);
    }

    let effectiveTarget = selectedRackId;
    if (!graph.nodes[effectiveTarget]) {
      effectiveTarget = isFirstFloor ? '1F-R01' : 'GF-R01';
    }

    const route = findShortestPath(graph, effectiveStart, effectiveTarget);
    if (route) {
      setActiveRoute(route);
      setMarkerPos(route.waypoints[0] || null);
      setCurrentStepIndex(0);
      setReachedDestination(false);
    }
  }, [currentFloor, selectedRackId, startPoint]);

  // Text to speech helper
  const speakInstruction = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignore speech errors
    }
  };

  // Jump to a specific step
  const handleJumpToStep = (index) => {
    if (!activeRoute || !activeRoute.instructions[index]) return;

    if (isNavigating) {
      cancelAnimationFrame(animRef.current);
      setIsNavigating(false);
    }

    setCurrentStepIndex(index);
    const targetNodeId = activeRoute.instructions[index].nodeId;
    const targetWp = activeRoute.waypoints.find(wp => wp.id === targetNodeId);
    if (targetWp) {
      setMarkerPos({ x: targetWp.x, y: targetWp.y });
    }

    if (index === activeRoute.instructions.length - 1) {
      setReachedDestination(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      setReachedDestination(false);
    }

    speakInstruction(activeRoute.instructions[index].text);
  };

  const handleNextStep = () => {
    if (!activeRoute) return;
    if (currentStepIndex < activeRoute.instructions.length - 1) {
      handleJumpToStep(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (!activeRoute) return;
    if (currentStepIndex > 0) {
      handleJumpToStep(currentStepIndex - 1);
    }
  };

  // Start / Stop animated navigation walkthrough
  const handleStartNavigation = () => {
    if (!activeRoute || activeRoute.waypoints.length === 0) return;

    if (isNavigating) {
      cancelAnimationFrame(animRef.current);
      setIsNavigating(false);
      return;
    }

    const waypoints = activeRoute.waypoints;
    let currentWpIdx = 0;

    if (reachedDestination || currentStepIndex >= activeRoute.instructions.length - 1) {
      currentWpIdx = 0;
      setCurrentStepIndex(0);
      setReachedDestination(false);
      setMarkerPos(waypoints[0]);
    } else {
      const activeNodeId = activeRoute.instructions[currentStepIndex]?.nodeId;
      const foundIdx = waypoints.findIndex(wp => wp.id === activeNodeId);
      currentWpIdx = foundIdx >= 0 ? foundIdx : 0;
    }

    setIsNavigating(true);
    setReachedDestination(false);

    let t = 0;
    const speed = 0.035;

    speakInstruction(activeRoute.instructions[currentStepIndex]?.text || 'Starting indoor navigation');

    const animateStep = () => {
      if (currentWpIdx >= waypoints.length - 1) {
        setMarkerPos(waypoints[waypoints.length - 1]);
        setIsNavigating(false);
        setReachedDestination(true);
        setCurrentStepIndex(activeRoute.instructions.length - 1);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });

        speakInstruction('You have reached your destination!');
        return;
      }

      t += speed;
      if (t >= 1) {
        t = 0;
        currentWpIdx++;
        if (currentWpIdx < waypoints.length) {
          const matchingStep = activeRoute.instructions.findIndex(
            inst => inst.nodeId === waypoints[currentWpIdx].id
          );
          if (matchingStep !== -1) {
            setCurrentStepIndex(matchingStep);
            speakInstruction(activeRoute.instructions[matchingStep].text);
          }
        }
      }

      if (currentWpIdx < waypoints.length - 1) {
        const curP1 = waypoints[currentWpIdx];
        const curP2 = waypoints[currentWpIdx + 1];
        setMarkerPos({
          x: curP1.x + (curP2.x - curP1.x) * t,
          y: curP1.y + (curP2.y - curP1.y) * t
        });
        animRef.current = requestAnimationFrame(animateStep);
      } else {
        setMarkerPos(waypoints[waypoints.length - 1]);
        setIsNavigating(false);
        setReachedDestination(true);
        confetti({ particleCount: 50 });
      }
    };

    animRef.current = requestAnimationFrame(animateStep);
  };

  // Reset Navigation
  const handleResetNavigation = () => {
    cancelAnimationFrame(animRef.current);
    setIsNavigating(false);
    setReachedDestination(false);
    setCurrentStepIndex(0);
    if (activeRoute && activeRoute.waypoints.length > 0) {
      setMarkerPos(activeRoute.waypoints[0]);
    }
  };

  // Rack clicked on map
  const handleRackClick = (rack) => {
    const rackId = rack.id || rack.num;
    setSelectedRackId(rackId);
    setReachedDestination(false);
    setIsNavigating(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const isFirstFloor = currentFloor.includes('First') || currentFloor === '1F';

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60">
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md shrink-0">
        {/* Floor Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" /> Floor:
          </span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => {
                setCurrentFloor('Ground Floor');
                setStartPoint('entrance');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                !isFirstFloor
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ground Floor (GF)
            </button>
            <button
              onClick={() => {
                setCurrentFloor('First Floor');
                setStartPoint('staircase_1f');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                isFirstFloor
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              First Floor (1F)
            </button>
          </div>
        </div>

        {/* Starting Point Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Start:
          </span>
          <select
            value={startPoint}
            onChange={(e) => {
              setStartPoint(e.target.value);
              handleResetNavigation();
            }}
            className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-sky-500"
          >
            {!isFirstFloor ? (
              <>
                <option value="entrance">Main Entrance (Default)</option>
                <option value="scanners_exit">ID Scanner Exit</option>
                <option value="staff_desk_access">Staff Sitting Counter</option>
                <option value="digital_lib_door">Digital Library Door</option>
                <option value="staircase_gf">Staircase Landing</option>
                <option value="mid_study_aisle">Study Tables Aisle</option>
              </>
            ) : (
              <>
                <option value="staircase_1f">Staircase Landing (Default)</option>
                <option value="charging_junction">Laptop Charging Zone</option>
                <option value="pwr_1_door">Project Working Room 1</option>
                <option value="study_tables_1f">Study Tables Aisle</option>
                <option value="ref_entry">Reference Stacks North</option>
              </>
            )}
          </select>
        </div>

        {/* Action Buttons & Map Zoom */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              speechEnabled
                ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700'
                : 'bg-slate-800/50 border-slate-800 text-slate-500'
            }`}
            title={speechEnabled ? 'Mute voice instructions' : 'Enable voice instructions'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Zoom In/Out */}
          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 text-xs font-mono text-slate-300 hover:text-white"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Action Buttons */}
          <button
            onClick={handleStartNavigation}
            disabled={!activeRoute}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isNavigating
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isNavigating ? 'animate-spin' : ''}`} />
            {isNavigating ? 'PAUSE ROUTE' : 'START WALK'}
          </button>

          <button
            onClick={handleResetNavigation}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            title="Reset Navigation Route"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN MAP VIEWPORT: 100% CLEAR, FULL VIEW, ZERO OVERLAYS ON MAP */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center min-h-0">
        {/* SVG Container with Zoom Transform */}
        <div
          ref={mapContainerRef}
          className="w-full h-full flex items-center justify-center p-3 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {!isFirstFloor ? (
            <GroundFloorSvg
              selectedRackId={selectedRackId}
              onRackClick={handleRackClick}
              activePathWaypoints={activeRoute?.waypoints || []}
              animatedMarkerPos={markerPos}
              startNodeId={startPoint}
            />
          ) : (
            <FirstFloorSvg
              selectedRackId={selectedRackId}
              onRackClick={handleRackClick}
              activePathWaypoints={activeRoute?.waypoints || []}
              animatedMarkerPos={markerPos}
              startNodeId={startPoint}
            />
          )}
        </div>

        {/* DESTINATION REACHED NOTIFICATION (Sleek Compact Toast at Top) */}
        {reachedDestination && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-emerald-600/95 border-2 border-emerald-400 text-white px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
            <div>
              <p className="font-bold text-xs tracking-wide">Destination Reached!</p>
              <p className="text-[11px] text-emerald-100">
                You have reached your destination: {selectedBook ? `${selectedBook.rack_number} (${selectedBook.rack_name})` : selectedRackId}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. DEDICATED STEPS NAVIGATION DOCK (BELOW MAP - NEVER OVERLAPS OR COVERS MAP) */}
      {activeRoute && activeRoute.instructions.length > 0 && (
        <div className="bg-slate-950 border-t border-slate-800 px-5 py-2.5 shrink-0 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
            {/* Step Icon & Current Instruction Text */}
            <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                {getStepActionIcon(activeRoute.instructions[currentStepIndex]?.action)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                    Step {currentStepIndex + 1} of {activeRoute.instructions.length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    • {currentFloor}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                  {activeRoute.instructions[currentStepIndex]?.text}
                </p>
                {selectedBook && currentStepIndex === activeRoute.instructions.length - 1 && (
                  <p className="text-[11px] text-amber-400 font-medium mt-0.5">
                    📍 Shelf: {selectedBook.shelf_number} • Position: {selectedBook.position}
                  </p>
                )}
              </div>
            </div>

            {/* Step Controls: Voice Replay, Prev, Next */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Voice Replay */}
              <button
                onClick={() => speakInstruction(activeRoute.instructions[currentStepIndex]?.text)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors"
                title="Replay Voice Instruction"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Prev Step */}
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  currentStepIndex === 0
                    ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500 bg-slate-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              {/* Next Step */}
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === activeRoute.instructions.length - 1}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  currentStepIndex === activeRoute.instructions.length - 1
                    ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500 bg-slate-900'
                    : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-600/20'
                }`}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2 max-w-xl mx-auto overflow-x-auto py-0.5">
            {activeRoute.instructions.map((inst, i) => (
              <button
                key={i}
                onClick={() => handleJumpToStep(i)}
                title={`Step ${i + 1}: ${inst.text}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentStepIndex
                    ? 'w-6 bg-sky-400'
                    : i < currentStepIndex
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. BOTTOM BOOK DETAIL STRIP */}
      {selectedBook && (
        <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
              {selectedBook.floor.includes('First') ? '1F' : 'GF'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-100">{selectedBook.title}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedBook.availability_status === 'Available'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {selectedBook.availability_status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                by {selectedBook.author} • {selectedBook.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-500 block font-semibold">Location</span>
              <span className="font-bold text-sky-400">
                {selectedBook.rack_number} • {selectedBook.position}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                Close Map
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

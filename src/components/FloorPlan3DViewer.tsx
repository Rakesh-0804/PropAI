'use client';

import React, { useState, useEffect } from 'react';
import { FloorPlan3DData, FloorPlanRoom } from '@/types';
import {
  Box,
  Layers,
  Maximize2,
  Minimize2,
  Eye,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
  Zap,
  Sun,
  Moon,
  Sunset,
  Palette,
  RotateCw,
  Move,
  Camera,
  X,
  Maximize,
  Sliders,
  Wind,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface FloorPlan3DViewerProps {
  propertyId: string;
  initialData?: FloorPlan3DData | null;
}

export default function FloorPlan3DViewer({ propertyId, initialData }: FloorPlan3DViewerProps) {
  const [data, setData] = useState<FloorPlan3DData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [generating, setGenerating] = useState(false);

  // Interactive View & Studio Controls
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'walkthrough'>('3d');
  const [theme, setTheme] = useState<'wood' | 'marble' | 'cyber' | 'blueprint'>('wood');
  const [lighting, setLighting] = useState<'day' | 'sunset' | 'night'>('day');
  const [orbitAngle, setOrbitAngle] = useState<number>(45); // 0, 45, 90, 180, 270
  const [pitchAngle, setPitchAngle] = useState<number>(35); // 15, 35, 60, 90
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FloorPlanRoom | null>(null);
  const [wallHeight, setWallHeight] = useState(9.5);
  const [sourceType, setSourceType] = useState<'photo2d' | 'tour360'>('photo2d');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deepInspectModalOpen, setDeepInspectModalOpen] = useState(false);

  useEffect(() => {
    if (!initialData) {
      fetchFloorPlan();
    }
  }, [propertyId]);

  const fetchFloorPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/floor-plan?propertyId=${propertyId}`);
      const json = await res.json();
      if (res.ok && json.floorPlan) {
        setData(json.floorPlan);
        if (json.floorPlan.rooms?.length > 0) {
          setSelectedRoom(json.floorPlan.rooms[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch floor plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/floor-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, sourceType }),
      });
      const json = await res.json();
      if (res.ok && json.floorPlan) {
        setData(json.floorPlan);
        if (json.floorPlan.rooms?.length > 0) {
          setSelectedRoom(json.floorPlan.rooms[0]);
        }
      }
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setGenerating(false);
    }
  };

  const getDeepRoomDetails = (room: FloorPlanRoom) => {
    const type = room.type;
    const isMaster = type === 'master_bedroom';
    const isLiving = type === 'living';
    const isKitchen = type === 'kitchen';
    const isBath = type === 'bathroom';
    const isBalcony = type === 'balcony';

    if (isMaster) {
      return {
        categoryName: 'Primary Executive Suite',
        flooring: 'Herringbone Teak Wood Slabs (Large 24"×24" Format Tiles)',
        ceiling: '10.5 ft False Ceiling with Dimmable LED Cove Lighting',
        wallFinish: 'Sound-Dampening Acoustic Wood Panels & Venetian Plaster',
        orientation: 'East-Facing (Morning Sunlight & Cross-Ventilation)',
        stagedItems: [
          '🛏️ King Storage Bed with Velvet Headboard',
          '🛋️ Leather Reading Chaise Lounge',
          '💄 Executive Vanity & Floating Dressing Table',
          '👔 Walk-in Smart Wardrobe System',
          '📺 65" Flush OLED Media Wall',
        ],
        automation: '6-Zone Automated Climate Control & Motorized Blackout Curtains',
        volumeCuFt: Math.round(room.areaSqft * 10.5),
        electricalPoints: '12 Dual-Socket USB-C Power Ports',
      };
    }

    if (isLiving) {
      return {
        categoryName: 'Grand Living & Dining Lounge',
        flooring: 'Polished Botticino Marble Slabs (Jumbo 36"×36" Grand Format Tiles)',
        ceiling: '11.0 ft Architectural Coffered Ceiling with Chandelier',
        wallFinish: 'Custom Fluted Marble Wall & Floor-to-Ceiling Glass',
        orientation: 'North-East Facing (Double-Height Glazing & Panoramic View)',
        stagedItems: [
          '🛋️ 8-Seater Italian Sectional Leather Sofa',
          '☕ Calacatta Marble Center Coffee Table',
          '🍷 Integrated Wine Cellar & Wet Bar Counter',
          '🍽️ 8-Seater Hardwood Dining Table Set',
          '🔥 Ventless Linear Ethanol Fireplace Feature',
        ],
        automation: 'Multi-Room Sonos Smart Audio & Ambient Scene Lighting',
        volumeCuFt: Math.round(room.areaSqft * 11.0),
        electricalPoints: '18 High-Speed Power & Fiber Optic Outlets',
      };
    }

    if (isKitchen) {
      return {
        categoryName: 'Gourmet Chef Kitchen',
        flooring: 'Anti-Skid German Vitrified Porcelain Tiles (Large 24"×24" Format)',
        ceiling: '9.5 ft Recessed Spotlights & Moisture-Resistant Ceiling',
        wallFinish: 'Quartz Splashback & Handleless Acrylic Cabinets',
        orientation: 'West-Facing (Dedicated Utility & Pantry Balcony Access)',
        stagedItems: [
          '🍳 Quartz Waterfall Prep Island with Breakfast Bar',
          '🔥 Miele Built-In Induction Hob & Heavy Duty Chimney',
          '🧊 Sub-Zero Double-Door Integrated Refrigerator',
          '☕ Built-in Espresso & Coffee Station',
          '🧽 Bosch Silent Dishwasher & Dual Undermount Sink',
        ],
        automation: 'Gas Leak Sensor, Smart Smoke Detector & Auto-Shutoff Valve',
        volumeCuFt: Math.round(room.areaSqft * 9.5),
        electricalPoints: '10 High-Power Appliance Outlets (16A)',
      };
    }

    if (isBath) {
      return {
        categoryName: 'Luxury Spa Bathroom Suite',
        flooring: 'Bookmatched Statuario Marble Tiles (Grand 36"×36" Slabs)',
        ceiling: '9.0 ft Water-Resistant Ceiling with Infrared Heating Module',
        wallFinish: 'Full-Height Statuario Marble & Frameless Glass Partition',
        orientation: 'Ventilated Shaft Facing with Exhaust Automation',
        stagedItems: [
          '🛁 Freestanding Acrylic Jacuzzi Soaking Tub',
          '🚿 Thermostatic Rain Shower with Hydrojets',
          '🪞 Dual Vessel Marble Vanity & Anti-Fog LED Mirrors',
          '🚽 Toto Neorest Heated Bidet Smart Toilet',
        ],
        automation: 'Automated Dehumidifier & Touchless Sensor Faucets',
        volumeCuFt: Math.round(room.areaSqft * 9.0),
        electricalPoints: 'GFCI Protected Power Ports & Heated Towel Rack',
      };
    }

    if (isBalcony) {
      return {
        categoryName: 'Outdoor Terrace & Sky Deck',
        flooring: 'Weatherproof Teak Paver Slabs (Large 24"×24" Deck Tiles)',
        ceiling: 'Open Roof Sky Vista / Pergola Canopy',
        wallFinish: 'Vertical Hydroponic Green Wall & Glass Balustrade',
        orientation: 'Panoramic City & Sunset View Exposure',
        stagedItems: [
          '☀️ All-Weather Rattan Sun loungers',
          '☕ 4-Seater Teak Outdoor Breakfast Table',
          '🪴 Ambient Solar LED Planters & Misting System',
        ],
        automation: 'Rain-Sensor Retractable Awning & Drip Irrigation',
        volumeCuFt: Math.round(room.areaSqft * 10),
        electricalPoints: 'Weatherproof IP66 Outdoor Power Outlets',
      };
    }

    return {
      categoryName: 'Luxury Bedroom / Private Study',
      flooring: 'Premium Laminated Wooden Tile Slabs (Large 24"×24" Format)',
      ceiling: '9.5 ft Concealed Light Cove Ceiling',
      wallFinish: 'Neutral Textured Wallpaper & Acoustic Paneling',
      orientation: 'East-Facing Window Bay',
      stagedItems: [
        '🛏️ Queen Ottoman Bed with Memory Foam Mattress',
        '🖥️ Integrated Ergonomic Study Desk & Bookshelf',
        '👗 4-Door Floor-to-Ceiling Sliding Wardrobe',
      ],
      automation: 'Smart Touch Light Switches & Occupancy Sensors',
      volumeCuFt: Math.round(room.areaSqft * 9.5),
      electricalPoints: '8 Dual USB Power Charging Stations',
    };
  };

  const getRoomThemeStyle = (room: FloorPlanRoom, isSelected: boolean) => {
    if (theme === 'blueprint') {
      return {
        backgroundColor: isSelected ? '#1D4ED8' : '#0B192C',
        borderColor: isSelected ? '#93C5FD' : '#3B82F6',
        boxShadow: viewMode !== '2d' ? `0 ${wallHeight * 3}px ${wallHeight * 6}px -4px rgba(15, 23, 42, 0.95), 0 0 0 2px rgba(147, 197, 253, 0.4) inset` : 'none',
        color: '#FFFFFF',
      };
    }
    if (theme === 'cyber') {
      return {
        backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.45)' : 'rgba(15, 23, 42, 0.95)',
        borderColor: isSelected ? '#38BDF8' : room.color,
        boxShadow: viewMode !== '2d' ? `0 0 35px ${room.color}CC, 0 ${wallHeight * 3}px ${wallHeight * 6}px -2px rgba(0,0,0,0.95)` : '0 0 15px rgba(6, 182, 212, 0.5)',
        color: '#F8FAFC',
      };
    }
    if (theme === 'marble') {
      return {
        backgroundColor: isSelected ? 'rgba(241, 245, 249, 0.55)' : 'rgba(30, 41, 59, 0.92)',
        borderColor: isSelected ? '#FFFFFF' : '#CBD5E1',
        boxShadow: viewMode !== '2d' ? `0 ${wallHeight * 3}px ${wallHeight * 6}px -3px rgba(0,0,0,0.9)` : 'none',
        color: '#F8FAFC',
      };
    }
    return {
      backgroundColor: isSelected ? `${room.color}88` : `${room.color}45`,
      borderColor: isSelected ? '#FFFFFF' : room.color,
      boxShadow: viewMode !== '2d' ? `0 ${wallHeight * 3}px ${wallHeight * 6}px -4px rgba(0,0,0,0.9)` : 'none',
      color: '#FFFFFF',
    };
  };

  const getFurnitureIcon = (type: string, id: string) => {
    if (id.startsWith('plot-')) return '🌳 Land Plot';
    if (type === 'master_bedroom') return '🛏️ Master Suite';
    if (type === 'bedroom') return '🛏️ Bedroom';
    if (type === 'living') return '🛋️ Living Lounge';
    if (type === 'kitchen') return '🍳 Gourmet Kitchen';
    if (type === 'bathroom') return '🛁 Bath Spa';
    if (type === 'balcony') return '🪴 View Deck';
    return '📦 Furnished';
  };

  const handleRotateOrbit = () => {
    const angles = [0, 45, 90, 180, 270];
    const nextIdx = (angles.indexOf(orbitAngle) + 1) % angles.length;
    setOrbitAngle(angles[nextIdx]);
  };

  const rooms = data?.rooms || [];
  const isPlotType = rooms.some((r) => r.id.startsWith('plot-'));

  const getStageLightingStyle = () => {
    if (lighting === 'sunset') return 'bg-gradient-to-br from-amber-950/70 via-slate-950 to-purple-950/60 border-amber-500/30';
    if (lighting === 'night') return 'bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 border-indigo-500/40';
    return 'bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 border-slate-800';
  };

  const activeDeepDetails = selectedRoom ? getDeepRoomDetails(selectedRoom) : null;

  return (
    <div
      className={`bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-8 bg-slate-950' : 'relative'
      }`}
    >
      {/* Top Header & AI Studio Mode Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> 3D Architectural Studio Active
            </span>
            <span className="text-xs text-slate-400 font-mono bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              Volumetric Depth Mesh: {data?.meshData?.pointCloudDensity?.toLocaleString() || '125,000'} pts
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Box className="w-7 h-7 text-blue-500" /> Interactive 3D Architectural Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Switch between 3D Isometric, 1st-Person Perspective walkthrough, and 2D CAD Blueprint. Click any room for deep interior specs.
          </p>
        </div>

        {/* Studio View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center shadow-inner">
            <button
              onClick={() => {
                setViewMode('3d');
                setPitchAngle(35);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                viewMode === '3d' ? 'bg-blue-600 text-white shadow-lg border border-blue-400/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> 3D Isometric
            </button>
            <button
              onClick={() => {
                setViewMode('walkthrough');
                setPitchAngle(55);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                viewMode === 'walkthrough' ? 'bg-purple-600 text-white shadow-lg border border-purple-400/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> 1st-Person Perspective
            </button>
            <button
              onClick={() => {
                setViewMode('2d');
                setPitchAngle(90);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                viewMode === '2d' ? 'bg-blue-600 text-white shadow-lg border border-blue-400/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> 2D Blueprint
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Horizontal Room Picker Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold text-[11px] shrink-0">Inspect Room Space:</span>
        {rooms.map((room) => {
          const isSelected = selectedRoom?.id === room.id;
          return (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <span>{getFurnitureIcon(room.type, room.id).split(' ')[0]}</span>
              <span>{room.name}</span>
              <span className="opacity-70 font-mono">({room.areaSqft} sqft)</span>
            </button>
          );
        })}
      </div>

      {/* Configuration Ribbon (Material Themes, Tile Format, Lighting, Orbit Angle) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
        {/* Material Texture Theme Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-blue-400" /> Texture Theme:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTheme('wood')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                theme === 'wood' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌳 Oak & Glass
            </button>
            <button
              onClick={() => setTheme('marble')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                theme === 'marble' ? 'bg-slate-200/20 text-slate-200 border border-slate-400/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Marble & Slate
            </button>
            <button
              onClick={() => setTheme('cyber')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                theme === 'cyber' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Cyber CAD
            </button>
            <button
              onClick={() => setTheme('blueprint')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                theme === 'blueprint' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 Navy Blueprint
            </button>
          </div>
        </div>

        {/* Sunlight & Time of Day Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-bold">Lighting:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLighting('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                lighting === 'day' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" /> Daylight
            </button>
            <button
              onClick={() => setLighting('sunset')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                lighting === 'sunset' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sunset className="w-4 h-4 text-purple-400" /> Sunset
            </button>
            <button
              onClick={() => setLighting('night')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                lighting === 'night' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" /> Night Glow
            </button>
          </div>
        </div>

        {/* Orbit Camera Rotation & Depth Heatmap */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRotateOrbit}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 transition-all font-bold text-xs flex items-center gap-2"
            title="Orbit 360 Camera Angle"
          >
            <RotateCw className="w-4 h-4" /> Orbit {orbitAngle}°
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3.5 py-2 rounded-xl font-bold border transition-all text-xs flex items-center gap-2 ${
              showHeatmap ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> LiDAR Mesh
          </button>
        </div>
      </div>

      {/* Main 3D Stage & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visualizer Canvas Stage (8 Cols - Enlarged 3D Isometric Viewport) */}
        <div
          className={`lg:col-span-8 rounded-3xl p-6 sm:p-8 border relative min-h-[640px] sm:min-h-[720px] flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-2xl ${getStageLightingStyle()}`}
        >
          {/* Top Status Bar & Compass Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 z-20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-200 font-bold">
                <Compass className="w-4 h-4 text-blue-400" /> Pitch: {pitchAngle}° | Orbit: {orbitAngle}°
              </span>
              <span className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-200 font-bold">
                <Zap className="w-4 h-4 text-emerald-400" /> Wall Elevation: {wallHeight}ft
              </span>
            </div>

            {/* Directional Compass Rose Widget */}
            <div className="w-12 h-12 rounded-full bg-slate-950/90 border border-slate-800 flex items-center justify-center relative shadow-xl text-xs font-mono font-black text-blue-400 z-20">
              <span className="absolute top-0.5 text-red-400">N</span>
              <span className="absolute right-1 text-slate-400">E</span>
              <span className="absolute bottom-0.5 text-slate-400">S</span>
              <span className="absolute left-1 text-slate-400">W</span>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full transition-transform duration-500"
                style={{ transform: `rotate(${orbitAngle}deg)` }}
              />
            </div>
          </div>

          {/* Interactive Canvas Rendering Stage (Enlarged Volumetric 3D Isometric Plane) */}
          <div className="my-8 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px] perspective-1200 overflow-visible">
            {showHeatmap && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-amber-500/20 to-emerald-500/30 rounded-3xl pointer-events-none border border-amber-500/40 backdrop-blur-[1px] flex items-end p-6 z-10">
                <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950/95 px-4 py-1.5 rounded-xl border border-amber-500/40 shadow-lg">
                  [LiDAR Stereo Depth Volumetric Mesh Grid Active]
                </span>
              </div>
            )}

            {/* Grid Floor Plan Model Map Container - Scaled & Enlarged */}
            <div
              className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl aspect-square relative transition-all duration-700 mx-auto"
              style={{
                transform:
                  viewMode === '2d'
                    ? 'rotateX(0deg) rotateZ(0deg) scale(1)'
                    : viewMode === 'walkthrough'
                    ? `rotateX(55deg) rotateZ(${orbitAngle}deg) scale(1.25)`
                    : `rotateX(${pitchAngle}deg) rotateZ(${orbitAngle}deg) scale(1.15)`,
              }}
            >
              <div
                className={`grid grid-cols-8 grid-rows-12 gap-4 sm:gap-5 w-full h-full p-6 sm:p-8 rounded-3xl border-2 shadow-2xl relative transition-all duration-500 ${
                  theme === 'blueprint'
                    ? 'bg-[#0B192C] border-blue-500/60'
                    : theme === 'cyber'
                    ? 'bg-slate-950 border-cyan-500/60 shadow-cyan-500/30'
                    : 'bg-slate-950/95 border-slate-800'
                }`}
              >
                {viewMode === 'walkthrough' && (
                  <div className="absolute top-4 right-4 bg-purple-600/90 text-white text-xs font-extrabold px-4 py-1.5 rounded-full z-30 shadow-xl border border-purple-400/40 flex items-center gap-2 animate-pulse">
                    👁️ 1st-Person Perspective Active (Eye Level: 5.6ft)
                  </div>
                )}

                {rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const roomStyle = getRoomThemeStyle(room, isSelected);

                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      style={{
                        gridColumnStart: room.x + 1,
                        gridColumnEnd: `span ${room.w}`,
                        gridRowStart: room.y + 1,
                        gridRowEnd: `span ${room.h}`,
                        ...roomStyle,
                      }}
                      className={`rounded-3xl border-3 sm:border-4 p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl flex flex-col justify-between relative group overflow-hidden min-h-[120px] sm:min-h-[140px] ${
                        isSelected ? 'ring-4 ring-blue-400 shadow-2xl scale-[1.03]' : ''
                      }`}
                    >
                      {/* Top Header: Room Name & Sqft - ENLARGED */}
                      <div className="flex items-center justify-between text-sm sm:text-base lg:text-lg font-black tracking-tight gap-2">
                        <span className="truncate drop-shadow-lg text-white">{room.name}</span>
                        <span className="text-xs sm:text-sm font-black font-mono bg-slate-950/90 text-blue-300 px-2.5 py-1 rounded-xl border border-slate-700/90 shadow-md shrink-0">
                          {room.areaSqft} sqft
                        </span>
                      </div>

                      {/* Middle Specs & Furniture Badge - ENLARGED */}
                      <div className="flex items-center justify-between text-xs sm:text-sm font-mono mt-2 gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-100 drop-shadow bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                          {room.widthFt}′ × {room.lengthFt}′
                        </span>
                        <span className="bg-slate-950/95 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/40 text-xs sm:text-sm font-sans font-black shadow-md flex items-center gap-1.5">
                          {getFurnitureIcon(room.type, room.id)}
                        </span>
                      </div>

                      {/* Doors & Windows markers - ENLARGED */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {room.doors?.map((d, di) => (
                          <span
                            key={di}
                            className="text-xs font-bold bg-slate-950/95 px-2.5 py-1 rounded-xl text-blue-300 border border-blue-500/50 font-mono shadow-sm flex items-center gap-1"
                          >
                            🚪 {d.wall.toUpperCase()} ({d.offset}%)
                          </span>
                        ))}
                        {room.windows?.map((w, wi) => (
                          <span
                            key={wi}
                            className="text-xs font-bold bg-slate-950/95 px-2.5 py-1 rounded-xl text-amber-300 border border-amber-500/50 font-mono shadow-sm flex items-center gap-1"
                          >
                            🪟 {w.wall.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 text-xs z-20">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold">Wall Elevation:</span>
              <input
                type="range"
                min="8"
                max="14"
                step="0.5"
                value={wallHeight}
                onChange={(e) => setWallHeight(parseFloat(e.target.value))}
                className="accent-blue-500 cursor-pointer w-28"
              />
              <span className="font-mono text-blue-400 font-bold">{wallHeight} ft</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold">Pitch Angle:</span>
              <input
                type="range"
                min="15"
                max="90"
                step="15"
                value={pitchAngle}
                onChange={(e) => setPitchAngle(parseInt(e.target.value))}
                className="accent-purple-500 cursor-pointer w-28"
              />
              <span className="font-mono text-purple-400 font-bold">{pitchAngle}°</span>
            </div>
          </div>
        </div>

        {/* Ultra-Detailed Deep Room Inspector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedRoom && activeDeepDetails ? (
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-blue-400 uppercase">
                    Deep Room Space Inspection
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedRoom.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">{activeDeepDetails.categoryName}</span>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/60 shadow-lg shrink-0"
                  style={{ backgroundColor: selectedRoom.color }}
                />
              </div>

              {/* Dimension Metrics Bar */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Floor Area</span>
                  <span className="text-base font-extrabold text-white">{selectedRoom.areaSqft} sqft</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Volume</span>
                  <span className="text-base font-extrabold text-blue-400">{activeDeepDetails.volumeCuFt.toLocaleString()} cu.ft</span>
                </div>
              </div>

              {/* Architectural Specs List */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wider">
                  Architectural & Structural Finishes
                </span>

                <div className="space-y-1.5 text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Flooring Material</span>
                    <span className="font-semibold text-white">{activeDeepDetails.flooring}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Ceiling Elevation & Lighting</span>
                    <span className="font-semibold text-white">{activeDeepDetails.ceiling}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Wall Finish & Glazing</span>
                    <span className="font-semibold text-white">{activeDeepDetails.wallFinish}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">Sunlight & Orientation</span>
                    <span className="font-semibold text-amber-300">{activeDeepDetails.orientation}</span>
                  </div>
                </div>
              </div>

              {/* Staged Furniture Items List */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wider">
                  Staged Furniture & Interior Items
                </span>
                <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {activeDeepDetails.stagedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs py-0.5">
                      <span>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Open Deep Inspection Modal or Switch to 1st Person Walkthrough */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDeepInspectModalOpen(true)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Full Inspection
                </button>
                <button
                  onClick={() => {
                    setViewMode('walkthrough');
                    setPitchAngle(55);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" /> Walk Mode
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 text-center text-slate-400 text-sm">
              Click any room in the 3D model above to inspect detailed dimensions, interior finishes, and staged furniture.
            </div>
          )}
        </div>
      </div>

      {/* Deep Room Inspection Modal */}
      {deepInspectModalOpen && selectedRoom && activeDeepDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl border-2 border-white/60 shadow-lg shrink-0 flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: selectedRoom.color }}
                >
                  3D
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">{selectedRoom.name}</h3>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    {activeDeepDetails.categoryName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDeepInspectModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Floor Area</span>
                <span className="text-xl font-black text-white mt-1 block">{selectedRoom.areaSqft} sqft</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Dimensions</span>
                <span className="text-xl font-black text-purple-400 mt-1 block">
                  {selectedRoom.widthFt}′ × {selectedRoom.lengthFt}′
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold block">Spatial Volume</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  {activeDeepDetails.volumeCuFt.toLocaleString()} cu.ft
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] block">
                  Architectural Specifications & Material Finishes
                </span>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <strong className="text-slate-400 block text-[10px]">Flooring:</strong>
                    <span>{activeDeepDetails.flooring}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block text-[10px]">Ceiling Elevation:</strong>
                    <span>{activeDeepDetails.ceiling}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block text-[10px]">Wall Finish:</strong>
                    <span>{activeDeepDetails.wallFinish}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block text-[10px]">Sunlight Orientation:</strong>
                    <span className="text-amber-300">{activeDeepDetails.orientation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] block">
                  Staged Furniture & Appliance Layout
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-slate-200">
                  {activeDeepDetails.stagedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                <span><strong>Automation:</strong> {activeDeepDetails.automation}</span>
                <span className="font-mono text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-200">
                  {activeDeepDetails.electricalPoints}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setDeepInspectModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Close Inspection
              </button>
              <button
                onClick={() => {
                  setDeepInspectModalOpen(false);
                  setViewMode('walkthrough');
                  setPitchAngle(55);
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-purple-400/30 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" /> Enter 1st-Person Walk Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Upload,
  Type,
  Palette,
  Sparkles,
  ShoppingBag,
  Eye,
  Sliders,
  Maximize2,
  Trash2,
  Check,
  Move,
  Layers
} from 'lucide-react';

export const StudioStudio = ({ initialProduct, initialColor, initialHex, onSwitchToTryOn }) => {
  const { addToCart } = useCart();

  // Garment States
  const [selectedColor, setSelectedColor] = useState(initialColor || 'Jet Black');
  const [selectedHex, setSelectedHex] = useState(initialHex || '#111111');
  const [collarHex, setCollarHex] = useState(initialHex || '#111111');
  const [viewSide, setViewSide] = useState('front'); // 'front' | 'back'
  const [selectedSize, setSelectedSize] = useState('L');

  // Artwork & Print States
  const [artworkImage, setArtworkImage] = useState(null);
  const [artworkScale, setArtworkScale] = useState(1);
  const [artworkX, setArtworkX] = useState(0); // -100 to 100
  const [artworkY, setArtworkY] = useState(0); // -100 to 100
  const [artworkRotate, setArtworkRotate] = useState(0); // -180 to 180

  // Text Tool States
  const [customText, setCustomText] = useState('');
  const [textFont, setTextFont] = useState('sans-bold');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textY, setTextY] = useState(60);

  // 3D Canvas Orbit Simulator States
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360
  const [zoomLevel, setZoomLevel] = useState(1); // 0.8 to 1.4
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Active Tool Panel Tab
  const [activeTab, setActiveTab] = useState('artwork'); // 'artwork' | 'color' | 'text' | 'presets'
  const [addedSuccess, setAddedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const colorPalette = [
    { name: 'Jet Black', hex: '#111111' },
    { name: 'Optical White', hex: '#FFFFFF' },
    { name: 'Heather Grey', hex: '#9E9E9E' },
    { name: 'Navy Blue', hex: '#1B2A4A' },
    { name: 'Forest Green', hex: '#2D5A27' },
    { name: 'Crimson Red', hex: '#991B1B' }
  ];

  const presets = [
    {
      id: 'dhango-crest',
      title: 'Dhango Nepal Crest',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="%23E63946"/><text x="100" y="95" text-anchor="middle" fill="%23FFFFFF" font-size="28" font-weight="900" font-family="sans-serif">DHG</text><text x="100" y="130" text-anchor="middle" fill="%23E0A96D" font-size="16" font-weight="bold" font-family="sans-serif">NEPAL</text></svg>`
    },
    {
      id: 'nepali-calligraphy',
      title: 'नमस्ते (Namaste)',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100" viewBox="0 0 240 100"><text x="120" y="70" text-anchor="middle" fill="%23E0A96D" font-size="48" font-weight="bold" font-family="sans-serif">नमस्ते</text></svg>`
    },
    {
      id: 'buddha-eyes',
      title: 'Kathmandu Stupa Eyes',
      svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100" viewBox="0 0 240 100"><path d="M40 50 Q70 20 100 50 Q70 60 40 50 Z" fill="none" stroke="%23FFFFFF" stroke-width="4"/><circle cx="70" cy="46" r="8" fill="%23FFFFFF"/><path d="M140 50 Q170 20 200 50 Q170 60 140 50 Z" fill="none" stroke="%23FFFFFF" stroke-width="4"/><circle cx="170" cy="46" r="8" fill="%23FFFFFF"/><path d="M120 45 Q115 70 120 85" fill="none" stroke="%23E63946" stroke-width="5"/></svg>`
    }
  ];

  // Handle artwork image upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setArtworkImage(event.target.result);
        setArtworkScale(1);
        setArtworkX(0);
        setArtworkY(0);
        setArtworkRotate(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // 360 Drag Orbit Controls
  const handleMouseDown = (e) => {
    setIsDraggingCanvas(true);
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingCanvas) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = clientX - dragStartX;
    setRotationAngle((prev) => (prev + deltaX * 0.6) % 360);
    setDragStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  // Add customized apparel to Cart
  const handleAddToCart = () => {
    addToCart({
      productId: initialProduct?.id || 'dhango-custom-tee',
      title: `Custom 3D Printed T-Shirt (${viewSide === 'front' ? 'Front Print' : 'Back Print'})`,
      color: selectedColor,
      colorHex: selectedHex,
      size: selectedSize,
      unitPrice: 1500, // Rs. 1,500
      originalPrice: 2000,
      artworkUrl: artworkImage || '',
      customText: customText ? { text: customText, font: textFont, color: textColor } : null,
      printPlacement: {
        zone: viewSide,
        scale: artworkScale,
        offsetX: artworkX,
        offsetY: artworkY
      }
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Studio Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <span>DHANGO STUDIO</span>
            <span>/</span>
            <span className="text-[#E63946] font-bold">3D WEBGL CUSTOMIZER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Design Your Custom Garment
          </h2>
        </div>

        {/* Pricing tag & Virtual Try-on Switch */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-[#12151C] border border-white/10 rounded-xl flex items-center gap-2 shadow">
            <span className="text-xs text-gray-400 font-mono">Special Price:</span>
            <span className="text-base font-extrabold font-display text-white">Rs. 1,500</span>
            <span className="text-xs text-gray-500 line-through">Rs. 2,000</span>
          </div>

          <button
            onClick={() => onSwitchToTryOn({ artwork: artworkImage, color: selectedColor, hex: selectedHex })}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl text-xs font-semibold transition btn-tactile"
          >
            <Eye className="w-4 h-4 text-[#E0A96D]" />
            <span>Virtual Try-On</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 3D Interactive Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1117] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between min-h-[520px] sm:min-h-[620px] relative overflow-hidden shadow-2xl select-none">
          
          {/* Top Viewport Controls */}
          <div className="w-full flex items-center justify-between z-20">
            {/* View Side Toggle */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewSide('front')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewSide === 'front' ? 'bg-[#E63946] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setViewSide('back')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewSide === 'back' ? 'bg-[#E63946] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Back View
              </button>
            </div>

            {/* Orbit & Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.35, z + 0.1))}
                className="p-2 bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 rounded-xl transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
                className="p-2 bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 rounded-xl transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setRotationAngle(0);
                  setZoomLevel(1);
                  setArtworkScale(1);
                  setArtworkX(0);
                  setArtworkY(0);
                  setArtworkRotate(0);
                }}
                className="p-2 bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 rounded-xl transition"
                title="Reset Camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Garment Viewport with 360° Drag Orbit Simulator */}
          <div
            className="relative w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing py-8"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {/* 360 Perspective Transform Container */}
            <div
              style={{
                transform: `scale(${zoomLevel}) rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
                transition: isDraggingCanvas ? 'none' : 'transform 0.15s ease-out'
              }}
              className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center"
            >
              
              {/* T-Shirt SVG Garment Geometry */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_30px_45px_rgba(0,0,0,0.7)] pointer-events-none">
                {/* Body Mesh */}
                <path
                  d="M 50 40 L 75 40 C 80 50 120 50 125 40 L 150 40 L 180 75 L 155 95 L 145 80 L 145 170 C 145 175 140 180 135 180 L 65 180 C 60 180 55 175 55 170 L 55 80 L 45 95 L 20 75 Z"
                  fill={selectedHex}
                  stroke="#2B303C"
                  strokeWidth="2.5"
                />

                {/* Collar Ribbing Mesh */}
                <path
                  d={viewSide === 'front' ? "M 75 40 C 85 55 115 55 125 40" : "M 75 40 C 85 45 115 45 125 40"}
                  fill="none"
                  stroke={collarHex === '#FFFFFF' ? '#CCCCCC' : collarHex}
                  strokeWidth="3.5"
                />

                {/* Seams & Folds Realism */}
                <path d="M 65 178 L 135 178" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                <path d="M 148 78 L 175 73" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                <path d="M 52 78 L 25 73" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              </svg>

              {/* Dynamic Printable Zone (Projected UV Texture) */}
              <div
                className="absolute w-[44%] h-[48%] top-[28%] flex items-center justify-center overflow-hidden pointer-events-none"
                style={{
                  border: '1px dashed rgba(255, 255, 255, 0.25)',
                  borderRadius: '4px'
                }}
              >
                {/* Rendered Uploaded Artwork */}
                {artworkImage ? (
                  <img
                    src={artworkImage}
                    alt="Custom Print"
                    style={{
                      transform: `translate(${artworkX}px, ${artworkY}px) scale(${artworkScale}) rotate(${artworkRotate}deg)`,
                      maxWidth: '85%',
                      maxHeight: '85%',
                      objectFit: 'contain'
                    }}
                    className="drop-shadow-md select-none transition-transform duration-75"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center opacity-40">
                    <Sparkles className="w-6 h-6 text-[#E63946] mb-1" />
                    <span className="text-[10px] text-gray-300 font-mono">Print Zone</span>
                  </div>
                )}

                {/* Custom Text Overlay */}
                {customText && (
                  <div
                    style={{
                      transform: `translateY(${textY - 50}px)`,
                      color: textColor
                    }}
                    className={`absolute text-center font-bold text-sm tracking-wider drop-shadow-md select-none ${
                      textFont === 'streetwear' ? 'font-mono uppercase text-base' :
                      textFont === 'gothic' ? 'font-serif tracking-widest' :
                      'font-sans'
                    }`}
                  >
                    {customText}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Viewport Bottom Hint */}
          <div className="w-full flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4 z-20">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Move className="w-3.5 h-3.5 text-[#E63946]" />
              Drag viewport to rotate in 360°
            </span>
            <span className="font-mono text-[11px] text-[#E0A96D]">
              Angle: {Math.round(rotationAngle)}°
            </span>
          </div>

        </div>

        {/* Right Column: Customization Controls Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#12151C] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Tool Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 border border-white/10 rounded-2xl">
            {[
              { id: 'artwork', label: 'Graphic', icon: Upload },
              { id: 'color', label: 'Color', icon: Palette },
              { id: 'text', label: 'Typography', icon: Type },
              { id: 'presets', label: 'Presets', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-semibold transition btn-tactile ${
                    activeTab === tab.id
                      ? 'bg-[#E63946] text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Artwork Upload & Adjustment */}
          {activeTab === 'artwork' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                  Upload Custom Design (PNG, JPG, SVG)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-[#E63946]/60 rounded-2xl p-6 text-center cursor-pointer bg-white/5 hover:bg-white/10 transition group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-[#E63946] group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">Click or drag file here</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Max 10MB · Transparent PNG recommended</p>
                </div>
              </div>

              {artworkImage && (
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase font-mono">Transform Controls</span>
                    <button
                      onClick={() => setArtworkImage(null)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  {/* Scale Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Scale / Size</span>
                      <span className="font-mono text-white">{Math.round(artworkScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="1.8"
                      step="0.05"
                      value={artworkScale}
                      onChange={(e) => setArtworkScale(parseFloat(e.target.value))}
                      className="w-full accent-[#E63946]"
                    />
                  </div>

                  {/* Position Y Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Vertical Placement (Y)</span>
                      <span className="font-mono text-white">{artworkY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={artworkY}
                      onChange={(e) => setArtworkY(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E63946]"
                    />
                  </div>

                  {/* Rotation Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Rotation</span>
                      <span className="font-mono text-white">{artworkRotate}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={artworkRotate}
                      onChange={(e) => setArtworkRotate(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E63946]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Garment Color Customizer */}
          {activeTab === 'color' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                  T-Shirt Fabric Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorPalette.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        setSelectedHex(col.hex);
                        setCollarHex(col.hex);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                        selectedColor === col.name
                          ? 'border-[#E63946] bg-white/10 text-white'
                          : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                      <span className="truncate">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Picker */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Custom Color Hex</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedHex}
                    onChange={(e) => {
                      setSelectedHex(e.target.value);
                      setSelectedColor('Custom');
                    }}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedHex}
                    onChange={(e) => setSelectedHex(e.target.value)}
                    className="flex-1 py-2 px-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Typography Tool */}
          {activeTab === 'text' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1.5">
                  Custom Text Line
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. KATHMANDU 2026"
                  className="w-full py-2.5 px-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:border-[#E63946] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sans-bold', label: 'Bold Modern' },
                  { id: 'streetwear', label: 'Streetwear' },
                  { id: 'gothic', label: 'Calligraphic' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTextFont(f.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                      textFont === f.id
                        ? 'bg-[#E63946] text-white border-[#E63946]'
                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Text Color Chips */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Text Color</label>
                <div className="flex items-center gap-2">
                  {['#FFFFFF', '#111111', '#E63946', '#E0A96D', '#3B82F6', '#10B981'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTextColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        textColor === c ? 'border-[#E63946] scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Presets Library */}
          {activeTab === 'presets' && (
            <div className="space-y-3 animate-fadeIn">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                Nepali Cultural & Streetwear Graphics
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {presets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setArtworkImage(p.svg);
                      setArtworkScale(1);
                      setArtworkX(0);
                      setArtworkY(0);
                    }}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#E63946]/50 rounded-2xl flex items-center gap-3 cursor-pointer transition group"
                  >
                    <img src={p.svg} alt={p.title} className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#E63946] transition">{p.title}</p>
                      <p className="text-[10px] text-gray-400">Click to apply to t-shirt</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Garment Size
            </label>
            <div className="grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    selectedSize === sz
                      ? 'bg-white text-gray-900 border-white shadow'
                      : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition btn-tactile shadow-2xl ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E63946] hover:bg-[#d42c39] text-white shadow-[#E63946]/30'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add Custom T-Shirt to Cart (Rs. 1,500)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2 font-mono">
              Save Rs. 500 · Cash/QR Payment on Verification
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

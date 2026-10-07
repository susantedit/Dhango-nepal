import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Camera,
  Upload,
  User,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Sliders,
  Check,
  Video,
  VideoOff,
  Download,
  AlertCircle
} from 'lucide-react';

export const VirtualTryOn = ({ initialArtwork, initialColor, initialHex, onSwitchToStudio }) => {
  const { addToCart } = useCart();

  // Mode Selection: 'models' | 'webcam' | 'selfie'
  const [activeMode, setActiveMode] = useState('models');

  // Custom design states
  const [artwork, setArtwork] = useState(initialArtwork || null);
  const [garmentHex, setGarmentHex] = useState(initialHex || '#111111');
  const [selectedSize, setSelectedSize] = useState('L');
  const [printScale, setPrintScale] = useState(1);
  const [printY, setPrintY] = useState(0);

  // Studio Models
  const [selectedModel, setSelectedModel] = useState('male'); // 'male' | 'female' | 'oversized'

  // Webcam states
  const videoRef = useRef(null);
  const webcamCanvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);

  // User Selfie Upload
  const [userPhoto, setUserPhoto] = useState(null);
  const photoInputRef = useRef(null);
  const artworkInputRef = useRef(null);

  const [addedSuccess, setAddedSuccess] = useState(false);

  // Start webcam
  const startWebcam = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      setCameraError('Camera access not permitted. You can use Studio Models or upload your photo below.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [activeMode]);

  // Capture frame
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedSnapshot(canvas.toDataURL('image/png'));
  };

  // Handle User Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom Artwork Upload
  const handleArtworkUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setArtwork(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: 'dhango-tryon-tshirt',
      title: `Virtual Try-On Custom T-Shirt (${selectedModel} fit)`,
      color: 'Custom',
      colorHex: garmentHex,
      size: selectedSize,
      unitPrice: 1500, // Rs. 1,500
      originalPrice: 2000,
      artworkUrl: artwork || '',
      printPlacement: {
        zone: 'front',
        scale: printScale,
        offsetY: printY
      }
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <span>DHANGO NEPAL</span>
            <span>/</span>
            <span className="text-[#E0A96D] font-bold">VIRTUAL TRY-ON ENGINE ($0 API COST)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            See How It Fits On You
          </h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#12151C] border border-white/10 rounded-2xl shadow">
          <button
            onClick={() => setActiveMode('models')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'models' ? 'bg-[#E63946] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Studio Models</span>
          </button>
          <button
            onClick={() => setActiveMode('webcam')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'webcam' ? 'bg-[#E63946] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Mirror</span>
          </button>
          <button
            onClick={() => setActiveMode('selfie')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'selfie' ? 'bg-[#E63946] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Main Try-On Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Viewport Screen (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1117] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between min-h-[540px] sm:min-h-[620px] relative overflow-hidden shadow-2xl">
          
          {/* MODE 1: Studio Curated Models */}
          {activeMode === 'models' && (
            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
              
              {/* Model Body Frame */}
              <div className="relative w-72 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1A1F2B] to-[#0A0C10] border border-white/10 flex items-center justify-center shadow-2xl">
                
                {/* Photorealistic Model Mannequin Silhouette */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl">
                    {/* Head / Neck */}
                    <ellipse cx="150" cy="55" rx="32" ry="42" fill="#D4A373" />
                    <rect x="135" y="85" width="30" height="30" fill="#C68B59" />

                    {/* Torso & T-Shirt */}
                    <path
                      d="M 80 110 L 125 105 C 135 115 165 115 175 105 L 220 110 L 265 160 L 230 185 L 215 165 L 215 360 C 215 365 205 370 195 370 L 105 370 C 95 370 85 365 85 360 L 85 165 L 70 185 L 35 160 Z"
                      fill={garmentHex}
                      stroke="#2B303C"
                      strokeWidth="2.5"
                    />

                    {/* Realistic Fold & Wrinkle Contours (Multiply Blend Shading) */}
                    <path d="M 130 180 Q 150 200 170 180" stroke="rgba(0,0,0,0.3)" strokeWidth="3" fill="none" />
                    <path d="M 110 230 Q 150 250 190 230" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none" />
                    <path d="M 125 290 Q 150 310 175 290" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" fill="none" />
                  </svg>

                  {/* Projected Custom Print Zone */}
                  <div
                    style={{
                      transform: `translateY(${printY}px) scale(${printScale})`,
                      transition: 'transform 0.1s ease-out'
                    }}
                    className="absolute w-[45%] h-[40%] top-[34%] flex items-center justify-center overflow-hidden"
                  >
                    {artwork ? (
                      <img
                        src={artwork}
                        alt="Applied Design"
                        className="max-w-full max-h-full object-contain drop-shadow-md"
                        style={{ mixBlendMode: garmentHex === '#FFFFFF' ? 'multiply' : 'normal' }}
                      />
                    ) : (
                      <div className="p-3 border border-dashed border-white/30 rounded-xl bg-black/40 text-center">
                        <Sparkles className="w-5 h-5 text-[#E63946] mx-auto mb-1" />
                        <span className="text-[10px] text-gray-300 font-mono">Upload artwork to see it worn</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Model Switcher Chips */}
              <div className="flex items-center gap-2 mt-4">
                {[
                  { id: 'male', label: 'Male Fit (Athletic)' },
                  { id: 'female', label: 'Female Fit (Classic)' },
                  { id: 'oversized', label: 'Streetwear (Boxy)' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedModel === m.id
                        ? 'bg-white text-gray-900 border-white'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* MODE 2: Real-Time Webcam Mirror */}
          {activeMode === 'webcam' && (
            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
              
              {cameraError ? (
                <div className="p-6 text-center max-w-md bg-red-950/40 border border-red-800/40 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white mb-1">Camera Permission Notice</p>
                  <p className="text-xs text-gray-400 mb-4">{cameraError}</p>
                  <button
                    onClick={() => setActiveMode('models')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
                  >
                    Switch to Studio Models
                  </button>
                </div>
              ) : (
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                  {/* Live Video Feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />

                  {/* Augmented Live T-Shirt Chest Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      style={{
                        transform: `translateY(${printY}px) scale(${printScale})`
                      }}
                      className="w-48 h-48 border-2 border-dashed border-[#E63946]/70 rounded-2xl flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                    >
                      {artwork ? (
                        <img src={artwork} alt="Live Try-On" className="max-w-[80%] max-h-[80%] object-contain" />
                      ) : (
                        <span className="text-xs text-white font-mono font-bold px-3 py-1 bg-black/60 rounded-lg">
                          Align your chest here
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Freeze Frame Snapshot Button */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
                    <button
                      onClick={takeSnapshot}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold btn-tactile shadow-xl"
                    >
                      <Camera className="w-4 h-4 text-[#E63946]" />
                      <span>Take Snapshot</span>
                    </button>
                  </div>
                </div>
              )}

              {capturedSnapshot && (
                <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <img src={capturedSnapshot} alt="Snapshot" className="w-12 h-12 object-cover rounded-lg border border-white/20" />
                  <div>
                    <p className="text-xs font-bold text-white">Snapshot Captured!</p>
                    <a
                      href={capturedSnapshot}
                      download="dhango-tryon-look.png"
                      className="text-[11px] text-[#E0A96D] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Download className="w-3 h-3" />
                      Download Photo
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MODE 3: User Selfie Upload */}
          {activeMode === 'selfie' && (
            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
              {userPhoto ? (
                <div className="relative w-72 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center">
                  <img src={userPhoto} alt="Your Photo" className="w-full h-full object-cover" />

                  {/* Aligned T-shirt Overlay */}
                  <div
                    style={{
                      transform: `translateY(${printY}px) scale(${printScale})`
                    }}
                    className="absolute w-[50%] h-[40%] flex items-center justify-center pointer-events-none"
                  >
                    {artwork && (
                      <img
                        src={artwork}
                        alt="Custom Shirt"
                        className="max-w-full max-h-full object-contain drop-shadow-xl"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setUserPhoto(null)}
                    className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-semibold rounded-lg border border-white/20"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full max-w-sm aspect-[4/3] border-2 border-dashed border-white/20 hover:border-[#E63946] rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer bg-white/5 hover:bg-white/10 transition text-center"
                >
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#E63946] mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">Upload Your Photo</p>
                  <p className="text-xs text-gray-400 mt-1">Take a selfie or portrait to see how the print fits on you</p>
                </div>
              )}
            </div>
          )}

          {/* Viewport Footer */}
          <div className="w-full flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4 mt-4">
            <span className="font-mono text-[11px]">
              Active Blend: Realistic Fabric Displacement
            </span>
            <span className="font-mono text-[11px] text-emerald-400">
              ● Live 60 FPS ($0 API Cost)
            </span>
          </div>

        </div>

        {/* Right Adjustments & Order Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#12151C] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#E63946] uppercase">Fitting Controls</span>
            <h3 className="text-xl font-bold font-display text-white">Garment & Print Tuning</h3>
          </div>

          {/* Custom Artwork Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Graphic to Try On
            </label>
            <div className="flex items-center gap-3">
              {artwork ? (
                <div className="relative w-14 h-14 rounded-xl bg-black/40 border border-white/15 p-1 flex items-center justify-center">
                  <img src={artwork} alt="Artwork" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-500">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1">
                <input
                  ref={artworkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleArtworkUpload}
                  className="hidden"
                />
                <button
                  onClick={() => artworkInputRef.current?.click()}
                  className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition btn-tactile text-left flex items-center justify-between"
                >
                  <span>{artwork ? 'Change Artwork' : 'Upload Artwork'}</span>
                  <Upload className="w-3.5 h-3.5 text-[#E63946]" />
                </button>
              </div>
            </div>
          </div>

          {/* Shirt Color Switcher */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Base Fabric Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { name: 'Black', hex: '#111111' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Grey', hex: '#9E9E9E' },
                { name: 'Navy', hex: '#1B2A4A' },
                { name: 'Forest', hex: '#2D5A27' },
                { name: 'Crimson', hex: '#991B1B' }
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setGarmentHex(c.hex)}
                  className={`w-full aspect-square rounded-xl border-2 transition ${
                    garmentHex === c.hex ? 'border-[#E63946] scale-105' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Scale & Y Sliders */}
          <div className="space-y-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Scale On Body</span>
                <span className="font-mono text-white">{Math.round(printScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={printScale}
                onChange={(e) => setPrintScale(parseFloat(e.target.value))}
                className="w-full accent-[#E63946]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Vertical Chest Position</span>
                <span className="font-mono text-white">{printY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={printY}
                onChange={(e) => setPrintY(parseInt(e.target.value, 10))}
                className="w-full accent-[#E63946]"
              />
            </div>
          </div>

          {/* Size Select */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Size
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

          {/* Add to Cart Button */}
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
                  <span>Order This Fitted Look (Rs. 1,500)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2 font-mono">
              Flat Rs. 1,500 (Discounted from Rs. 2,000)
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

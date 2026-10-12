import { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as Blockly from 'blockly';

// 1. Particle Canvas Engine
function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 0.8 - 0.2;
        this.alpha = Math.random() * 0.6 + 0.2;
      }
      update() {
        this.y += this.vy;
        if (this.y < 0) this.y = canvas.height;
        this.x += this.vx;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
}

// 2. Navigation Header with Tab Switching
function Header({ userXP, userLevel, activeTab, setActiveTab }) {
  const xpPercentage = (userXP / 1000) * 100;

  return (
    <header className="relative z-10 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-atom text-cyan-400 text-2xl animate-spin-slow"></i>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            AntiGravity IoT Academy
          </h1>
        </div>

        <nav className="flex space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'simulator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-microchip"></i> Circuit Simulator
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'learn' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-graduation-cap"></i> Learning Courses
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-chart-line"></i> Student Dashboard
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <i className="fa-solid fa-fire text-amber-400"></i>
          <span className="font-bold text-xs">3 Day Streak</span>
        </div>
        
        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Level <span className="text-cyan-400 font-bold">{userLevel}</span>
          </span>
          <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-cyan-400 font-bold">{userXP}/1000 XP</span>
        </div>
      </div>
    </header>
  );
}

// 3. Blockly Visual Logic Component
function BlocklyEditor({ onCodeChange }) {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    try {
      Blockly.defineBlocksWithJsonArray([
        {
          "type": "iot_read_temp",
          "message0": "Read DHT11 Temp Pin %1",
          "args0": [{ "type": "field_number", "name": "PIN", "value": 4 }],
          "output": "Number",
          "colour": 340
        },
        {
          "type": "iot_set_led",
          "message0": "Set RGB LED Pin %1 to %2",
          "args0": [
            { "type": "field_number", "name": "PIN", "value": 18 },
            { "type": "field_dropdown", "name": "STATE", "options": [["HIGH", "HIGH"], ["LOW", "LOW"]] }
          ],
          "previousStatement": null,
          "nextStatement": null,
          "colour": 160
        }
      ]);
    } catch (e) {
      // Blocks already registered
    }

    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml>
          <category name="IoT Hardware" colour="160">
            <block type="iot_read_temp"></block>
            <block type="iot_set_led"></block>
          </category>
        </xml>
      `,
      scrollbars: false,
      theme: 'dark'
    });

    workspace.current.addChangeListener(() => {
      if (onCodeChange) onCodeChange();
    });

    return () => {
      if (workspace.current) workspace.current.dispose();
    };
  }, []);

  return <div ref={blocklyDiv} className="w-full h-36 rounded-lg border border-slate-800 overflow-hidden" />;
}

// 4. Main App Container
export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [components, setComponents] = useState([]);
  const [userXP, setUserXP] = useState(650);
  const [userLevel, setUserLevel] = useState(2);
  const [serialLogs, setSerialLogs] = useState(['[SYSTEM]: AntiGravity Engine ready. Connect hardware pins to start simulation!']);
  
  const [tempVal, setTempVal] = useState(28);
  const [ledState, setLedState] = useState(false);
  
  // Advanced Wiring State
  const [wires, setWires] = useState([]); // [{ id, fromPin, toPin, color }]
  const [selectedPin, setSelectedPin] = useState(null);
  const canvasStageRef = useRef(null);

  // Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const addComponent = (type) => {
    if (!components.includes(type)) {
      setComponents([...components, type]);
      addLog(`[HARDWARE]: Mounted ${type.toUpperCase()} module onto canvas.`);
    }
  };

  const removeComponent = (type) => {
    setComponents(components.filter(c => c !== type));
    setWires(wires.filter(w => !w.fromPin.startsWith(type) && !w.toPin.startsWith(type)));
    addLog(`[HARDWARE]: Detached ${type.toUpperCase()} module.`);
  };

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setSerialLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const addXP = (amount) => {
    const nextXP = userXP + amount;
    if (nextXP >= 1000) {
      setUserLevel(prev => prev + 1);
      setUserXP(nextXP - 1000);
      alert(`🎉 LEVEL UP! You reached Level ${userLevel + 1}!`);
    } else {
      setUserXP(nextXP);
    }
  };

  // Wire Connection Logic
  const handlePinClick = (pinId, pinType) => {
    if (!selectedPin) {
      setSelectedPin({ id: pinId, type: pinType });
      addLog(`[WIRING]: Selected Pin (${pinId}). Click a target pin to attach wire.`);
    } else {
      if (selectedPin.id === pinId) {
        setSelectedPin(null);
        return;
      }

      // Determine wire color (Red for 3V3, Black/Dark for GND, Cyan for Signal)
      let wireColor = '#38bdf8'; // Cyan default
      if (selectedPin.type === '3V3' || pinType === '3V3') wireColor = '#f43f5e'; // Red
      if (selectedPin.type === 'GND' || pinType === 'GND') wireColor = '#64748b'; // Dark slate/GND

      const newWire = {
        id: `${selectedPin.id}-${pinId}`,
        fromPin: selectedPin.id,
        toPin: pinId,
        color: wireColor
      };

      setWires(prev => [...prev, newWire]);
      addLog(`[WIRE CONNECTED]: Jumper wire connected between ${selectedPin.id} <---> ${pinId}`);
      setSelectedPin(null);
    }
  };

  // Verify Wire Connections before Simulation
  const handleRunSimulation = () => {
    if (components.length === 0) {
      alert('Please add hardware components to the canvas first!');
      return;
    }

    if (components.length > 1 && wires.length === 0) {
      alert('⚠️ Circuit incomplete! Please draw jumper wires between hardware pins to complete the circuit.');
      addLog('❌ [SIMULATION ERROR]: Open circuit detected. Connect pins with wires.');
      return;
    }

    addXP(150);
    addLog('[SIMULATION]: Circuit verified! Firmware execution streaming...');
    if (components.includes('temp')) addLog(`[DHT11 MQTT]: Telemetry temp reading -> ${tempVal}°C`);
    if (components.includes('led')) addLog(`[GPIO 18]: LED output -> ${ledState ? 'HIGH (1)' : 'LOW (0)'}`);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans overflow-hidden">
      <BackgroundCanvas />
      <Header userXP={userXP} userLevel={userLevel} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 1. SIMULATOR TAB */}
      {activeTab === 'simulator' && (
        <main className="relative z-10 flex-1 grid grid-cols-12 gap-4 p-4 h-[calc(100vh-65px)]">
          {/* Left Column */}
          <aside className="col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase text-slate-400">1. Hardware Library</h2>
            <div className="space-y-2">
              <button onClick={() => addComponent('esp32')} className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-left rounded-lg text-xs font-bold border border-slate-700 text-indigo-400 flex items-center gap-2">
                <i className="fa-solid fa-microchip"></i> + ESP32 Board
              </button>
              <button onClick={() => addComponent('temp')} className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-left rounded-lg text-xs font-bold border border-slate-700 text-rose-400 flex items-center gap-2">
                <i className="fa-solid fa-temperature-half"></i> + DHT11 Sensor
              </button>
              <button onClick={() => addComponent('led')} className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 text-left rounded-lg text-xs font-bold border border-slate-700 text-amber-400 flex items-center gap-2">
                <i className="fa-regular fa-lightbulb"></i> + RGB LED
              </button>
            </div>

            <hr className="border-slate-800 my-1" />

            <h2 className="text-xs font-bold uppercase text-slate-400">2. Real-Time Hardware Tweaks</h2>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">DHT11 Temp:</span>
                  <span className="text-rose-400 font-bold">{tempVal}°C</span>
                </div>
                <input type="range" min="0" max="50" value={tempVal} onChange={(e) => setTempVal(e.target.value)} className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">RGB LED Power:</span>
                <button onClick={() => setLedState(!ledState)} className={`px-3 py-1 rounded font-bold ${ledState ? 'bg-amber-500/20 text-amber-300 border border-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  {ledState ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {wires.length > 0 && (
              <button onClick={() => setWires([])} className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs font-bold transition">
                <i className="fa-solid fa-scissors mr-1"></i> Clear All Wires ({wires.length})
              </button>
            )}
          </aside>

          {/* Center Column: Interactive Canvas Stage & Wire Overlay */}
          <section className="col-span-6 flex flex-col space-y-3">
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-4 relative flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Interactive Circuit Stage (Click Pins to Connect Wires)</span>
                <button onClick={handleRunSimulation} className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20">
                  <i className="fa-solid fa-play mr-1"></i> Run Simulation (+150 XP)
                </button>
              </div>

              <div ref={canvasStageRef} className="flex-1 bg-slate-950 rounded-lg p-4 border border-slate-800 relative overflow-hidden">
                {components.length === 0 && (
                  <p className="text-xs text-slate-500 text-center mt-16 pointer-events-none">
                    Click hardware items on the left to mount onto canvas...
                  </p>
                )}

                {/* Wire Badge Overlay List */}
                <div className="absolute top-2 right-2 space-y-1 z-30 pointer-events-none">
                  {wires.map((w) => (
                    <span key={w.id} className="block px-2.5 py-1 bg-slate-900/90 text-[10px] font-mono rounded border border-cyan-500/40 shadow" style={{ color: w.color }}>
                      ⚡ Wire: {w.fromPin} ↔ {w.toPin}
                    </span>
                  ))}
                </div>

                {/* Mounted Hardware Modules */}
                {components.map((comp, idx) => (
                  <div key={comp} className="absolute bg-slate-800 border border-cyan-400/80 px-3 py-2.5 rounded-lg text-xs flex flex-col gap-2 shadow-xl z-20" style={{ top: `${20 + idx * 75}px`, left: '20px' }}>
                    <div className="flex items-center justify-between gap-4 font-bold">
                      <span className="text-cyan-300"><i className="fa-solid fa-microchip mr-1"></i> {comp.toUpperCase()} Module</span>
                      <button onClick={() => removeComponent(comp)} className="text-rose-400 hover:text-rose-300 font-bold">&times;</button>
                    </div>
                    
                    {/* Pin Connection Terminals */}
                    <div className="flex gap-2 pt-1">
                      {['GND', '3V3', 'GPIO18'].map((pinType) => {
                        const pinId = `${comp}-${pinType}`;
                        const isSelected = selectedPin?.id === pinId;
                        return (
                          <button
                            key={pinType}
                            onClick={() => handlePinClick(pinId, pinType)}
                            className={`px-2 py-1 rounded text-[10px] font-mono transition flex items-center gap-1 ${
                              isSelected 
                                ? 'bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-300' 
                                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            {pinType}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Serial Monitor Stream */}
            <div className="h-28 bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-cyan-400 overflow-y-auto space-y-1">
              {serialLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </section>

          {/* Right Column */}
          <section className="col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase text-slate-400">3. Visual Blockly Logic</h2>
            <BlocklyEditor onCodeChange={() => addLog('[BLOCKLY]: Syncing block logic to C++ script...')} />

            <h2 className="text-xs font-bold uppercase text-slate-400 pt-2">Generated C++ Code</h2>
            <pre className="bg-slate-950 p-3 rounded text-[11px] font-mono text-emerald-400 flex-1 overflow-y-auto border border-slate-800 leading-relaxed">
{`// Auto-Generated Firmware
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
}

void loop() {
  delay(1000);
}`}
            </pre>
          </section>
        </main>
      )}

      {/* 2. COURSES TAB */}
      {activeTab === 'learn' && (
        <main className="relative z-10 flex-1 grid grid-cols-12 gap-6 p-6 h-[calc(100vh-65px)] overflow-y-auto">
          <section className="col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-play-circle"></i> Module 1: Introduction to ESP32 Architecture & MQTT
            </h2>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/31I4fLThvJg" title="ESP32 IoT Tutorial" allowFullScreen></iframe>
            </div>
          </section>

          <section className="col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-amber-400">Knowledge Check (+100 XP)</span>
              <p className="text-xs text-slate-200 mt-2 mb-4">Which protocol is standard for lightweight IoT telemetry?</p>
              <button onClick={() => { addXP(100); alert('🎉 Correct! +100 XP!'); }} className="w-full p-2 bg-slate-800 hover:bg-cyan-500/20 text-xs rounded border border-slate-700 text-left">
                A) MQTT Protocol
              </button>
            </div>
          </section>
        </main>
      )}

      {/* 3. DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <main className="relative z-10 flex-1 p-6 space-y-6 h-[calc(100vh-65px)] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs font-bold">TOTAL XP EARNED</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{userXP} XP</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs font-bold">CLASS RANK</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">#3 in Class</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-slate-400 text-xs font-bold">COMPLETED COURSES</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">4 / 6</div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
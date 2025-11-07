import { useState, useRef, useEffect } from 'react';
import './App.css';
import AIHelper from './components/AIHelper';

function App() {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [speed, setSpeed] = useState(30);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [userVariables, setUserVariables] = useState({});
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [varName, setVarName] = useState('');
  const [varValue, setVarValue] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a simple grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw objects
    objects.forEach(obj => {
      ctx.fillStyle = obj.color || '#667eea';
      ctx.strokeStyle = obj === selectedObject ? '#ff0000' : '#333';
      ctx.lineWidth = obj === selectedObject ? 3 : 1;

      const x = obj.x || 400;
      const y = obj.y || 300;
      const size = obj.size || 50;

      switch (obj.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'square':
        default:
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
          ctx.strokeRect(x - size / 2, y - size / 2, size, size);
          break;
      }
    });
  }, [objects, selectedObject, currentFrame]);

  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setCurrentFrame(f => f + 1);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [playing, speed]);

  const addVariable = () => {
    if (varName && varValue !== '') {
      setUserVariables(prev => ({
        ...prev,
        [varName]: parseFloat(varValue) || 0
      }));
      setVarName('');
      setVarValue('');
    }
  };

  const createObject = () => {
    const newObject = {
      id: `object_${Date.now()}`,
      name: `Object ${objects.length + 1}`,
      shape: 'square',
      x: 400,
      y: 300,
      size: 50,
      color: '#667eea',
      equations: {}
    };
    setObjects(prev => [...prev, newObject]);
    setSelectedObject(newObject);
  };

  const clearAllObjects = () => {
    setObjects([]);
    setSelectedObject(null);
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const resetAnimation = () => {
    setCurrentFrame(0);
    setPlaying(false);
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h3>🔢 Variables</h3>
        <div style={{ marginBottom: '15px' }}>
          {Object.entries(userVariables).map(([name, value]) => (
            <div key={name} style={{
              padding: '6px',
              marginBottom: '5px',
              background: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {name} = {value}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="name"
            value={varName}
            onChange={(e) => setVarName(e.target.value)}
            style={{
              width: '80px',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <input
            type="number"
            placeholder="value"
            value={varValue}
            onChange={(e) => setVarValue(e.target.value)}
            style={{
              width: '80px',
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          <button
            onClick={addVariable}
            style={{ padding: '6px 10px', fontSize: '12px', flexShrink: 0 }}
          >
            +
          </button>
        </div>

        <h3>📦 Objects</h3>
        <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button
            className="success"
            onClick={createObject}
            style={{ width: '100%', fontSize: '12px' }}
          >
            ➕ Create New
          </button>
          <button
            className="danger"
            onClick={clearAllObjects}
            style={{ width: '100%', fontSize: '12px' }}
          >
            🗑️ Clear All
          </button>
        </div>
        <ul className="object-list">
          {objects.map(obj => (
            <li
              key={obj.id}
              className={`object-item ${obj === selectedObject ? 'selected' : ''}`}
              onClick={() => setSelectedObject(obj)}
            >
              <div>
                <div className="object-name">{obj.name}</div>
                <div className="object-type">{obj.shape}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>MoPiX 3 - Programming with Algebra</h1>
        <p className="subtitle">Full-featured visual programming using algebraic statements</p>

        <canvas ref={canvasRef} width="800" height="600" />

        <div className="controls">
          <button className="secondary" onClick={resetAnimation}>⏮ Reset</button>
          <button
            className={playing ? 'pause' : 'play'}
            onClick={togglePlay}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="frame-control">
            <label htmlFor="frameInput">Frame:</label>
            <input
              type="number"
              id="frameInput"
              value={currentFrame}
              onChange={(e) => setCurrentFrame(parseInt(e.target.value) || 0)}
              min="0"
              max="1000"
            />
            <input
              type="range"
              value={currentFrame}
              onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
              min="0"
              max="200"
            />
          </div>

          <div className="speed-control">
            <label htmlFor="speedSlider">Speed:</label>
            <input
              type="range"
              id="speedSlider"
              min="1"
              max="60"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
            <span>{speed} fps</span>
          </div>
        </div>

        <div className="stats-compact">
          <h4>⌨️ Keyboard Shortcuts &amp; Features</h4>
          <ul>
            <li><kbd>Space</kbd> Play/Pause | <kbd>←/→</kbd> Step</li>
            <li><strong>🔢 Variables:</strong> Define custom variables - use in equations!</li>
            <li><strong>📐 Equations:</strong> 12 shapes, collision detection, conditionals, and 30+ functions!</li>
            <li><strong>🤖 AI Helper:</strong> Get help with equations and animation ideas!</li>
          </ul>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar">
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowAIHelper(true)}
            style={{
              width: '100%',
              fontSize: '12px',
              padding: '10px',
              marginTop: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            🤖 AI Helper
          </button>
        </div>

        <h3>⚙️ Properties</h3>
        <div className="property-panel empty">
          {selectedObject ? (
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>{selectedObject.name}</strong>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Shape: {selectedObject.shape}
                </p>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <p>Position: ({selectedObject.x}, {selectedObject.y})</p>
                <p>Size: {selectedObject.size}px</p>
                <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
                  Property editing coming soon...
                </p>
              </div>
            </div>
          ) : (
            'Select an object to edit properties'
          )}
        </div>
      </div>

      {/* AI Helper Modal */}
      <AIHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        objects={objects}
        userVariables={userVariables}
      />
    </div>
  );
}

export default App;

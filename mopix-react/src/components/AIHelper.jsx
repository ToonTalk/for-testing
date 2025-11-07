import { useState } from 'react';

const SYSTEM_PROMPT = `You are an expert programming assistant for MoPiX 3, a visual programming tool that uses algebraic equations to animate objects.

Your role:
- Help users write equations for the 'Equation:' field
- Explain how functions and features work
- Debug equation problems
- Suggest creative animations

Available built-in variables:
- t: Current time in seconds (main animation variable)
- pi: Mathematical constant π (3.14159...)
- e: Mathematical constant e (2.71828...)
- mouse.x, mouse.y: Mouse cursor position

Available functions:
- Collision: overlaps(obj1, obj2)
- Math: sin(deg), cos(deg), tan(deg), asin(v), acos(v), atan(v), abs(v), sqrt(v), ln(v), log(v), exp(v), floor(v), ceil(v), round(v), sign(v), fract(v)
- Multi-arg:
  - dist(x1, y1, x2, y2)
  - angle(x1, y1, x2, y2) -> returns degrees
  - atan2(y, x) -> returns degrees
  - min(a, b, ...), max(a, b, ...)
  - clamp(value, min, max)
  - lerp(start, end, t)
  - random(), random(max), random(min, max)
  - mod(value, divisor)
  - pow(base, exponent)
- Easing:
  - smoothstep(edge0, edge1, x)
  - step(edge, x)
  - ease(x, power)
  - bounce(t)
  - wrap(value, min, max)

When responding:
1. Be concise and helpful.
2. Provide clear, copy-pasteable equations for the 'Equation:' field.
3. Explain *why* an equation works.
4. If the user's project context is provided, use the object and variable names from their project.
5. Format your response using simple markdown (bold, lists).
6. ALWAYS use an explicit multiplication sign (*). For example, write "2 * t", not "2t".`;

function AIHelper({ isOpen, onClose, objects, userVariables }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildContext = () => {
    let context = "Here is the current state of the MoPiX 3 project:\n\n";

    // User Variables
    context += "User Variables:\n";
    if (!userVariables || Object.keys(userVariables).length === 0) {
      context += "- None\n";
    } else {
      Object.entries(userVariables).forEach(([name, value]) => {
        context += `- ${name} = ${value}\n`;
      });
    }
    context += "\n";

    // Objects and their equations
    context += "Objects and Equations:\n";
    if (!objects || objects.length === 0) {
      context += "- No objects\n";
    } else {
      objects.forEach(obj => {
        context += `Object: ${obj.name} (id: ${obj.id})\n`;
        if (!obj.equations || Object.keys(obj.equations).length === 0) {
          context += "  - No equations\n";
        } else {
          Object.entries(obj.equations).forEach(([prop, eq]) => {
            context += `  - ${prop} = ${eq}\n`;
          });
        }
      });
    }
    context += "\n";

    // User's question
    context += "User's Question:\n" + prompt;

    return context;
  };

  const callClaudeAPI = async (userPrompt) => {
    const apiKey = ""; // Leave empty as requested

    if (!apiKey) {
      throw new Error("API key is not configured. Please add your Claude API key.");
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();

    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error("No valid response from AI. The content may be blocked or unavailable.");
    }

    return result.content[0].text;
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const fullPrompt = buildContext();
      const response = await callClaudeAPI(fullPrompt);
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Sorry, an error occurred: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simpleMarkdownToHTML = (text) => {
    // Simple markdown conversion
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
    return html;
  };

  if (!isOpen) return null;

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h3>🤖 AI Helper</h3>
        </div>
        <div className="ai-modal-content">
          <p>Ask for help, get equation ideas, or debug your model.</p>

          <div className="ai-response-area">
            {messages.map((msg, index) => (
              msg.type === 'user' ? (
                <div key={index} className="ai-user-message">
                  <p>{msg.content}</p>
                </div>
              ) : (
                <div key={index} className="ai-assistant-message">
                  <div dangerouslySetInnerHTML={{
                    __html: simpleMarkdownToHTML(msg.content)
                  }} />
                </div>
              )
            ))}
          </div>

          {loading && (
            <div className="ai-loading">
              🤖 Thinking...
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., How do I make an object bounce off the walls? or Give me an equation for a spiral."
            rows="3"
            disabled={loading}
          />

          <div className="ai-modal-buttons">
            <button className="secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="success"
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIHelper;

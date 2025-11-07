# MoPiX 3 - React Version

A React-based visual programming tool that uses algebraic equations to animate objects. This is a conversion of the original HTML version to a modern React application with Claude AI integration.

## Features

- **Visual Programming**: Create and animate objects using algebraic equations
- **AI Helper**: Get assistance from Claude AI for equation ideas and debugging
- **Custom Variables**: Define your own variables and use them in equations
- **Interactive Canvas**: Draw and manipulate objects in real-time
- **Animation Controls**: Play, pause, and control animation speed

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd mopix-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Claude API Key (Required for AI Helper):
   - Open `src/components/AIHelper.jsx`
   - Find the line: `const apiKey = "";`
   - Replace with your Claude API key: `const apiKey = "your-api-key-here";`
   - Get your API key from: https://console.anthropic.com/

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating Objects

1. Click the "➕ Create New" button in the Objects panel
2. Click on an object in the list to select it
3. View and edit properties in the right sidebar

### Using the AI Helper

1. Click the "🤖 AI Helper" button in the right sidebar
2. Ask questions about equations, animations, or debugging
3. The AI will provide suggestions based on your current project state

### Variables

- Add custom variables using the Variables panel
- Use variables in your equations (e.g., `speed`, `radius`)
- Built-in variables: `t` (time), `pi`, `e`, `mouse.x`, `mouse.y`

### Available Functions

- **Math**: `sin()`, `cos()`, `tan()`, `sqrt()`, `abs()`, etc.
- **Multi-arg**: `dist()`, `angle()`, `min()`, `max()`, `clamp()`, `lerp()`, `random()`, etc.
- **Easing**: `smoothstep()`, `ease()`, `bounce()`, `wrap()`, etc.

## Changes from Original

- Converted from vanilla HTML/JS to React
- Replaced Google Gemini API with Claude API
- Simplified equation engine (basic implementation)
- Modern build system with Vite
- Component-based architecture

## Technologies Used

- React 18
- Vite
- KaTeX (for mathematical rendering)
- Claude AI API

## License

This project is a conversion of the original MoPiX 3 application.

## Notes

- The AI Helper requires a valid Claude API key to function
- The equation engine is a simplified version - full expression parsing coming soon
- Some advanced features from the original are still being ported

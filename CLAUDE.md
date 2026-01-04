# Guitar Teacher App

## Project Overview
A React TypeScript Three.js application for teaching guitar. Built with Vite.

## Tech Stack
- React 18 + TypeScript
- Vite
- Three.js via @react-three/fiber and @react-three/drei

## Project Structure
```
├── src/
│   ├── components/
│   │   ├── Guitar3D.tsx       # 3D guitar fretboard with strings, frets, finger markers
│   │   ├── GuitarScene.tsx    # Three.js canvas wrapper with camera/lighting
│   │   ├── ChordDiagram.tsx   # 2D SVG chord diagram
│   │   └── LessonPanel.tsx    # UI for lesson navigation and controls
│   ├── data/
│   │   ├── chords.ts          # 12 chords (C, G, D, A, E, Am, Em, Dm, F, Bm, C7, G7)
│   │   ├── scales.ts          # 6 scales (major, pentatonic, blues)
│   │   └── songs.ts           # 6 songs with chord progressions
│   ├── types/
│   │   └── index.ts           # TypeScript types for chords, scales, songs
│   ├── App.tsx                # Main app component
│   ├── App.css                # Styles
│   └── main.tsx               # Entry point
```

## Features
1. **3D Guitar Visualization** - Interactive fretboard (rotate, zoom, pan)
2. **Finger Position Indicators** - Color-coded by finger number
3. **String Highlighting** - Shows which strings to strum/skip
4. **Muted/Open String Markers** - X for muted, O for open

## Three Learning Modes
- **Chords:** Navigate through 12 common guitar chords
- **Scales:** Practice 6 different scales with root note highlighting
- **Songs:** Play along with 6 songs, auto-advancing chord progressions

## Finger Color Coding
- Index (1): Blue `#3498db`
- Middle (2): Green `#2ecc71`
- Ring (3): Red `#e74c3c`
- Pinky (4): Orange `#f39c12`

## Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build
```

## Songs Included
1. Knockin' on Heaven's Door - Bob Dylan
2. Wonderwall - Oasis
3. Let It Be - The Beatles
4. Horse with No Name - America
5. Stand By Me - Ben E. King
6. Sweet Home Alabama - Lynyrd Skynyrd

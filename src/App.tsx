import { pi } from 'mathjs';
import React, { useEffect, useRef } from 'react'
import './App.css';
import { Cube } from './engine/Cube';
import Drawing from './engine/Drawing'

const W = 450
const H = 450
const backgroundColor = '#000'

function App() {
  let canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d')
    const drawing = Drawing(W, H, backgroundColor, context)

    if (context) {
      const cube = Cube(W, H)

      let frameRate = 25
      let timeRate = 1000 / frameRate
      const rate = pi / frameRate

      setInterval(() => {
        drawing.clear()
        drawing.drawMesh(cube, rate)
      }, timeRate)
    }
  }, [])

  return (
    <div className="App">
       <canvas
        ref={canvasRef}
        id='canvas'
        width={W}
        height={H}
      />
    </div>
  );
}


export default App;

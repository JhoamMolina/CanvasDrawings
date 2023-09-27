import "font-awesome/css/font-awesome.min.css";
import { useState } from "react";
import "./App.css";
import Canvas from "./Components/Canvas";

function App() {
  const [shapeType, setShapeType] = useState("rectangle"); // or 'circle'

  return (
    <div className="App">
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <button
          onClick={() => setShapeType("rectangle")}
          className="button rectangle-button"
        >
          <i className="fa fa-square-o fa-2x icon" aria-hidden="true"></i> Draw
          Rectangle
        </button>
        <button
          onClick={() => setShapeType("circle")}
          className="button circle-button"
        >
          <i className="fa fa-circle-o fa-2x icon" aria-hidden="true"></i> Draw
          Circle
        </button>
      </div>
      <Canvas
        shapeType={shapeType}
        width={700}
        height={500}
        imageUrl="https://i.pinimg.com/1200x/00/2d/57/002d5714c44f88a16c1f0bdfa97ca05e.jpg"
      />
    </div>
  );
}

export default App;

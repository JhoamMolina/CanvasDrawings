import "font-awesome/css/font-awesome.min.css";
import { useState } from "react";
import "./App.css";
import Canvas from "./Components/Canvas";

function App() {
  const [shapeType, setShapeType] = useState("rectangle"); // or 'circle'3
  const [adjustContrast, setAdjustContrast] = useState(false);

  const toggleContrast = () => {
    setAdjustContrast(!adjustContrast);
  };

  return (
    <div className="App">
      <div style={{ marginBottom: "10px", display: "flex" }}>
        <button
          onClick={() => setShapeType("rectangle")}
          className="button rectangle-button"
          style={{
            filter: `brightness(${shapeType === "rectangle" ? 0.85 : 1})`,
          }}
        >
          <i className="fa fa-square-o fa-2x icon" aria-hidden="true"></i> Draw
          Rectangle
        </button>
        <button
          onClick={() => setShapeType("circle")}
          className="button circle-button"
          style={{
            filter: `brightness(${shapeType === "circle" ? 0.85 : 1})`,
          }}
        >
          <i className="fa fa-circle-o fa-2x icon" aria-hidden="true"></i> Draw
          Circle
        </button>
        <button onClick={toggleContrast} className="button contrast-button">
          <i className="fa fa-adjust fa-2x icon" aria-hidden="true"></i> Adjust
          Contrast
        </button>
      </div>
      <Canvas
        shapeType={shapeType}
        adjustContrast={adjustContrast}
        width={700}
        height={500}
        // imageUrl="https://plus.unsplash.com/premium_photo-1675714692739-8d2a192e1f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        imageUrl="https://i.pinimg.com/1200x/00/2d/57/002d5714c44f88a16c1f0bdfa97ca05e.jpg"
      />
    </div>
  );
}

export default App;

import "./App.css";
import Canvas from "./Components/Canvas";

function App() {
  return (
    <div className="App">
      <Canvas
        width={700}
        height={500}
        imageUrl="https://i.pinimg.com/1200x/00/2d/57/002d5714c44f88a16c1f0bdfa97ca05e.jpg"
      />
    </div>
  );
}

export default App;

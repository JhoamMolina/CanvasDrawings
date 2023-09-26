import { useCallback, useEffect, useRef } from "react";
import { useOnDraw } from "./Hooks";

const Canvas = (props) => {
  const { width, height, imageUrl } = props;
  const { setCanvasRef, canvasRef, lastPointRef, prevPointRef } =
    useOnDraw(onDraw);

  const rectanglesRef = useRef([]);

  const imgRef = useRef(new Image());
  imgRef.current.src = imageUrl;

  const redraw = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imgRef.current, 0, 0, width, height);
    console.log(rectanglesRef);

    rectanglesRef.current.forEach((rect) =>
      drawRectangle(rect.start, rect.end, ctx, "black")
    );
  }, [canvasRef, width, height]);

  useEffect(() => {
    imgRef.current.onload = () => redraw();
    if (imgRef.current.complete) redraw(); // Immediate redraw if the image is already loaded
  }, [redraw]);

  function onDraw(ctx, point, prevPoint) {
    if (!prevPoint) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    redraw();
    rectanglesRef.current.forEach((rect) =>
      drawRectangle(rect.start, rect.end, ctx, "black")
    ); // Redraw all rectangles
    drawRectangle(prevPoint, point, ctx, "black");
  }

  function drawRectangle(start, end, ctx, color) {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(start.x - end.x);
    const height = Math.abs(start.y - end.y);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
  }

  function onMouseUp() {
    if (prevPointRef.current && lastPointRef.current) {
      const rect = { start: prevPointRef.current, end: lastPointRef.current };
      rectanglesRef.current.push(rect);
    }
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.filStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      style={canvasStyle}
      ref={setCanvasRef}
      onMouseUp={onMouseUp}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};

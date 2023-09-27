import { useCallback, useEffect, useRef } from "react";
import { useOnDraw } from "./Hooks";

const Canvas = (props) => {
  const { width, height, imageUrl, shapeType } = props;
  const { setCanvasRef, canvasRef, lastPointRef, prevPointRef } =
    useOnDraw(onDraw);

  const rectanglesRef = useRef([]);

  const imgRef = useRef(new Image());
  imgRef.current.src = imageUrl;

  console.log();

  function drawCircle(start, end, ctx, color) {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);

    // Calculate side to form a square
    const side = Math.max(maxX - minX, maxY - minY);

    // Adjust min coordinates to form a square
    const adjustedMinX = start.x < end.x ? minX : maxX - side;
    const adjustedMinY = start.y < end.y ? minY : maxY - side;

    // Calculate the center and the radius of the circle
    const centerX = adjustedMinX + side / 2;
    const centerY = adjustedMinY + side / 2;
    const radius = side / 2;

    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  const redraw = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imgRef.current, 0, 0, width, height);
    rectanglesRef.current.forEach((shape) => {
      if (shape.type === "rectangle") {
        drawRectangle(shape.start, shape.end, ctx, "black");
      } else if (shape.type === "circle") {
        drawCircle(shape.start, shape.end, ctx, "black");
      }
    });
  }, [canvasRef, width, height]);

  useEffect(() => {
    imgRef.current.onload = () => redraw();
    if (imgRef.current.complete) redraw(); // Immediate redraw if the image is already loaded
  }, [redraw]);

  function onDraw(ctx, point, prevPoint) {
    if (!prevPoint) return;
    redraw();
    if (shapeType === "rectangle") {
      drawRectangle(prevPoint, point, ctx, "black");
    } else if (shapeType === "circle") {
      drawCircle(prevPoint, point, ctx, "black"); // prevPoint is center, point is current mouse position
    }
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
      const shape = {
        type: shapeType,
        start: prevPointRef.current,
        end: lastPointRef.current,
      };
      rectanglesRef.current.push(shape); // This array will now store both rectangles and circles.
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

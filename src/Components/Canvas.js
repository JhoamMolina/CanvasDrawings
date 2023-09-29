import { useCallback, useEffect, useRef, useState } from "react";
import { useOnDraw } from "./Hooks";

const brightness = 200; // Adjust this value based on your desired brightness

const Canvas = (props) => {
  const { width, height, imageUrl, shapeType, adjustContrast } = props;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPoint, setZoomPoint] = useState({ x: width / 2, y: height / 2 }); // center by default

  const { setCanvasRef, canvasRef, lastPointRef, prevPointRef } =
    useOnDraw(onDraw);

  const rectanglesRef = useRef([]);

  const imgRef = useRef(new Image());
  imgRef.current.src = imageUrl;

  function adjustPoint(point, zoomLevel, zoomPoint) {
    const { x, y } = point;
    return {
      x: (x - zoomPoint.x) / zoomLevel + zoomPoint.x,
      y: (y - zoomPoint.y) / zoomLevel + zoomPoint.y,
    };
  }

  const redraw = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Applying zoom transformation before drawing
    ctx.translate(zoomPoint.x, zoomPoint.y);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-zoomPoint.x, -zoomPoint.y);

    // Drawing elements after transformation
    ctx.drawImage(imgRef.current, 0, 0, width, height);

    rectanglesRef.current.forEach((shape) => {
      if (shape.type === "rectangle")
        drawRectangle(shape.start, shape.end, ctx, "black");
      else if (shape.type === "circle")
        drawOval(shape.start, shape.end, ctx, "black");
    });

    ctx.restore(); // Reset transformations after drawing
  }, [canvasRef, zoomLevel, zoomPoint, width, height]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.filter = adjustContrast
        ? `brightness(${brightness}%)`
        : "brightness(100%)";
    }
  }, [adjustContrast, canvasRef]);

  const handleWheel = useCallback(
    (event) => {
      // Calculating the zoomPoint dynamically based on cursor position
      const bounds = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      setZoomPoint({ x, y });

      // Zooming in/out depending on deltaY value
      if (event.deltaY < 0) setZoomLevel((prev) => Math.min(prev * 1.1, 5));
      else setZoomLevel((prev) => Math.max(prev / 1.1, 1));
    },
    [canvasRef, setZoomLevel]
  );

  function drawOval(start, end, ctx, color) {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);

    const width = maxX - minX;
    const height = maxY - minY;

    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    const rx = width / 2;
    const ry = height / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, rx, ry, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () =>
      canvas.removeEventListener("wheel", handleWheel, { passive: false });
  }, [canvasRef, handleWheel]);

  useEffect(() => {
    imgRef.current.onload = () => redraw();
    if (imgRef.current.complete) redraw(); // Immediate redraw if the image is already loaded
  }, [redraw]);

  function onDraw(ctx, point, prevPoint) {
    if (!prevPoint) return;

    // Adjusting points considering zoom level and zoom point.
    const adjustedPoint = adjustPoint(point, zoomLevel, zoomPoint);
    const adjustedPrevPoint = adjustPoint(prevPoint, zoomLevel, zoomPoint);

    redraw();
    if (shapeType === "rectangle") {
      drawRectangle(adjustedPrevPoint, adjustedPoint, ctx, "black");
    } else if (shapeType === "circle") {
      drawOval(adjustedPrevPoint, adjustedPoint, ctx, "black");
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
        start: prevPointRef.current, // these points should be original points, not adjusted ones.
        end: lastPointRef.current,
      };
      rectanglesRef.current.push(shape);
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
      onWheel={handleWheel}
    />
  );
};

export default Canvas;

const canvasStyle = {
  border: "1px solid black",
};

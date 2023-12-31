import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);

  const mouseMoveListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  const prevPointRef = useRef(null);

  const lastPointRef = useRef(null);

  // cleanup for mousemove and mouseup listeners
  useEffect(() => {
    return () => {
      if (mouseMoveListenerRef.current)
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      if (mouseUpListenerRef.current)
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
    };
  }, []);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      canvasRef.current.removeEventListener(
        "mousedown",
        mouseDownListenerRef.current
      );
    }
    canvasRef.current = ref;
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (!isDrawingRef.current || !prevPointRef.current) return;
      const point = computePointInCanvas(e.clientX, e.clientY);
      lastPointRef.current = point;
      const ctx = canvasRef.current.getContext("2d");
      if (onDraw) onDraw(ctx, point, prevPointRef.current);
    };
    mouseMoveListenerRef.current = mouseMoveListener;
    window.addEventListener("mousemove", mouseMoveListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const listener = (e) => {
      if (e.button !== 0) return; // only left click (0
      isDrawingRef.current = true;
      const point = computePointInCanvas(e.clientX, e.clientY);
      prevPointRef.current = point; // Store the starting point when mouse is pressed
    };
    mouseDownListenerRef.current = listener;
    canvasRef.current.addEventListener("mousedown", listener);
  }

  function initMouseUpListener() {
    const listener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };
    mouseUpListenerRef.current = listener;
    window.addEventListener("mouseup", listener);
  }

  function computePointInCanvas(clientX, clientY) {
    if (!canvasRef.current) return;
    const boundingRect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - boundingRect.left,
      y: clientY - boundingRect.top,
    };
  }

  return {
    setCanvasRef,
    canvasRef,
    prevPointRef,
    lastPointRef,
  };
}

import { useRef } from 'react';

/**
 * Hook to provide smooth, rock-solid window dragging on desktop (Electron).
 * Uses pointer capture so mouse movements are never lost when dragged quickly across the screen.
 * If total movement is < 4px, calls onClick (handles click vs drag differentiation).
 */
export function useDraggable(onClick) {
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const totalMovedRef = useRef(0);

  const handlePointerDown = (e) => {
    // Only primary left-click
    if (e.button !== 0) return;
    // Don't drag if clicking buttons, inputs, links
    if (e.target.closest('button, input, textarea, select, a, [data-no-drag]')) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    totalMovedRef.current = 0;
    startPosRef.current = { x: e.screenX, y: e.screenY };

    const handlePointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvent.screenX - startPosRef.current.x;
      const deltaY = moveEvent.screenY - startPosRef.current.y;

      totalMovedRef.current += Math.abs(deltaX) + Math.abs(deltaY);

      if (deltaX !== 0 || deltaY !== 0) {
        if (window.electronAPI?.moveWindow) {
          window.electronAPI.moveWindow(deltaX, deltaY);
        }
        startPosRef.current = { x: moveEvent.screenX, y: moveEvent.screenY };
      }
    };

    const handlePointerUp = (upEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
        e.currentTarget.releasePointerCapture(upEvent.pointerId);
      } catch (_) {}

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      // If user moved less than 4px total, treat as click
      if (totalMovedRef.current < 4 && onClick) {
        onClick();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return handlePointerDown;
}

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const CursorTracker = () => {
  const cursorPositionsRef = useRef({});
  const socket = io('http://localhost:3000');
  const cursorsContainerRef = useRef(null);

  useEffect(() => {
    // Generate a unique ID per tab
    const tabId = sessionStorage.getItem('tabId') || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('tabId', tabId);

    const updateCursorPosition = (data) => {
      cursorPositionsRef.current[data.clientId] = { x: data.x, y: data.y };
      const cursorElement = document.getElementById(`cursor-${data.clientId}`);
      if (cursorElement) {
        cursorElement.style.left = `${data.x}px`;
        cursorElement.style.top = `${data.y}px`;
      } else {
        const newCursor = document.createElement('div');
        newCursor.id = `cursor-${data.clientId}`;
        newCursor.className = 'cursor';
        newCursor.style.left = `${data.x}px`;
        newCursor.style.top = `${data.y}px`;
        newCursor.innerText = `Cursor ${data.clientId}`;
        cursorsContainerRef.current.appendChild(newCursor);
      }
    };

    socket.on('cursorMoved', updateCursorPosition);

    const throttledEmit = (() => {
      let lastEmitTime = Date.now();
      return (x, y) => {
        const now = Date.now();
        if (now - lastEmitTime > 100) {
          socket.emit('updateCursor', { x, y, clientId: tabId });
          lastEmitTime = now;
        }
      };
    })();
    
    const handleMouseMove = (event) => {
      throttledEmit(event.clientX, event.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      socket.off('cursorMoved', updateCursorPosition);
    };
  }, [socket]);

  return <div ref={cursorsContainerRef}></div>;
};

export default CursorTracker;

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMouse } from '@fortawesome/free-solid-svg-icons';
import styles from './CursorTracker.module.css';

const socket = io('http://localhost:3001');

function useCursorTracker() {
  const [cursorPositions, setCursorPositions] = useState({});

  useEffect(() => {
    const tabId = uuidv4();

    const updateCursorPosition = (data) => {
      setCursorPositions((prevPositions) => {
        const newPositions = { ...prevPositions };
        newPositions[data.clientId] = { x: data.x, y: data.y };
        return newPositions;
      });
    };

    socket.on('cursorMoved', updateCursorPosition);

    const throttledEmit = _.throttle((x, y) => {
      socket.emit('updateCursor', { x, y, clientId: tabId });
    }, 100);

    const handleMouseMove = (event) => {
      throttledEmit(event.clientX, event.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      socket.off('cursorMoved', updateCursorPosition);
    };
  }, []);

  return cursorPositions;
}

const CursorTracker = () => {
  const cursorPositions = useCursorTracker();

  return (
    <div>
      {Object.entries(cursorPositions).map(([clientId, position]) => (
        <div
          key={clientId}
          className={styles.cursorContainer}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          <FontAwesomeIcon
            key={clientId}
            icon={faMouse}
            className={styles.cursorIcon}
            style={{ marginLeft: '5px', marginRight: '5px' }}
          />
          <p className={styles.cursorLabel}>{clientId}</p>
        </div>
      ))}
    </div>
  );
};

export default CursorTracker;

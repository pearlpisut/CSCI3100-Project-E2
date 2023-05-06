import React, { useRef, useEffect } from 'react';

/*
    Drawing Gobang game board using HTML canvas
*/
const BOARD_SIZE = 19;
const CELL_SIZE = 20;
const BOARD_MARGIN = 20;
const BOARD_PADDING = 3;

function GoBoard({ boardArray }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Draw board background
    context.fillStyle = '#DDBB6D';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board lines
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    for (let i = 0; i <= BOARD_SIZE; i++) {
      const x = BOARD_MARGIN + i * CELL_SIZE;
      context.beginPath();
      context.moveTo(BOARD_MARGIN, x);
      context.lineTo(canvas.width - BOARD_MARGIN, x);
      context.stroke();
      context.beginPath();
      context.moveTo(x, BOARD_MARGIN);
      context.lineTo(x, canvas.height - BOARD_MARGIN);
      context.stroke();
    }

    // Draw stones
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const stone = boardArray[i][j];
        if (stone !== 0) {
          const x = BOARD_MARGIN + j * CELL_SIZE;
          const y = BOARD_MARGIN + i * CELL_SIZE;
          context.beginPath();
          context.arc(x, y, CELL_SIZE / 2 - BOARD_PADDING, 0, 2 * Math.PI);
          context.fillStyle = stone === 1 ? '#FFFFFF' : '#000000';
          context.fill();
          context.stroke();
        }
      }
    }
  }, [boardArray]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_SIZE * CELL_SIZE + 2 * BOARD_MARGIN}
      height={BOARD_SIZE * CELL_SIZE + 2 * BOARD_MARGIN}
    />
  );
}

export default GoBoard;

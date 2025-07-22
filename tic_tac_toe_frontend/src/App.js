import React, { useState, useEffect } from 'react';
import './App.css';

// Color theme constants for easy re-theming
const COLORS = {
  primary: '#1976D2',
  secondary: '#FFC107',
  accent: '#E53935',
  boardBg: '#fff',
  cellBg: '#f9fafc',
  border: '#e0e0e0'
};

function getInitialBoard() {
  return Array(9).fill(null);
}

// PUBLIC_INTERFACE
function App() {
  // State for theme mode (light/dark) and game logic
  const [theme, setTheme] = useState('light');
  const [board, setBoard] = useState(getInitialBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // PUBLIC_INTERFACE
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  useEffect(() => {
    const result = calculateWinner(board);
    setWinner(result);
    setDraw(!result && board.every(Boolean));
  }, [board]);

  // PUBLIC_INTERFACE
  const startNewGame = () => {
    setBoard(getInitialBoard());
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
    setGameStarted(true);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(getInitialBoard());
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
    setGameStarted(false);
  };

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    // Block moves if game not started or finished
    if (!gameStarted || winner || draw || board[idx]) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const renderStatus = () => {
    if (!gameStarted) return <span>Click <b>Start Game</b> to play!</span>;
    if (winner) return (
      <span>
        <b style={{ color: COLORS.accent }}>{winner}</b> wins!
      </span>
    );
    if (draw) {
      return <span><b style={{ color: COLORS.secondary }}>Draw!</b> No winner.</span>;
    }
    return (
      <span>
        Next turn: <b style={{ color: xIsNext ? COLORS.primary : COLORS.accent }}>
          {xIsNext ? 'X' : 'O'}
        </b>
      </span>
    );
  };

  // PUBLIC_INTERFACE
  return (
    <div
      className="App"
      style={{ minHeight: '100vh', background: COLORS.boardBg, display: 'flex', flexDirection: 'column' }}
    >
      <header className="App-header" style={{ background: 'none', minHeight: 'unset', flex: 1, justifyContent: 'center' }}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 style={{
          fontWeight: 700, fontSize: '2rem', color: COLORS.primary, marginTop: 20, marginBottom: 5
        }}>Tic Tac Toe</h1>
        <div style={{
          color: COLORS.accent,
          fontWeight: 500,
          fontSize: 18,
          marginBottom: '1.2rem'
        }}>
          {renderStatus()}
        </div>
        <div className="ttt-board-wrap">
          <Board
            board={board}
            onClick={handleCellClick}
            isDisabled={!gameStarted || winner || draw}
          />
        </div>
        <div className="ttt-controls" style={{
          marginTop: 32,
          display: 'flex',
          gap: 16,
          justifyContent: 'center'
        }}>
          <button
            onClick={startNewGame}
            className="ttt-btn"
            style={{
              background: COLORS.primary,
              color: '#fff',
              border: 'none'
            }}
            aria-label="Start new game"
            disabled={gameStarted && !winner && !draw}
          >
            {!gameStarted ? 'Start Game' : (winner || draw ? 'New Game' : 'Game In Progress')}
          </button>
          <button
            onClick={resetGame}
            className="ttt-btn"
            style={{
              background: COLORS.secondary,
              color: '#212121',
              border: 'none'
            }}
            aria-label="Reset board"
          >
            Reset
          </button>
        </div>
        <footer style={{
          marginTop: 40,
          color: COLORS.primary,
          fontSize: '1rem',
          opacity: 0.7,
          letterSpacing: 0.2
        }}>
          <span>Modern React | <a href="https://reactjs.org/" style={{ color: COLORS.accent, textDecoration: 'none' }}>Learn React</a></span>
        </footer>
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onClick, isDisabled }) {
  return (
    <div className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        width: 320,
        maxWidth: '98vw',
        margin: '0 auto',
        background: COLORS.boardBg,
        borderRadius: 16,
        boxShadow: '0 2px 16px 0 rgba(25, 118, 210, 0.05)'
      }}>
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          idx={idx}
          onClick={onClick}
          disabled={isDisabled || Boolean(cell)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, idx, onClick, disabled }) {
  const getCellColor = () => {
    if (value === 'X') return COLORS.primary;
    if (value === 'O') return COLORS.accent;
    return COLORS.boardBg;
  };

  return (
    <button
      className="ttt-cell"
      style={{
        width: 96,
        height: 96,
        maxWidth: '32vw',
        maxHeight: '32vw',
        background: COLORS.cellBg,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 12,
        fontSize: '2rem',
        fontWeight: 700,
        color: getCellColor(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: value ? `0 1px 8px 0 rgba(229,57,53,0.06)` : 'none',
        outline: 'none',
        transition: 'all 0.13s'
      }}
      aria-label={`Cell ${idx + 1} ${value ? 'occupied by ' + value : ''}`}
      onClick={() => { if (!disabled) onClick(idx); }}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

// Calculate the winner (returns 'X', 'O', or null)
// PUBLIC_INTERFACE
function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let l = 0; l < lines.length; l++) {
    const [a, b, c] = lines[l];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default App;

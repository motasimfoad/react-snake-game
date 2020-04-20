import React, { useState } from 'react';
import '../Home/home.css';
import Snake from '../../Components/snake'

function Home() {

const [snakeBody, setSnakeBody] = useState([[0,0],[2,0]]);

  return (
    <div className="app">
      <div className="game-board">
        <Snake snakeBody={snakeBody} />
      </div>
    </div>
  );
}

export default Home;

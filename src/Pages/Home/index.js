import React, { useState } from 'react';
import '../Home/home.css';
import Snake from '../../Components/snake';
import Food from '../../Components/snake_food';
import {foodPosition} from '../../GameLogics';

function Home() {

const [snakeBody, setSnakeBody] = useState([[0,0],[2,0]]);
const [snakeFood, setSnakeFood] = useState(foodPosition());

  return (
    <div className="app">
      <div className="game-board">
        <Snake snakeBody={snakeBody} />
        <Food snakeFood={snakeFood} />
      </div>
    </div>
  );
}

export default Home;

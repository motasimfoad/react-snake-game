import React, { useState, useEffect } from 'react';
import '../Home/home.css';
import Snake from '../../Components/snake';
import Food from '../../Components/snake_food';
import {foodPosition, moveSnake} from '../../GameLogics';

function Home() {

const [snakeBody, setSnakeBody] = useState([[0,0],[2,0]]);
const [snakeFood, setSnakeFood] = useState(foodPosition());
const [direction, setDirection] = useState('RIGHT');
const [gameSpeed, setGameSpeed] = useState(200);

useEffect(() => {  
      document.onkeydown = onkeydown;
    //   setInterval(() => {
    //     setSnakeBody(moveSnake({snakeBody, direction}));
    //   }, 500);
      
      console.log(direction);
      let a = moveSnake({snakeBody, direction});
      console.log(a);
      
    });

onkeydown = (e) =>{
   e = e || window.event;
   switch (e.keyCode){
       case 37:
        setDirection('LEFT');
           break;
       case 38:
        setDirection('UP');
           break;
       case 39:
        setDirection('RIGHT');
           break;
       case 40:
        setDirection('DOWN');
           break;
   }
};

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

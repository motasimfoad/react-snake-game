import React, { useState } from 'react';
import '../snake_food/food.css';

function Food(props) {

const [foodStyleL , setFoodStyleL] = useState([
    props.snakeFood[0]
  ]);

  const [foodStyleT , setFoodStyleT] = useState([
    props.snakeFood[1]
  ]);

   const style = {
    left: `${foodStyleL}%`,
    top: `${foodStyleT}%`
 };


  return (
    <div>
      <div className="food-body" style={style}></div>
    </div>
  );
}

export default Food;

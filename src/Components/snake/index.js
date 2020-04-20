import React from 'react';
import '../snake/snake.css';

function Snake(props) {
  return (
      <div>
      {props.snakeBody.map((dot, i) => {
            const style = {
                left: `${dot[0]}%`,
                top: `${dot[1]}%`
            }
            return(
                <div className="snake-body" key={i} style={style}>
                </div>
            )
        })}
    </div>
  );
}

export default Snake;

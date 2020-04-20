export const foodPosition = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
    return [x,y]
}

export const moveSnake = (props) => {
    let position = [props.snakeBody];
    let head = position[position.length-1];
    let copyDirection = props.direction;

    switch (copyDirection){
        case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
        case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
         case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
        case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    position.push(head);
    position.shift();
    let np = position
    


    
return np;
}

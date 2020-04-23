import React, { useState, useRef, useEffect } from 'react';
import { useInterval } from '../../HelperFunction';
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from '../../Constant';
import '../Home/home.css';
import Instructions from '../../Components/Instructions';
import SnakeCharmers from '../../Components/SnakeCharmers';
import {
  Button, Row, Col, Container
} from 'react-bootstrap';
import firebase from '../../Firebase/Config';




function App () {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [sppedText, setSpeedText] = useState(" ")

  useInterval(() => gameLoop(), speed);
 


  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    firebase.firestore().collection('ScoreBoard').add({
      mame: 'Foad',
      score: snake.length
    });
  };

  const moveSnake = ({ keyCode }) => {
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]) || keyCode===13 && startGame();
  }
    

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
    switch (snake.length) {
            case 5:
            setSpeed(95);
            setSpeedText("Game Started");
            break;
            case 10:
            setSpeed(90)
            setSpeedText("Speed 130");
            break;
            case 15:
            setSpeed(85)
            setSpeedText("Speed 120");
            break;
            case 20:
            setSpeed(80)
            setSpeedText("Speed 110");
            break;
            case 25:
            setSpeed(75)
            setSpeedText("Speed 100");
            break;
            case 30:
            setSpeed(70)
            setSpeedText("Speed 90");
            break;
            case 40:
            setSpeed(65)
            setSpeedText("Speed 80");
            break;
            case 45:
            setSpeed(63)
            setSpeedText("Speed 80");
            break;
            case 50:
            setSpeed(60)
            setSpeedText("Speed 80");
            break;
            case 60:
            setSpeed(50)
            setSpeedText("Speed 80");
            break;
            case 70:
            setSpeed(40)
            setSpeedText("Speed 80");
            break;
    }
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "white";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <Container className = "App" fluid>
      <Row>
      <Col xl={7}>
        <div className="leftContainer" role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
          <canvas
            style={{ marginTop: "50px",background: "black",border: "1px solid black" }}
            ref={canvasRef}
            width={`${CANVAS_SIZE[0]}px`}
            height={`${CANVAS_SIZE[1]}px`}
          />
          {gameOver && <h4 style={{color:'orange'}}>GAME OVER!</h4>}
          
          <p style={{color:'white'}}>Snake Size : <strong>{snake.length}</strong></p>
          <Button variant="outline-light" onClick={startGame}>START</Button>
        </div>
      </Col>
      <Col xl={5}>
        <Instructions />
        <SnakeCharmers />
      </Col>
      </Row>
    </Container>
  );
};

export default App;
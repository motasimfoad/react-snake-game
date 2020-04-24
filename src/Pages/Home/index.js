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
  Button, Row, Col, Container, Modal, Form
} from 'react-bootstrap';
import firebase from '../../Firebase/Config';
import mp3File from '../../Assets/Audio/mkiss.mp3';
import go from '../../Assets/Audio/gameOver.mp3';
import ins1 from '../../Assets/Audio/inspiration.mp3';
import ins2 from '../../Assets/Audio/speech.mp3';
import ReactGa from 'react-ga';
import {Helmet} from "react-helmet";

let audio = new Audio(mp3File);
let audio2 = new Audio(go);
let audio3 = new Audio(ins1);
let audio4 = new Audio(ins2);

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('No Name');
  const [modalShow, setModalShow] = useState(true);
  const [rememberMe, setRememberMe] = useState();

  useInterval(() => gameLoop(), speed);
  
  ReactGa.initialize("UA-154721739-1");
  ReactGa.pageview('Home Screen');

  const resultGenerator = () =>{
    firebase.firestore().collection('ScoreBoard').add({
      mame: playerName,
      score: snake.length
    });
   
  };

  const MyVerticallyCenteredModal = (props) => {
    const [nplayerName, setNplayerName] = useState(" ");
    const [nrememberMe, setNrememberMe] = useState("false");
   
   const nana = () =>{
    setPlayerName(nplayerName);
    setRememberMe(nrememberMe);
    setModalShow(false);
   }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton />
        <Modal.Body style={{textAlign:'center'}}>
          <h4> Your Name?</h4>
          <Form onSubmit={nana}> 
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="text" placeholder="Your Name" onChange={e => setNplayerName(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Save your name?" onChange={e => setNrememberMe(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    audio2.play();
    if (rememberMe === 'false') {
      setModalShow(true);
    }
    resultGenerator();
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
      audio.play();
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
            audio3.play();
            break;
            case 10:
            setSpeed(90);
            audio4.play();
            break;
            case 15:
            setSpeed(85);
            audio3.play();
            break;
            case 20:
            setSpeed(80);
            audio4.play();
            break;
            case 25:
            setSpeed(75);
            audio3.play();
            break;
            case 30:
            setSpeed(70);
            audio4.play();
            break;
            case 40:
            setSpeed(65);
            audio3.play();
            break;
            case 45:
            setSpeed(63);
            audio4.play();
            break;
            case 50:
            setSpeed(60);
            audio3.play();
            break;
            case 60:
            setSpeed(50);
            audio4.play();
            break;
            case 70:
            setSpeed(40);
            audio3.play();
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
           <Helmet>
                <meta charSet="utf-8" />
                <title>Classical Snake Game by Motasim Foad</title>
                <link rel="canonical" href="http://motasimfoad.com/game/snake" />
                <meta name="description" content="Motasim Foad | Home - Product Manager | Project Manager | Software Engineer" />
            </Helmet>
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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
  );
};

export default App;
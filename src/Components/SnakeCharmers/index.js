import React, {useState, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import firebase from '../../Firebase/Config';
import '../SnakeCharmers/charmer.css'

function useScore(){
  const [score, setScore] = useState([]);

  useEffect(() => {
    firebase
    .firestore()
    .collection('ScoreBoard')
    .orderBy('score', 'desc')
    .onSnapshot((snapshot) =>{
      const newScore = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setScore(newScore);
    })
  }, [])
 return score;
}

function SnakeCharmers() {
  const score= useScore()
  return (
    <div>
        <h1>
          Best Snake Charmars 😜 
        </h1>
        <div className="table">
        <Table striped bordered hover variant="dark" >
            <thead>
                <tr>
                <th>Name</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
              {score.map((item) =>
                <tr key={item.id}>
                <td>{item.mame}</td>
                <td>{item.score}</td>
                </tr>
              )}
             </tbody>
        </Table>
        </div>
      </div>
  );
}

export default SnakeCharmers;
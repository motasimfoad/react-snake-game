import React, {useState, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import firebase from '../../Firebase/Config';

function useScore(){
  const [score, setScore] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('score').onSnapshot((snapshot) =>{
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
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>Name</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Mark</td>
                <td>Otto</td>
               
                </tr>
                <tr>
                <td>Jacob</td>
                <td>Thornton</td>
                
                </tr>
                <tr>
                <td>Jacob</td>
                <td>Thornton</td>
                
                </tr>
            </tbody>
        </Table>
      </div>
  );
}

export default SnakeCharmers;
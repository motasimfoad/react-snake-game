import React from 'react';
import {Table} from 'react-bootstrap'


function SnakeCharmers() {
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
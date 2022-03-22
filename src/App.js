import React, { useState } from 'react';
import Home from './Pages/Home';
import Connect from "./Pages/Connect"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [connected, setConnected] = useState(false)

  return (
    <>
      {connected ? <Home /> : <Connect />}
    </>
  );
}

export default App;

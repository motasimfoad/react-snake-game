import React, { useState } from 'react';
import Home from './Pages/Home';
import Connect from "./Pages/Connect"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)

  return (
    <>
      {connected ? <Home address={address} /> : <Connect setAddress={setAddress} setConnected={setConnected} />}
    </>
  );
}

export default App;

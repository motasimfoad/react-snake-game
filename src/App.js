import React, { useEffect, useState } from 'react';
import Home from './Pages/Home';
import Connect from "./Pages/Connect"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [provider, setProvider] = useState();
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)

  return (
    <>
      {connected ? <Home provider={provider} address={address} /> : <Connect setProvider={setProvider} setAddress={setAddress} setConnected={setConnected} />}
    </>
  );
}

export default App;

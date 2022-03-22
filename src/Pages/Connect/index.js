
import React from 'react'
import "./connect.css"
import Web3Modal from "web3modal"

const connectionConfig = {
    cacheProvider: true,
    network: "rinkeby",
}

function Connect({ setConnected }) {

    const connect = async () => {
        const web3Modal = new Web3Modal(connectionConfig)

        try {
            const provider = await web3Modal.connect();
            setConnected(true)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="connect__container">
            <button onClick={connect} className="connect__button">Connect Wallet</button>
        </div>
    )
}

export default
    Connect
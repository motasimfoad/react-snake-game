
import React from 'react'
import "./connect.css"
import Web3Modal from "web3modal"
import { ethers } from "ethers"

const connectionConfig = {
    network: "rinkeby",
}

function Connect({ setProvider, setAddress, setConnected }) {

    const connect = async () => {
        const web3Modal = new Web3Modal(connectionConfig)

        try {
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection)
            const address = await provider.getSigner().getAddress()
            setProvider(provider)
            setAddress(address)
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

export default Connect
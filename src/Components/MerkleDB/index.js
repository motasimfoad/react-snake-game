import React, { useEffect, useState } from 'react';
import { toUtf8Bytes } from "ethers/lib/utils";
import { keccak256 } from '@multiformats/sha3';
import { Button } from 'react-bootstrap';
import { fromPairs, sortBy, toPairs } from 'lodash';
import { create as createIPFS } from 'ipfs-http-client';
import cbor from 'cbor';
import { ethers } from "ethers";
import ABISnakeGameRewards from "../../Constant/ABISnakeGameRewards.json";
import ABIMerkleDB from "../../Constant/ABIMerkleDB.json"
import { GameMerkleDBAddress, SnakeGameRewardsAddress } from "../../Constant/web3";
import { toUtf8String } from 'ethers/lib/utils';
import firebase from 'firebase';

async function iterToBuffer(x) {
  const buffers = [];
  for await (const b of x) {
      buffers.push(b);
  }
//   return concat(buffers);
  // if (buffers.length === 1) return buffers[0];
  // return Buffer.concat(buffers);
}

function getMerkleLeaves() {
    return new Promise(async (resolve, reject) => {
  
    //   const client = axios.create({ baseURL: 'https://ipfs.infura.io:5001/api/v0' });
    //   const result = await client.post('/cat', undefined, {
    //       params: { arg: merkleTreeIPFS },
    //   });
    //   // const rows = result.data.map((d) => cbor.decode(d));
    //   console.debug(result.data);
  
    //   const ipfs = await createIPFS({ url: 'https://ipfs.infura.io:5001/api/v0'});
    //   console.log(merkleTreeIPFS);
    //   const result2Iter = await ipfs.cat(merkleTreeIPFS);
  
    //   const result = await iterToBuffer(result2Iter);
    //   console.log(result.toString());
    //   // const result = await iterToBuffer(result2Iter);
    //   const rowsCBOR2 = JSON.parse(result2Iter.toString('utf-8'));

        const data = [];

        const hash = (v) => Buffer.from(keccak256.encode(v)).toString('hex')
        data.push(hash('1'));
        data.push(hash('2'));
  
        resolve(data);
    });
}

function getMerkleProof() {
    // Formatting
    // const leavesHex = leaves.map(v => '0x'+v);
    // const leavesHex = leaves.map(v => Buffer.from('0x') + Buffer.from(v));
    // Generate tree/root
    // console.log(`Generating proof with tree: ${leavesHex} ${typeof leavesHex[0]}`);
    // const tree = new MerkleTree(leavesHex, keccak256, {
    //     hashLeaves: true,
    //     sortPairs: true,
    // });
    // console.log("Checking for proof in merkle tree")
    // const proof = tree.getProof(keccak256(leaf)).map(e =>  "0x" + e.data.toString("hex"));
    
    const hash = (v) => Buffer.from(keccak256.encode(Buffer.from(v))).toString('hex')

    // const proof = [];
    // proof.push(
    //     Buffer.concat([
    //         Buffer.from(hash('2'), 'hex'), // ad7...
    //         Buffer.from(hash('1'), 'hex')  // c89...
    //     ])
    // );

    return [hash('2')]

    // Buffer.from(keccak256.encode(Buffer.from('a2646e616d65782a3078373039393739373043353138313264633341303130433764303162353065306431376463373943386573636f72650a', 'hex'))).toString('hex')

    // return proof
}

// export function getEncodedLeaf(key, value, leaves) {
//   const decoded = leaves.map(v => cbor.decode(v));
//   for (let i = 0; i < leaves.length; i++) {
//     console.log(`Checking ${JSON.stringify(decoded[i][key])} at ${i} === ${value}`);
//     if (decoded[i][key] === Number(value)) {
//       console.log(`Found ${JSON.stringify(decoded[i])} at ${i}`);
//       return leaves[i];
//     }
//   }
//   console.log(`Unable to find ${[key,value]} in ${decoded}`);
//   throw Error("Unable to find leaf!");
// }

export function Web3Initialization(props) {

    const [web3, setWeb3] = useState(new ethers.providers.Web3Provider(window.ethereum));
    const [gameMerkleDB, setGameMerkleDB] = useState(new ethers.Contract(GameMerkleDBAddress, ABIMerkleDB.abi, web3));
    const [gameRewards, setGameRewards] = useState(new ethers.Contract(SnakeGameRewardsAddress, ABISnakeGameRewards.abi, web3));
    // const [merkleLeaves, setMerkleLeaves] = useState();
    const [merkleIPFSHash, setMerkleIPFSHash] = useState("QmTsRrokQy5tK6H6x9sJYYJdrEtE8yfkJGMLTEDu1ZNWj5");

    useEffect(() => {

        // if (typeof merkleTreeIPFS === 'undefined') {
        //     // Pull ipfs
        //     console.log('gettnig merkletree')
        //     gameMerkleDB.merkleTreeIPFS().then(ipfsHex => {

        //       console.log('Settings ipfs hash');
        //       setMerkleIPFSHash(ipfsHex);

        //       console.log('Getting merkle leaves');
        //       getMerkleLeaves(ipfsHex).then(leaves => setMerkleLeaves(leaves));
        //     });

        //     // Setup a state listener
        //     console.log("enabling state listener")
        //     gameMerkleDB.on("MerkleUpdate", (_, newIPFSHash) => {
        //       console.log('Updating merkle ipfs hash and leaves...');

        //       console.log('Settings ipfs hash');
        //       setMerkleIPFSHash(newIPFSHash);

        //       console.log('Getting merkle leaves');
        //       getMerkleLeaves(newIPFSHash).then(leaves => setMerkleLeaves(leaves));


                // TODO - listener for NFT holder xfer
        //     }, props)
        // }

        // console.log("firebase payload: ");
        // console.log(JSON.stringify(props.firebasePayload));

    }, [props, gameMerkleDB]);

    // For future additions -> Allow setting type of component
    return (
        <div>
          <ClaimNFTButton gameRewardContract={gameRewards} web3={web3} />
        </div>
    );

}

async function claimHighScoreNFT(gameRewardContract, signer, leaf, proof) {

  // Prep submission
  leaf = '0x31';
  proof = proof.map(v => '0x' + v);

  console.log('Calling contract:');
  console.log(leaf);
  console.log(proof);

  // Call contract  
  const contractWithSigner = gameRewardContract.connect(signer);
  await contractWithSigner.claimHighScoreToken(leaf, proof, { gasLimit: 100_000 });
}

export function ClaimNFTButton(props) {

    const [newHighScore, setNewHighScore] = useState(false);
    const [highScore, setHighScore] = useState();
    const [proof, setProof] = useState();
    const [leaf, setLeaf] = useState();
    const [currentNFTOwner, setCurrentNFTOwner] = useState()
    const [signer, setSigner] = useState(props.web3.getSigner());
    const [signerAddress, setSignerAddress] = useState();

    useEffect(() => {
        // Auto fetch / update top score
        firebase
        .firestore()
        .collection('ScoreBoard')
        .orderBy('score', 'desc')
        .limit(1)
        .onSnapshot((snapshot) => setHighScore(snapshot.docs[0].data()));
    }, []);

    useEffect(() => {
        // Set signer
        signer.getAddress().then(v => setSignerAddress(v));

        // Grab the latest NFT holder  
        props.gameRewardContract.connect(signer)
            .HIGH_SCORE_HOLDER().then(v => setCurrentNFTOwner(v));

    }, [props.web3, signer, props.gameRewardContract]);
  
    useEffect(() => {
      // If we have a new high score, save it
      if (
        typeof highScore !== 'undefined' &&
        highScore.name === signerAddress &&
        currentNFTOwner !== signerAddress
      ) {
        console.log("New high score achieved!!");
        setNewHighScore(true);
        try {
          // Attempt to build us a merkle proof
          console.log('getting encoded');
          setLeaf(cbor.encode(toSortedKeysObject(highScore)).toString('hex'));
          setProof(getMerkleProof());

          // TEMP override our merkle proof
          const hash = (v) => Buffer.from(keccak256.encode(v)).toString('hex')
          setLeaf(hash('1'));
          setProof(getMerkleProof());

        } catch (e) {
          console.log('Merkle proof unable to generate! ' + e)
        }
      }
    }, [highScore, currentNFTOwner, signerAddress]);
  
    return (
        <div style={{ marginLeft: '25%', width: '50%', textAlign: "center" }}>
            <Button  disabled={!newHighScore} variant="outline-dark" onClick={() => claimHighScoreNFT(props.gameRewardContract, signer, leaf, proof)}>CLAIM TOP SCORE NFT</Button>
            <br /><br />
            <strong>Current Holder : {currentNFTOwner}</strong>
        </div>
    );
}


export function toSortedKeysObject(item) {
    return fromPairs(sortBy(toPairs(item), 0));
  }
  

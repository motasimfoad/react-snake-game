//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMerkleDB {
    event MerkleUpdate(bytes32 merkleRoot, string merkleTreeIPFS);

    event DatabaseUpdate(string databaseIPFS);
    
    function merkleProofData(bytes calldata bytesLeaf, bytes32[] calldata path)
        external
        view
        returns (bool);

    function updateMerkle(bytes32 _merkleRoot, string memory _merkleTreeIPFS)
        external;

    function updateDB(string memory _databaseIPFS) external;
}
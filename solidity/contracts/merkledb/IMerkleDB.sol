//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMerkleDB {
    event MerkleUpdate(bytes32 merkleRoot, bytes32 merkleTreeIPFS);

    event DatabaseUpdate(bytes32 databaseIPFS);

    function merkleProofData(bytes calldata bytesLeaf, bytes32[] calldata path)
        external
        view
        returns (bool);

    function updateMerkle(bytes32 _merkleRoot, bytes32 _merkleTreeIPFS)
        external;

    function updateDB(bytes32 _databaseIPFS) external;
}

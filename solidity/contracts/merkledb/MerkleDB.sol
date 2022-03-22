//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IMerkleDB.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleDB is IMerkleDB, AccessControl {
    bytes32 public merkleRoot;
    bytes32 public merkleTreeIPFS;
    bytes32 public databaseIPFS;

    bytes32 public constant MERKLE_ROLE = keccak256("MERKLE_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MERKLE_ROLE, _msgSender());
    }

    function merkleProofData(bytes calldata bytesLeaf, bytes32[] calldata path)
        external
        view
        override
        returns (bool)
    {
        return MerkleProof.verify(path, merkleRoot, keccak256(bytesLeaf));
    }

    function updateMerkle(bytes32 _merkleRoot, bytes32 _merkleTreeIPFS)
        external
        override
    {
        require(hasRole(MERKLE_ROLE, _msgSender()));
        merkleRoot = _merkleRoot;
        merkleTreeIPFS = _merkleTreeIPFS;

        emit MerkleUpdate(merkleRoot, merkleTreeIPFS);
    }

    function updateDB(bytes32 _databaseIPFS) external override {
        require(hasRole(MERKLE_ROLE, _msgSender()));
        databaseIPFS = _databaseIPFS;

        emit DatabaseUpdate(databaseIPFS);
    }
}

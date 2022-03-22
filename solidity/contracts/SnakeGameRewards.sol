//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "./merkledb/IMerkleDB.sol";
import "./CBOR/CBORDecoding.sol";
import "./CBOR/components/ByteUtils.sol";

/**
 * @dev Documentation for contract.
 *
 */
contract SnakeGameRewards is ERC1155 {

    // These values could be in a mapping (if we expanded the contract)
    uint256 public HIGH_SCORE_TOKEN_ID = 1;
    address public HIGH_SCORE_HOLDER = address(1);
    uint256 public HIGH_SCORE = 0;

    IMerkleDB private _MERKLE_VALIDATOR;
    bytes private _ADDRESS_KEY = "name";
    bytes private _SCORE_KEY = "score";

    constructor(address merkleValidator) ERC1155("Snake game rewards contract") {

        // Set validator
        _MERKLE_VALIDATOR = IMerkleDB(merkleValidator);

        // Mint our high score token to address(1).
        _mint(address(1), HIGH_SCORE_TOKEN_ID, 1, "");
        
    }

    function claimHighScoreToken(bytes calldata proof, bytes32[] calldata path) public {

        // Verify our proof
        require(_MERKLE_VALIDATOR.merkleProofData(proof, path), "You're lying!");

        // Make sure it's the right user
        require(
            ByteUtils.parseAddr(string(CBORDecoding.decodeCBORMappingGetValue(proof, _ADDRESS_KEY)))
                 == msg.sender,
            "You are not the owner of that score!"
        );

        // Make sure it's the high score
        uint256 userScore = ByteUtils.bytesToUint256(
                    CBORDecoding.decodeCBORMappingGetValue(proof, _SCORE_KEY));
        require(
            userScore > HIGH_SCORE,
            "You don't have the high score!"
        );

        // userScore is the new high score
        HIGH_SCORE = userScore;

        // Transfer Ownership
        _safeTransferFrom(HIGH_SCORE_HOLDER, msg.sender, HIGH_SCORE_TOKEN_ID, 1, "");

        // Update record
        HIGH_SCORE_HOLDER = msg.sender;
    }

    function getAddressHash(bytes memory proof) public view returns (address, address) {
        return (
            msg.sender,
            ByteUtils.parseAddr(string(CBORDecoding.decodeCBORMappingGetValue(proof, _ADDRESS_KEY)))
        );
    }

    /* 
     * Disable our transfer functions. Tokens can only be claimed!
     **/
    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) public override {
        revert("Oh no you di'nt!");
    }
    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) public override {
        revert("Oh no you di'nt!");
    }
    function setApprovalForAll(address _operator, bool _approved) public override {
        revert("Oh no you di'nt!");
    }

}

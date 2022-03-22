//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@ensdomains/buffer/contracts/Buffer.sol";

import "./CBOREncoding.sol";
import "./CBORDecoding.sol";

/**
 * @dev Documentation for contract.
 *
 */
contract CBORTesting {

    using Buffer for Buffer.buffer;

    function testDecodeCBORMapping(bytes memory encoding) public pure returns (bytes[2][] memory decodedData) {
        return CBORDecoding.decodeCBORMapping(encoding);
    }

    function testDecodeCBORMappingGetValue(bytes memory encoding, bytes memory key) public pure returns (bytes memory value) {
        return CBORDecoding.decodeCBORMappingGetValue(encoding, key);
    }

    function testDecodeCBORPrimitive(bytes memory encoding) public pure returns (bytes[] memory decodedData) {
        return CBORDecoding.decodeCBORPrimitive(encoding);
    }


}

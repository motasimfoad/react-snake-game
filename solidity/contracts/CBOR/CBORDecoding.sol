//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./components/CBORPrimitives.sol";
import "./components/CBORUtilities.sol";
import "./components/CBORDataStructures.sol";
import "./components/ByteUtils.sol";

/**
 * @dev Solidity library built for decoding CBOR data.
 *
 */
library CBORDecoding {

    /**
     * @dev Parses an encoded CBOR Mapping into a 2d array of data
     * @param encoding Encoded CBOR bytes data
     * @return decodedData Decoded CBOR data (returned in 2d array).
     * Interpretting this bytes data from bytes to it's proper object is up
     * to the implementer.
     */
    function decodeCBORMapping(
        bytes memory encoding
    ) public pure returns(
        bytes[2][] memory decodedData
    ) {
        // Ensure we start with a mapping
        uint cursor = 0;
        (CBORUtilities.MajorType majorType, uint8 shortCount) = CBORUtilities.parseFieldEncoding(encoding[cursor]);
        require(majorType == CBORUtilities.MajorType.Map, "Object is not a mapping!");

        decodedData = CBORDataStructures.extractMapping(encoding, cursor, shortCount);

        return decodedData;
    }

    /**
     * @dev Performs linear search through data for a key
     * @param encoding Encoded CBOR bytes data
     * @param key Ke
     * @return value Decoded CBOR data as bytes.
     */
    function decodeCBORMappingGetValue(
        bytes memory encoding,
        bytes memory key
    ) public pure returns(
        bytes memory value
    ) {
        // Ensure we start with a mapping
        bytes32 keyHash = keccak256(key);

        // Decode our data
        bytes[2][] memory decodedData = decodeCBORMapping(encoding);

        // Linear Search
        for (uint keyIdx = 0; keyIdx < decodedData.length; keyIdx++)
            if (keyHash == keccak256(decodedData[keyIdx][0]))
                return decodedData[keyIdx][1];

        revert("Key not found!");
    }

    /**
     * @dev Parses an encoded CBOR dynamic bytes array into it's array of data
     * @param encoding Encoded CBOR bytes data
     * @return decodedData Decoded CBOR data (returned in structs).
     * Interpretting this bytes data from bytes to it's proper object is up
     * to the implementer.
     */
    function decodeCBORPrimitive(
        bytes memory encoding
    ) public pure returns(
        bytes[] memory decodedData
    ) {
        // Setup cursor
        uint cursor = 0;

        // Count how many items we have
        uint totalItems = CBORUtilities.scanIndefiniteItems(encoding, cursor);

        // Allocate array
        decodedData = new bytes[](totalItems);

        // Push to Array
        for (uint idx = 0; cursor < decodedData.length; idx++) {

            // See what our field looks like
            (CBORUtilities.MajorType majorType, uint8 shortCount, uint start, uint end, uint next) = CBORUtilities.parseField(encoding, cursor);

            // Save our data
            decodedData[idx] = CBORUtilities.extractValue(encoding, majorType, shortCount, start, end);

            // Update our cursor
            cursor = next;

        }

        return decodedData;
    }


}

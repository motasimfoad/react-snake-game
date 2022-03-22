//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./CBORUtilities.sol";
import "./ByteUtils.sol";

/**
 * @dev Solidity library built for decoding CBOR data.
 *
 */
library CBORDataStructures {

    bytes1 constant private BREAK_MARKER = 0xff; // 111_11111

    /**
     * @dev Parses a CBOR-encoded mapping.
     * @param encoding the dynamic bytes array to scan
     * @param cursor position where mapping starts (in bytes)
     * @param shortCount short data identifier included in field info
     * @return decodedMapping the mapping decoded
     */
    function extractMapping(
        bytes memory encoding,
        uint cursor,
        uint8 shortCount
    ) internal pure returns (
        bytes[2][] memory decodedMapping
    ) {
        // Track our mapping start
        uint mappingCursor = cursor + 1;

        // Count up how many keys we have
        uint totalItems = getDataStructureItemLength(encoding, mappingCursor, CBORUtilities.MajorType.Map, shortCount);
        require(totalItems % 2 == 0, "Invalid mapping provided!");

        // Allocate new array
        decodedMapping = new bytes[2][](totalItems / 2);

        // Pull out our data
        for (uint item = 0; item < totalItems; item++) {

            // Determine the array we're modifying
            uint arrayIdx = item % 2; // Alternates 0,1,0,1,...
            uint pair = item / 2; // 0,0,1,1,2,2..

            // See what our field looks like
            (CBORUtilities.MajorType majorType, uint8 shortCount, uint start, uint end, uint next) = CBORUtilities.parseField(encoding, mappingCursor);

            // Save our data
            decodedMapping[pair][arrayIdx] = CBORUtilities.extractValue(encoding, majorType, shortCount, start, end);

            // Update our cursor
            mappingCursor = next;
        }

        return decodedMapping;

    }

    /**
     * @dev Returns the number of items (not pairs) in a data structure.
     * @param encoding the dynamic bytes array to scan
     * @param cursor position where mapping starts (in bytes)
     * @param majorType the corresponding major type identifier
     * @param shortCount short data identifier included in field info
     * @return totalItems the number of total items in the data structure
     */
    function getDataStructureItemLength(
        bytes memory encoding,
        uint cursor,
        CBORUtilities.MajorType majorType,
        uint shortCount
    ) internal pure returns (
        uint256 totalItems
    ) {
        // Track extended count field
        uint countStart = cursor + 1;
        uint countEnd = countStart;

        // Predefined count
        if (shortCount == 31) {
            // Loop through our indefinite-length structure until break marker,
            // then short-circuit.
            totalItems = CBORUtilities.scanIndefiniteItems(encoding, cursor);
            return totalItems;
        }
        else if (shortCount < 24) {
            // Count is stored in shortCount, we can short-circuit and end early
            totalItems = shortCount;
        }
        else if (shortCount == 24) countEnd += 1;
        else if (shortCount == 25) countEnd += 2;
        else if (shortCount == 26) countEnd += 4;
        else if (shortCount == 27) countEnd += 8;
        else if (shortCount >= 28 && shortCount <= 30)
            revert("Invalid RFC Shortcode!");

        // Check if we have something we need to add up / interpret
        if (countStart != countEnd)
            totalItems = ByteUtils.bytesToUint256(
                                    ByteUtils.sliceBytesMemory(
                                        encoding, countStart, countEnd));

        // If this is a mapping, we read pairs – NOT items. Double the value
        if (majorType == CBORUtilities.MajorType.Map)
            totalItems *= 2;

        return totalItems;
    }

}

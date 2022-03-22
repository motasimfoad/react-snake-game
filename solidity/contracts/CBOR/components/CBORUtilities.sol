//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./CBORPrimitives.sol";
import "./ByteUtils.sol";

/**
 * @dev Solidity library built for decoding CBOR data.
 *
 */
library CBORUtilities {

    uint8 constant private MAJOR_BITMASK = uint8(0xe0); // 11100000
    uint8 constant private SHORTCOUNT_BITMASK = ~MAJOR_BITMASK; // 00011111
    uint8 constant private UINT_TRUE = 1;
    uint8 constant private UINT_FALSE = 0;
    bytes1 constant private BREAK_MARKER = 0xff; // 111_11111

    // Major Data Types
    enum MajorType {
        UnsignedInteger,
        NegativeInteger,
        ByteString,
        TextString,
        Array,
        Map,
        Semantic,
        Special
    }

    /**
     * @dev Intelligently parses supported CBOR-encoded types.
     * @param encoding the dynamic bytes array
     * @param cursor position where type starts (in bytes)
     * @return majorType the type of the data sliced
     * @return shortCount the corresponding shortCount for the data
     * @return start position where the data starts (in bytes)
     * @return end position where the data ends (in bytes)
     * @return next position to find the next field (in bytes)
     */
    function parseField(
        bytes memory encoding,
        uint cursor
    ) internal pure returns (
        MajorType majorType,
        uint8 shortCount,
        uint start,
        uint end,
        uint next
    ) {
        // Parse field encoding
        (majorType, shortCount) = parseFieldEncoding(encoding[cursor]);

        // Switch case on data type

        // Integers (Major Types: 0,1)
        if (majorType == MajorType.UnsignedInteger ||
            majorType == MajorType.NegativeInteger)
            (start, end) = CBORPrimitives.parseInteger(cursor, shortCount);

        // Strings (Major Types: 2,3)
        else if (majorType == MajorType.ByteString ||
            majorType == MajorType.TextString)
            (start, end) = CBORPrimitives.parseString(encoding, cursor, shortCount);

        // Semantic Tags (Major Type: 6)
        else if (majorType == MajorType.Semantic)
            (start, end) = CBORPrimitives.parseSemantic(encoding, cursor, shortCount);

        // Special / Floats (Major Type: 7)
        else if (majorType == MajorType.Special)
            (start, end) = CBORPrimitives.parseSpecial(cursor, shortCount);

        // Unsupported types
        else
            revert("Unimplemented Major Type!");

        // `end` is non-inclusive
        next = end;
        // If our data exists at field definition, nudge the cursor one
        if (start == end) next++;

        return (majorType, shortCount, start, end, next);

    }

    /**
     * @dev Extracts the data from CBOR-encoded type.
     * @param encoding the dynamic bytes array to slice from
     * @param majorType the correspondnig data type being used
     * @param start position where type starts (in bytes)
     * @param end position where the type ends (in bytes)
     * @return value a cloned dynamic bytes array with the data value
     */
    function extractValue(
        bytes memory encoding,
        MajorType majorType,
        uint8 shortCount,
        uint start,
        uint end
    ) internal pure returns (
        bytes memory value
    ) {
        if (start != end) {
            // If we have a payload/count, slice it and short-circuit
            value = ByteUtils.sliceBytesMemory(encoding, start, end);
            return value;
        }

        if (majorType == MajorType.Special) {
            // Special means data is encoded INSIDE field
            if (shortCount == 21)
                // True
                value = abi.encodePacked(UINT_TRUE);

            else if (
                // Falsy
                shortCount == 20 || // false
                shortCount == 22 || // null
                shortCount == 23    // undefined
            )
                value = abi.encodePacked(UINT_FALSE);

            return value;

        }

        // Data IS the shortCount (<24)
        value = abi.encodePacked(shortCount);

        return value;

    }

    /**
     * @dev Parses a CBOR byte into major type and short count.
     * See https://en.wikipedia.org/wiki/CBOR for reference.
     * @param fieldEncoding the field to encode
     * @return majorType corresponding data type (see RFC8949 section 3.2)
     * @return shortCount corresponding short count (see RFC8949 section 3)
     */
    function parseFieldEncoding(
        bytes1 fieldEncoding
    ) internal pure returns (
        MajorType majorType,
        uint8 shortCount
    ) {
        uint8 data = uint8(fieldEncoding);
        majorType = MajorType((data & MAJOR_BITMASK) >> 5);
        shortCount = data & SHORTCOUNT_BITMASK;
    }

    /**
     * @dev Counts encoded items until a BREAK or the end of the bytes
     * @param encoding the encoded bytes array
     * @param cursor where to start scanning
     * @return totalItems total items found in encoding
     */
    function scanIndefiniteItems(
        bytes memory encoding,
        uint cursor
    ) internal pure returns (
        uint totalItems
    ) {
        // Loop through our indefinite-length number until break marker
        for ( ; cursor < encoding.length; totalItems++) {
            // See where the next field starts
            (/*majorType*/, /*shortCount*/, /*start*/, /*end*/, uint next) = CBORUtilities.parseField(encoding, cursor);

            // TODO - check for nested structs

            // Update our cursor
            cursor = next;

            if (cursor < encoding.length && encoding[cursor] == BREAK_MARKER)
                break;
        }

    }


}

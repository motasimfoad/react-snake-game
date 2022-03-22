//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./CBORUtilities.sol";
import "./ByteUtils.sol";

/**
 * @dev Solidity library built for decoding CBOR data.
 *
 */
library CBORPrimitives {

    bytes1 constant private BREAK_MARKER = 0xff; // 111_11111

    uint8 private constant TAG_TYPE_BIGNUM = 2;
    uint8 private constant TAG_TYPE_NEGATIVE_BIGNUM = 3;

    /**
     * @dev Parses a CBOR-encoded integer and determines where data start/ends.
     * @param cursor position where integer starts (in bytes)
     * @param shortCount short data identifier included in field info
     * @return dataStart byte position where data starts
     * @return dataEnd byte position where data ends
     */
    function parseInteger(
        /*bytes memory encoding,*/
        uint cursor,
        uint shortCount
    ) internal pure returns (
        uint dataStart,
        uint dataEnd
    ) {
        // Save our starting cursor (data can exist here)
        dataStart = cursor;

        // Marker for how far count goes
        uint dataLength = 0;

        // Predetermined sizes
        // if (shortCount < 24); // do nothing! (start byte = end byte)
        if (shortCount == 24) dataLength = 1;
        else if (shortCount == 25) dataLength = 2;
        else if (shortCount == 26) dataLength = 4;
        else if (shortCount == 27) dataLength = 8;
        else if (shortCount >= 28)
            revert("Invalid RFC Shortcode!");

        // Finalize data start/end points
        if (dataLength != 0)
            // Nudge cursor if data extends past field
            dataStart++;
        // Cursor starts on the next byte (non-inclusive)
        dataEnd = dataStart + dataLength;

    }

    /**
     * @dev Parses a CBOR-encoded strings and determines where data start/ends.
     * @param encoding the dynamic bytes array to scan
     * @param cursor position where integer starts (in bytes)
     * @param shortCount short data identifier included in field info
     * @return dataStart byte position where data starts
     * @return dataEnd byte position where data ends
     */
    function parseString(
        bytes memory encoding,
        uint cursor,
        uint shortCount
    ) internal pure returns (
        uint dataStart,
        uint dataEnd
    ) {
        // Marker for how far count goes
        uint countStart = cursor + 1;
        uint countEnd = countStart;

        // These count lengths are (mostly) universal to all major types:
        if (shortCount == 0) {
            // Count is stored in shortCount, we can short-circuit and end early
            dataStart = cursor;
            dataEnd = dataStart;
            return (dataStart, dataEnd);
        }
        else if (shortCount < 24) {
            // Count is stored in shortCount, we can short-circuit and end early
            dataStart = cursor + 1;
            dataEnd = dataStart + shortCount;
            return (dataStart, dataEnd);
        }
        else if (shortCount == 24) countEnd += 1;
        else if (shortCount == 25) countEnd += 2;
        else if (shortCount == 26) countEnd += 4;
        else if (shortCount == 27) countEnd += 8;
        else if (shortCount >= 28 && shortCount <= 30)
            revert("Invalid RFC Shortcode!");
        else if (shortCount == 31)
            // Loop through our indefinite-length number until break marker
            for ( ; cursor < encoding.length; ) {
                cursor++;
                countEnd++; // Non-inclusive means we want to include the marker
                if (encoding[cursor] == BREAK_MARKER)
                    break;
            }

        // Calculate the value of the count
        uint256 count = ByteUtils.bytesToUint256(
                            ByteUtils.sliceBytesMemory(
                                encoding, countStart, countEnd));

        // Data starts on the next byte (non-inclusive)
        // Empty strings cannot exist at this stage (short-circuited above)
        dataStart = countEnd;
        dataEnd = countEnd + count;
    }

    /**
     * @dev Parses a CBOR-encoded tag type (big nums).
     * @param encoding the dynamic bytes array to scan
     * @param cursor position where integer starts (in bytes)
     * @param shortCount short data identifier included in field info
     * @return dataStart byte position where data starts
     * @return dataEnd byte position where data ends
     */
    function parseSemantic(
        bytes memory encoding,
        uint cursor,
        uint shortCount
    ) internal pure returns (
        uint dataStart,
        uint dataEnd
    ) {
        // Check for BigNums
        if (shortCount == TAG_TYPE_BIGNUM ||
            shortCount == TAG_TYPE_NEGATIVE_BIGNUM) {
            // String-encoded bignum will start at next byte
            cursor++;
            // Forward request to parseString (bignums are string-encoded)
            (, shortCount) = CBORUtilities.parseFieldEncoding(encoding[cursor]);
            (dataStart, dataEnd) = parseString(encoding, cursor, shortCount);
        }

        else
            revert("Unsupported Tag Type!");

        return (dataStart, dataEnd);
    }

    /**
     * @dev Parses a CBOR-encoded special type.
     * @param cursor position where integer starts (in bytes)
     * @param shortCount short data identifier included in field info
     * @return dataStart byte position where data starts
     * @return dataEnd byte position where data ends
     */
    function parseSpecial(
        /*bytes memory encoding,*/
        uint cursor,
        uint shortCount
    ) internal pure returns (
        uint dataStart,
        uint dataEnd
    ) {

        // Save our starting cursor (data can exist here)
        dataStart = cursor;

        // Marker for how far count goes
        uint dataLength = 0;

        // Predetermined sizes
        if (shortCount < 20)
            revert("Invalid RFC Shortcode!");
        // 20-23 are false, true, null, and undefined (respectively)
        else if (shortCount == 25) dataLength = 2;
        else if (shortCount == 26) dataLength = 4;
        else if (shortCount == 27) dataLength = 8;
        else if (shortCount >= 28)
            revert("Invalid RFC Shortcode!");

        // Finalize data start/end points
        if (dataLength != 0)
            // Nudge cursor if data extends past field
            dataStart++;
        // Cursor starts on the next byte (non-inclusive)
        dataEnd = dataStart + dataLength;

    }

}

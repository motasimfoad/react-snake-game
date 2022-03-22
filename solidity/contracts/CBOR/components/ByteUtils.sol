//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Helpful byte utility functions.
 *
 */
library ByteUtils {

    /**
     * @dev Slices a dynamic bytes object from start:end (non-inclusive end)
     * @param start position to start byte slice (inclusive)
     * @param end position to end byte slice (non-inclusive)
     * @return slicedData dynamic sliced bytes object
     */
    function sliceBytesMemory(
        bytes memory data,
        uint start,
        uint end
    ) internal pure returns (
        bytes memory slicedData
    ) {
        // Slice our bytes
        for (uint i = start; i < end; i++)
            slicedData = abi.encodePacked(slicedData, data[i]);
    }

    /**
     * @dev Converts a dynamic bytes array to a uint256
     * @param data dynamic bytes array
     * @return value calculated uint256 value
     */
    function bytesToUint256(
        bytes memory data
    ) internal pure returns (
        uint256 value
    ) {
        for (uint i = 0; i < data.length; i++)
            value += uint8(data[i])*(2**(8*(data.length-(i+1))));
    }

    // Stolen from oraclize
    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

}

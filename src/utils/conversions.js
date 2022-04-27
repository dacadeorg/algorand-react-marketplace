import {ALGORAND_DECIMALS} from "./constants";
import BigNumber from "bignumber.js";

// format a wallet address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 5, address.length);
}

// big number to string
export const formatBigNumber = (num) => {
    if (!num) return
    let bigNumber = new BigNumber(num)
    return bigNumber.shiftedBy(-ALGORAND_DECIMALS).toFixed(3);
}

// string to big number
export const inputToBigNumber = (str) => {
    if (!str) return
    let bigNumber = new BigNumber(str)
    return bigNumber.shiftedBy(ALGORAND_DECIMALS);
}

// Convert an integer to an Uint8Array
export function intToUint8Array(i) {
    return Uint8Array.of(
        (i & 0xff000000) >> 24,
        (i & 0x00ff0000) >> 16,
        (i & 0x0000ff00) >> 8,
        (i & 0x000000ff) >> 0);
}
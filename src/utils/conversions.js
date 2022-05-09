import {ALGORAND_DECIMALS} from "./constants";
import BigNumber from "bignumber.js";

export const base64ToUTF8String = (base64String) => {
    return Buffer.from(base64String, 'base64').toString("utf-8")
}

export const utf8ToBase64String = (utf8String) => {
    return Buffer.from(utf8String, 'utf8').toString('base64')
}

// Truncate is done in the middle to allow for checking of first and last chars simply to ensure correct address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 5, address.length);
}

// Amounts in microAlgos (e.g. 10500) are shown as algos (e.g. 10.5) in the frontend
export const microAlgosToString = (num) => {
    if (!num) return
    let bigNumber = new BigNumber(num)
    return bigNumber.shiftedBy(-ALGORAND_DECIMALS).toFixed(3);
}

// Convert an amount entered as algos (e.g. 10.5) to microAlgos (e.g. 10500)
export const stringToMicroAlgos = (str) => {
    if (!str) return
    let bigNumber = new BigNumber(str)
    return bigNumber.shiftedBy(ALGORAND_DECIMALS).toNumber();
}
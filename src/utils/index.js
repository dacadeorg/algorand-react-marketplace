import {ERC20_DECIMALS} from "./constants";

// format a wallet address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
}

// convert from big number
export const formatBigNumber = (num) => {
    if (!num) return
    return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
}
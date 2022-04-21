import algosdk from "algosdk";

const ERC20_DECIMALS = 18;
export {ERC20_DECIMALS};

// local (release) accounts
// Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
const account1Mnemonic = "cement century practice recipe soccer unknown biology reflect switch protect ahead hip maple path capital charge verb pause design diagram jewel blast fan absorb seed"
const account2Mnemonic = "someone position liquid damage clog canyon cabin eternal fever episode cry gospel tennis chicken damp traffic puppy other ring clay bacon blade vague abandon tomorrow"
export const account1 = algosdk.mnemonicToSecretKey(account1Mnemonic)
export const account2 = algosdk.mnemonicToSecretKey(account2Mnemonic)
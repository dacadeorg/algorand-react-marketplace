import algosdk from "algosdk";

const ERC20_DECIMALS = 18;
export { ERC20_DECIMALS };

// local (release) accounts
// Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
const account1Mnemonic ="office stand february neck invite day bird smart across tired average garage shine such abandon top sail midnight first deal unit enter dynamic above liar"
const account2Mnemonic = "someone position liquid damage clog canyon cabin eternal fever episode cry gospel tennis chicken damp traffic puppy other ring clay bacon blade vague abandon tomorrow"
export const account1 = algosdk.mnemonicToSecretKey(account1Mnemonic)
export const account2 = algosdk.mnemonicToSecretKey(account2Mnemonic)
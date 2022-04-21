// local (release) accounts
// Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
import algosdk from "algosdk";

const account1Mnemonic = "soft critic tent attract goat rally veteran parrot switch glide august sudden case accuse poverty orchard inside bottom true nasty hope list tourist ability scorpion"
const account2Mnemonic = "someone position liquid damage clog canyon cabin eternal fever episode cry gospel tennis chicken damp traffic puppy other ring clay bacon blade vague abandon tomorrow"
export const account1 = algosdk.mnemonicToSecretKey(account1Mnemonic)
export const account2 = algosdk.mnemonicToSecretKey(account2Mnemonic)
import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

const ERC20_DECIMALS = 18;
export {ERC20_DECIMALS};

// local (release) accounts
// Get mnemonics from existing accounts with ./sandbox goal account export --address [account_address]
const localAccountMnemonic = "save ahead tired island slush caught medal tilt amused dream decade situate wear stuff flower mixture future car law must hungry dismiss ketchup abstract share"
export const localAccount = algosdk.mnemonicToSecretKey(localAccountMnemonic)

//export const ENVIRONMENT = "testnet"
export const ENVIRONMENT = "release"

const environment = {
    // Local private network
    release: {
        algodToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        algodServer: 'http://localhost',
        algodPort: 4001,
        indexerToken: "",
        indexerServer: "http://localhost",
        indexerPort: 8980,
    },
    // Testnet using purestake API
    testnet: {
        algodToken: {
            "X-API-Key": "nUNvDv87ov6WwXYAXCtouVXQ568FJoG7MeRpSKD7",
        },
        algodServer: "https://testnet-algorand.api.purestake.io/ps2",
        algodPort: "",
        indexerToken: {
            "X-API-Key": "nUNvDv87ov6WwXYAXCtouVXQ568FJoG7MeRpSKD7",
        },
        indexerServer: "https://testnet-algorand.api.purestake.io/idx2",
        indexerPort: "",
    }
}

const config = environment[ENVIRONMENT]

export const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort)

export const indexerClient = new algosdk.Indexer(config.indexerToken, config.indexerServer, config.indexerPort);

export const myAlgoConnect = new MyAlgoConnect();

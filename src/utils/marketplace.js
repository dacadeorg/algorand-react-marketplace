import algosdk from "algosdk";
import {account1} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/marketplace_approval.teal";
import clearStateProgram from "!!raw-loader!../contracts/marketplace_clear_state.teal";


// See https://developer.algorand.org/tutorials/building-and-deploying-voting-smart-contract-with-pyteal-and-react/#5-full-deployment-code-with-javascript-sdk=

// TODO move elsewhere
//SMART CONTRACT DEPLOYMENT
// declare application state storage (immutable)
const localInts = 0;
const localBytes = 0;
const globalInts = 24; //# 4 for setup + 20 for choices. Use a larger number for more choices.
const globalBytes = 3;

// TODO move elsewgere
// client
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = 'http://localhost';
const algodPort = 4001;
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const indexer_token = "";
const indexer_server = "http://localhost";
const indexer_port = 8980;

const indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);

// Compile Program
const compileProgram = async (client, programSource) => {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await client.compile(programBytes).do();
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

// TODO maybe simplify
function intToArray(i) {
    return Uint8Array.of(
        (i & 0xff000000) >> 24,
        (i & 0x00ff0000) >> 16,
        (i & 0x0000ff00) >> 8,
        (i & 0x000000ff) >> 0);
}

// ADD PRODUCT: create application transaction
export const createProductAction = async (account, product) => {
    try {
        console.log("Adding product...")

        let params = await client.getTransactionParams().do()
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;

        // Compile programs
        const compiledApprovalProgram = await compileProgram(client, approvalProgram)
        const compiledClearStateProgram = await compileProgram(client, clearStateProgram)

        // Build note and app args
        let note = new TextEncoder().encode("Products_Example_1");
        let name = new TextEncoder().encode(product.name);
        let price = intToArray(product.price)
        let image = new TextEncoder().encode(product.image);
        let appArgs = [name, price, image]


        // Create transaction
        let txn = algosdk.makeApplicationCreateTxnFromObject({
            from: account.addr,
            suggestedParams: params,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            approvalProgram: compiledApprovalProgram,
            clearProgram: compiledClearStateProgram,
            numLocalInts: localInts,
            numLocalByteSlices: localBytes,
            numGlobalInts: globalInts,
            numGlobalByteSlices: globalBytes,
            note: note,
            appArgs: appArgs
        });

        // Transaction ID
        let txId = txn.txID().toString();

        // Sign the transaction
        let signedTxn = txn.signTxn(account.sk);
        console.log("Signed transaction with txID: %s", txId);

        // Submit the transaction
        await client.sendRawTransaction(signedTxn).do()

        // Wait for transaction to be confirmed
        let confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);

        // Get the completed Transaction
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

        // Display results
        let transactionResponse = await client.pendingTransactionInformation(txId).do()
        let appId = transactionResponse['application-index'];
        console.log("Created new app-id: ", appId);
        return appId

    } catch (err) {
        console.log(err)
    }
}

// BUY PRODUCT
export const buyProductAction = async (account, product, count) => {
    try {
        console.log("Buying product...");
        let params = await client.getTransactionParams().do();
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;

        // Build app args
        let buyArg = new TextEncoder().encode("buy")
        let countArg = intToArray(count);
        let appArgs = [buyArg, countArg]

        // Buy transaction
        let buyTxn = algosdk.makeApplicationCallTxnFromObject({
            from: account.addr,
            appIndex: product.appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            suggestedParams: params,
            appArgs: appArgs
        })
        console.log(buyTxn)

        // Spend transaction
        let spendTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: account.addr,
            to: product.owner,
            amount: product.price * count,
            note: new TextEncoder().encode("buy"),
            suggestedParams: params
        })

        // Group transaction
        algosdk.assignGroupID([buyTxn, spendTxn])

        // Sign the transactions
        let signedBuyTxn = buyTxn.signTxn(account.sk);
        console.log("Signed buy transaction");
        let signedSpendTxn = spendTxn.signTxn(account.sk);
        console.log("Signed spend transaction");

        // Submit the transaction
        let tx = await client.sendRawTransaction([signedBuyTxn, signedSpendTxn]).do()

        // Wait for transaction to be confirmed
        let confirmedTxn = await algosdk.waitForConfirmation(client, tx.txId, 4);

        // Get the completed Transaction
        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    } catch (err) {
        console.log("err", err)
    }
}

// DELETE - Not working yet
const deleteProductAction = async (sender, index) => {
    try {
        console.log("Deleting application...");

        let params = await client.getTransactionParams().do();
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;

        // Delete transaction
        let txn = algosdk.makeApplicationDeleteTxn(sender, params, index);
        //let txn = algosdk.makeApplicationDeleteTxnFromObject({
        //    from: sender,
        //    suggestedParams: params,
        //    appIndex: index,
        //});

        // Transaction ID
        let txId = txn.txID().toString();

        // Sign the transaction
        let signedTxn = txn.signTxn(account1.sk);
        console.log("Signed transaction with txID: %s", txId);

        // Submit the transaction
        await client.sendRawTransaction(signedTxn).do()

        // Wait for transaction to be confirmed
        const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
        console.log("confirmed" + confirmedTxn)

        // Get the completed Transaction
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

        // Display results
        let transactionResponse = await client.pendingTransactionInformation(txId).do();
        let appId = transactionResponse['application-index'];
        console.log("Deleted app-id: ", appId);
    } catch (err) {
        console.log(err)
    }
}

class Product {
    constructor(appId, name, price, owner, image, sold) {
        this.appId = appId;
        this.name = name;
        this.price = price;
        this.owner = owner;
        this.image = image;
        this.sold = sold;
    }
}

export const getProductsAction = async () => {
    try {
        let note = new TextEncoder().encode("Products_Example_1");
        let transactionInfo = await indexerClient.searchForTransactions()
            .notePrefix(note).do();

        let products = []
        for (const transaction of transactionInfo.transactions) {
            let appId = transaction["created-application-index"]
            let product = await getApplication(appId)
            if (product) {
                products.push(product)
            }
        }
        return products
    } catch (err) {
        console.log(err);
    }
}

const getApplication = async (appId) => {
    try {
        let response = await indexerClient.lookupApplications(appId).do();
        let globalState = response.application.params["global-state"]

        let owner = response.application.params.creator
        let name = ""
        let image = ""
        let price = 0
        let sold = 0

        const getField = (fieldName, globalState) => {
            return globalState.find(state => {
                return state.key === Buffer.from(fieldName, 'utf8').toString('base64');
            })
        }

        if (getField("NAME", globalState) !== undefined) {
            let field = getField("NAME", globalState).value.bytes
            name = Buffer.from(field, 'base64').toString("utf-8")
        } else {
            return null;
        }

        if (getField("PRICE", globalState) !== undefined) {
            price = getField("PRICE", globalState).value.uint
        } else {
            return null;
        }

        if (getField("IMAGE", globalState) !== undefined) {
            let field = getField("IMAGE", globalState).value.bytes
            image = Buffer.from(field, 'base64').toString("utf-8")
        } else {
            return null;
        }

        if (getField("SOLD", globalState) !== undefined) {
            sold = getField("SOLD", globalState).value.uint
        } else {
            return null;
        }

        return new Product(appId, name, price, owner, image, sold)
    } catch (err) {
        console.log(err);
    }
}

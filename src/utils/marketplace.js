import algosdk from "algosdk";
import {
    algodClient,
    marketplaceNote,
    ENVIRONMENT,
    indexerClient,
    localAccount,
    marketplaceAddress,
    myAlgoConnect,
    numGlobalBytes,
    numGlobalInts,
    numLocalBytes,
    numLocalInts, minRound
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/marketplace_approval.teal";
import clearProgram from "!!raw-loader!../contracts/marketplace_clear.teal";
import {base64ToUTF8String, utf8ToBase64String} from "./conversions";

class Product {
    constructor(name, image, description, price, sold, appId, owner) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.price = price;
        this.sold = sold;
        this.appId = appId;
        this.owner = owner;
    }
}

// Compile smart contract in .teal format to program
const compileProgram = async (programSource) => {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await algodClient.compile(programBytes).do();
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

// CREATE PRODUCT: ApplicationCreateTxn
export const createProductAction = async (senderAddress, product) => {
    console.log("Adding product...")

    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Compile programs
    const compiledApprovalProgram = await compileProgram(approvalProgram)
    const compiledClearProgram = await compileProgram(clearProgram)

    // Build note to identify transaction later and required app args as Uint8Arrays
    let note = new TextEncoder().encode(marketplaceNote);
    let name = new TextEncoder().encode(product.name);
    let image = new TextEncoder().encode(product.image);
    let description = new TextEncoder().encode(product.description);
    let price = algosdk.encodeUint64(product.price);

    let appArgs = [name, image, description, price]

    // Create ApplicationCreateTxn
    let appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
        from: senderAddress,
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: compiledApprovalProgram,
        clearProgram: compiledClearProgram,
        numLocalInts: numLocalInts,
        numLocalByteSlices: numLocalBytes,
        numGlobalInts: numGlobalInts,
        numGlobalByteSlices: numGlobalBytes,
        note: note,
        appArgs: appArgs
    });

    // Create PaymentTxn
    let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: marketplaceAddress,
        amount: 0,
        suggestedParams: params
    })

    let txnArray = [appCreateTxn, paymentTxn]

    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray)
    for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

    let tx = null;

    // Sign & submit the transaction
    if (ENVIRONMENT === "localSandbox") {
        let signedAppCreateTxn = appCreateTxn.signTxn(localAccount.sk);
        console.log("Signed create transaction");
        let signedPaymentTxn = paymentTxn.signTxn(localAccount.sk);
        console.log("Signed pay transaction");
        tx = await algodClient.sendRawTransaction([signedAppCreateTxn, signedPaymentTxn]).do();
    } else {
        let signedTxn = await myAlgoConnect.signTransaction(txnArray.map(txn => txn.toByte()));
        console.log("Signed group transaction");
        tx = await algodClient.sendRawTransaction(signedTxn.map(txn => txn.blob)).do();
    }

    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

    // Notify about completion
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // Get created application id and notify about completion
    let transactionResponse = await algodClient.pendingTransactionInformation(tx.txId).do();
    let appId = transactionResponse['application-index'];
    console.log("Created new app-id: ", appId);
    return appId;
}

// BUY PRODUCT: Group transaction consisting of ApplicationCallTxn and PaymentTxn
export const buyProductAction = async (senderAddress, product, count) => {
    console.log("Buying product...");

    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Build required app args as Uint8Array
    let buyArg = new TextEncoder().encode("buy")
    let countArg = algosdk.encodeUint64(count);
    let appArgs = [buyArg, countArg]

    // Create ApplicationCallTxn
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: senderAddress,
        appIndex: product.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        suggestedParams: params,
        appArgs: appArgs
    })

    // Create PaymentTxn
    let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: product.owner,
        amount: product.price * count,
        suggestedParams: params
    })

    let txnArray = [appCallTxn, paymentTxn]

    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray)
    for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

    let tx = null;
    // Sign & submit the group transaction
    if (ENVIRONMENT === "localSandbox") {
        let signedAppCallTxn = appCallTxn.signTxn(localAccount.sk);
        console.log("Signed buy transaction");
        let signedPaymentTxn = paymentTxn.signTxn(localAccount.sk);
        console.log("Signed spend transaction");
        tx = await algodClient.sendRawTransaction([signedAppCallTxn, signedPaymentTxn]).do();
    } else {
        let signedTxn = await myAlgoConnect.signTransaction(txnArray.map(txn => txn.toByte()));
        console.log("Signed group transaction");
        tx = await algodClient.sendRawTransaction(signedTxn.map(txn => txn.blob)).do();
    }

    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

    // Notify about completion
    console.log("Group transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
}

// DELETE PRODUCT: ApplicationDeleteTxn
export const deleteProductAction = async (senderAddress, index) => {
    console.log("Deleting application...");

    let params = await algodClient.getTransactionParams().do();
    params.fee = algosdk.ALGORAND_MIN_TX_FEE;
    params.flatFee = true;

    // Create ApplicationDeleteTxn
    let txn = algosdk.makeApplicationDeleteTxnFromObject({
        from: senderAddress, suggestedParams: params, appIndex: index,
    });

    // Get transaction ID
    let txId = txn.txID().toString();

    // Sign & submit the transaction
    if (ENVIRONMENT === "localSandbox") {
        let signedTxn = txn.signTxn(localAccount.sk);
        console.log("Signed transaction with txID: %s", txId);
        await algodClient.sendRawTransaction(signedTxn).do();
    } else {
        let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
        console.log("Signed transaction with txID: %s", txId);
        await algodClient.sendRawTransaction(signedTxn.blob).do();
    }

    // Wait for transaction to be confirmed
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    // Notify about completion
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // Get application id of deleted application and notify about completion
    let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
    let appId = transactionResponse['txn']['txn'].apid;
    console.log("Deleted app-id: ", appId);
}

// GET PRODUCTS: Use indexer
export const getProductsAction = async () => {
    console.log("Fetching products...");
    let note = new TextEncoder().encode(marketplaceNote);
    let encodedNote = Buffer.from(note).toString("base64");
    let products = []

    // Step 1: Get transactions for marketplaceAddress
    let marketplaceTransactionInfo = await indexerClient.lookupAccountTransactions(marketplaceAddress).minRound(minRound).do();
    // Get unique sender addresses
    let senderAddresses = new Set(marketplaceTransactionInfo.transactions.map(t => t.sender))


    for (const senderAddress of senderAddresses) {
        // Step 2: For every sender get transactions
        let senderTransactionInfo = await indexerClient.lookupAccountTransactions(senderAddress).minRound(minRound).do();
        let relevantTransaction = senderTransactionInfo.transactions.filter(t => t.note === encodedNote)
        for (const transaction of relevantTransaction) {
            let appId = transaction["created-application-index"]
            if (appId) {
                // Step 3: Get each application by application id
                let product = await getApplication(appId)
                if (product) {
                    products.push(product)
                }
            }
        }
    }
    console.log("Products fetched.")
    return products
}

const getApplication = async (appId) => {
    try {
        // 1. Get application by appId
        let response = await indexerClient.lookupApplications(appId).includeAll(true).do();
        let globalState = response.application.params["global-state"]

        // 2. Parse fields of response and return product
        let owner = response.application.params.creator
        let name = ""
        let image = ""
        let description = ""
        let price = 0
        let sold = 0

        const getField = (fieldName, globalState) => {
            return globalState.find(state => {
                return state.key === utf8ToBase64String(fieldName);
            })
        }

        if (getField("NAME", globalState) !== undefined) {
            let field = getField("NAME", globalState).value.bytes
            name = base64ToUTF8String(field)
        } else return null;

        if (getField("IMAGE", globalState) !== undefined) {
            let field = getField("IMAGE", globalState).value.bytes
            image = base64ToUTF8String(field)
        } else return null;

        if (getField("DESCRIPTION", globalState) !== undefined) {
            let field = getField("DESCRIPTION", globalState).value.bytes
            description = base64ToUTF8String(field)
        } else return null;

        if (getField("PRICE", globalState) !== undefined) {
            price = getField("PRICE", globalState).value.uint
        }

        if (getField("SOLD", globalState) !== undefined) {
            sold = getField("SOLD", globalState).value.uint
        } else return null;

        // Return product
        return new Product(name, image, description, price, sold, appId, owner)
    } catch (err) {
        return null;
    }
}

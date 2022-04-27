import React, {useEffect, useState} from "react";
import Cover from "./components/Cover";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import './App.css';
import Wallet from "./components/wallet/Wallet";
import WalletConnect from "@walletconnect/client";
import {apiGetAccountAssets} from "./utils/dapp";
import {Container, Nav} from "react-bootstrap";

import MyAlgoConnect from "@randlabs/myalgo-connect";
import Products from "./components/marketplace/Products";
import {algodClient, ENVIRONMENT, localAccount, myAlgoConnect} from "./utils/constants";
import {Notification} from "./components/utils/Notifications";


const App = function AppWrapper() {

    const [connector, setConnector] = useState(null);

    // selected address
    const [address, setAddress] = useState(ENVIRONMENT === "release" ? localAccount.addr: null);
    const [name, setName] = useState(null);
    const [balance, setBalance] = useState(0);
    const [accounts, setAccounts] = useState([]);

    const [assets, setAssets] = useState([]);

    const [chain, setChain] = useState([]);

    const [fetching, setFetching] = useState(false);
    const [connected, setConnected] = useState(false);

    const walletConnectInit = async () => {
        // bridge url
        const bridge = "https://bridge.walletconnect.org";

        // create new connector
        const connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});


        // check if already connected
        if (!connector.connected) {
            console.log("creating session")
            // create new session
            await connector.createSession();
        }

        await setConnector(connector);

    };


    useEffect(() => {
        try {
            if (!connector) {
                //console.log("no connector")
                return;
            }

            console.log("connector available", {connector})

            connector.on("session_update", async (error, payload) => {
                console.log(`connector.on("session_update")`);

                if (error) {
                    throw error;
                }

                const {accounts} = payload.params[0];
                onSessionUpdate(accounts);
            });

            connector.on("connect", (error, payload) => {
                console.log(`connector.on("connect")`);

                if (error) {
                    throw error;
                }

                onConnect(payload);
            });

            connector.on("disconnect", (error, payload) => {
                console.log(`connector.on("disconnect")`);

                if (error) {
                    throw error;
                }

                onDisconnect();
            });

            if (connector.connected) {
                const {accounts} = connector;
                const address = accounts[0];
                setConnected(true)
                setAccounts(accounts)
                setAddress(address)
                onSessionUpdate(accounts);
            }
            setConnector(connector)
        } catch (e) {
            console.log({e})
        }
    }, [connector])

    const killSession = async () => {
        if (connector) {
            connector.killSession();
        }
        resetApp();
    };

    const chainUpdate = (newChain) => {

        setChain(newChain)
        getAccountAssets()
    };

    const resetApp = async () => {

        setConnector(null)
        setAddress(null)
        setAssets(null)
        setAccounts(null)
        setChain(null)
        setFetching(null)
        setConnected(null)
    };

    const onConnect = async (payload) => {
        console.log("connected!!!")
        const {accounts} = payload.params[0];
        const address = accounts[0];
        console.log({address})

        setConnected(true)
        setAccounts(accounts)
        setAddress(address)
        console.log({address})
        // getAccountAssets();
    };

    const onDisconnect = async () => {
        resetApp();
    };

    const onSessionUpdate = async (accounts) => {
        const address = accounts[0];
        setAddress(address)
        setAccounts(accounts)
        // await getAccountAssets();

    };

    const getAccountAssets = async () => {

        setFetching(true)
        try {
            // get account balances
            const assets = await apiGetAccountAssets(chain, address);

            setAssets(assets)

        } catch (error) {
            console.error({error});
            console.warn("Failed to fetch assets. Please connect to the Algorand blockchain")

        } finally {
            setFetching(false)
        }
    };


    // My Algo wallet
    const GetAccounts = async () => {
        try {
            // @ts-ignore
            // const r = await AlgoSigner.accounts({
            //   ledger: "TestNet",
            // });
            const myAlgoWallet = new MyAlgoConnect();
            const r = await myAlgoWallet.connect({shouldSelectOneAccount: true});

            console.log(r);

            const _address = r[0].address;
            setAddress(_address);

            // fetch assets for this address
            // const assets = await fetchAssets(r[0].address);
            //
            // setAssets(assets ?? []);
            return;
            // return JSON.stringify(r, null, 2);
        } catch (e) {
            console.error(e);
            return;
            // return JSON.stringify(e, null, 2);
        }
    };


    const ConnectAlgoSigner = async () => {
        try {

            const accounts = await myAlgoConnect.connect();
            console.log(accounts);

            const _wallets = accounts.map(account => account.address);
            const _names = accounts.map(account => account.name);

            setAccounts(_wallets);
            setAddress(_wallets[0]);
            setName(_names[0]);

        } catch (e) {
            console.error(e);
            console.log(`Couldn't find MyAlgo wallet!`);
            console.log("failed to connect ")
        }
    };


    useEffect(() => {
        (async () => {
            fetchBalance();
        })();
    }, [address]);

    const fetchBalance = async () => {
        if (!address) return;

        let accountInfo = await algodClient.accountInformation(address).do();
        //console.log(accountInfo);

        const _balance = accountInfo.amount;
        setBalance(_balance);
    }


    return (
        <>

            <Notification/>

            {address ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>

                            {/*display user wallet*/}
                            <Wallet
                                address={address} name={name} amount={balance} destroy={killSession} symbol={"ALGO"}
                            />
                        </Nav.Item>
                    </Nav>
                    <main>
                        <Products address={address} fetchBalance={fetchBalance}/>
                    </main>
                </Container>

            ) : (
                <Cover name={"Algorand React Marketplace"}
                       coverImg={"https://blog.bitnovo.com/wp-content/uploads/2021/07/Que-es-Algorand-ALGO.jpg"}
                       connect={ConnectAlgoSigner}/>

            )}
        </>
    );
}

export default App;

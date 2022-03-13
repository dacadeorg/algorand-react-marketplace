import React, {useState, useEffect} from "react";
import Cover from "./components/Cover";
import Counter from "./components/Counter";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import './App.css';
import Wallet from "./components/wallet";
import WalletConnect from "@walletconnect/client";
import { apiGetAccountAssets } from "./utils/dapp";
const App = function AppWrapper() {

    const [connector, setConnector] = useState(null);
    const [address, setAddress] = useState(null);

    const [assets, setAssets] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [chain, setChain] = useState([]);

    const [fetching, setFetching] = useState(false);
    const [connected, setConnected] = useState(false);

    // useEffect(() => {
    //     // Check if connection is already established
    //     if (connector) {
    //         subscribeToEvents(connector);
    //       setConnected(true)
    //         if (!connector.connected) {
    //             connector.createSession();
    //         }
    //         const { accounts } = connector;
    //         onSessionUpdate(accounts)
    //     }
    // }, [connector]);
    //

    const walletConnectInit = async () =>   {
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



    useEffect(()=>{
        try {
            if (!connector) {
                console.log("no connector")
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
        }catch (e) {
            console.log({e})
        }
    },[connector])

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
    //
    // public toggleModal = () =>
    //     this.setState({
    //         showModal: !this.state.showModal,
    //         pendingSubmissions: [],
    //     });


    return (
        <div className="App">
            <header className="App-header">
                {connected ?
                    <Wallet address={address} amount={0} destroy={killSession} symbol={"ALGO"}/>
                    :
                    <Cover name={"Algorand React Marketplace"} coverImg={"https://blog.bitnovo.com/wp-content/uploads/2021/07/Que-es-Algorand-ALGO.jpg"} connect={walletConnectInit}/>
                }

            </header>
        </div>
    );
}

export default App;

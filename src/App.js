import React, {useEffect, useState} from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import {Container, Nav} from "react-bootstrap";
import Products from "./components/marketplace/Products";
import {algodClient, ENVIRONMENT, localAccount, myAlgoConnect} from "./utils/constants";
import {Notification} from "./components/utils/Notifications";


const App = function AppWrapper() {

    const initAddress = ENVIRONMENT === "release" ? localAccount.addr : null;
    const [address, setAddress] = useState(initAddress);
    const [name, setName] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        (async () => {
            fetchBalance();
        })();
    }, [address]);

    const connectWallet = async () => {
        myAlgoConnect.connect()
            .then(accounts => {
                const _account = accounts[0];
                setAddress(_account.address);
                setName(_account.name);
            }).catch(error => {
            console.log('Could not connect MyAlgo wallet');
            console.error(error);
        })
    };

    const disconnect = () => {
        setAddress(initAddress);
        setName(null);
        setBalance(null);
    };

    const fetchBalance = async () => {
        if (!address) return;

        let accountInfo = await algodClient.accountInformation(address).do();

        const _balance = accountInfo.amount;
        setBalance(_balance);
    };


    return (
        <>
            <Notification/>
            {address ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            <Wallet
                                address={address}
                                name={name}
                                amount={balance}
                                disconnect={disconnect}
                                symbol={"ALGO"}
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
                       connect={connectWallet}/>
            )}
        </>
    );
}

export default App;

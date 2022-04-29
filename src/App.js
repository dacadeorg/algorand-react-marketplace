import React, {useState} from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import {Container, Nav} from "react-bootstrap";
import Products from "./components/marketplace/Products";
import {algodClient, ENVIRONMENT, localAccount, myAlgoConnect} from "./utils/constants";
import {Notification} from "./components/utils/Notifications";


const App = function AppWrapper() {

    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [balance, setBalance] = useState(0);

    const fetchBalance = async (accountAddress) => {
        let accountInfo = await algodClient.accountInformation(accountAddress).do();
        const _balance = accountInfo.amount;
        setBalance(_balance);
    };

    const connectWallet = async () => {
        if (ENVIRONMENT === "release") {
            const _address = localAccount.addr
            setAddress(_address);
            fetchBalance(_address);
        } else {
            myAlgoConnect.connect()
                .then(async accounts => {
                    const _account = accounts[0];
                    await setAddress(_account.address);
                    setName(_account.name);
                    fetchBalance(_account.address);
                }).catch(error => {
                console.log('Could not connect to MyAlgo wallet');
                console.error(error);
            })
        }
    };

    const disconnect = () => {
        setAddress(null);
        setName(null);
        setBalance(null);
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

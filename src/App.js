import React, {useState} from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import {Container, Nav} from "react-bootstrap";
import Products from "./components/marketplace/Products";
import {algodClient, ENVIRONMENT, localAccount, myAlgoConnect} from "./utils/constants";
import {Notification} from "./components/utils/Notifications";
import coverImg from "./assets/img/sandwich.jpg"

const App = function AppWrapper() {

    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [balance, setBalance] = useState(0);

    const fetchBalance = async (accountAddress) => {
        algodClient.accountInformation(accountAddress).do()
            .then(accountInfo => {
                const _balance = accountInfo.amount;
                setBalance(_balance);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const connectWallet = async () => {
        if (ENVIRONMENT === "localSandbox") {
            const _address = localAccount.addr
            setAddress(_address);
            fetchBalance(_address);
        } else {
            myAlgoConnect.connect()
                .then(accounts => {
                    const _account = accounts[0];
                    setAddress(_account.address);
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
                <Cover name={"Street Food"} coverImg={coverImg} connect={connectWallet}/>
            )}
        </>
    );
}

export default App;

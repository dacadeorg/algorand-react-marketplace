import React from 'react';
import {Dropdown, Spinner, Stack} from 'react-bootstrap';
import {formatBigNumber, truncateAddress} from '../utils/conversions';
import Identicon from './utils/Identicon'
import PropTypes from "prop-types";

const Wallet = ({address, name, amount, symbol, disconnect}) => {
    if (address) {
        return (
            <>
                <Dropdown>
                    <Dropdown.Toggle variant="light" align="end" id="dropdown-basic"
                                     className="d-flex align-items-center border rounded-pill py-1">
                        {amount ? (
                            <>
                                {formatBigNumber(amount)}
                                <span className="ms-1"> {symbol}</span>
                            </>
                        ) : (
                            <Spinner animation="border" size="sm" className="opacity-25"/>
                        )}
                        <Identicon address={address} size={28} className="ms-2 me-1"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-lg border-0">
                        <Dropdown.Item href={`https://testnet.algoexplorer.io/address/${address}`}
                                       target="_blank">
                            <Stack direction="horizontal" gap={2}>
                                <i className="bi bi-person-circle fs-4"/>
                                <span className="font-monospace">{name || truncateAddress(address)}</span>
                            </Stack>
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item as="button" className="d-flex align-items-center" onClick={() => {
                            disconnect();
                        }}>
                            <i className="bi bi-box-arrow-right me-2 fs-4"/>
                            Disconnect
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
    return null;
};

Wallet.propTypes = {
    address: PropTypes.string,
    name: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
    disconnect: PropTypes.func
};

export default Wallet;

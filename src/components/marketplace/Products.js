import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import {Row} from "react-bootstrap";

import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyProductAction, createProductAction, deleteProductAction, getProductsAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";

const Products = ({address}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        //setLoading(true);
        getProductsAction(address)
            .then(products => {
                if (products) {
                    setProducts(products);
                }
            })
            .catch(error => {
                console.log({error});
            })
            .finally(_ => {
                //setLoading(false);
            });
    };

    const createProduct = async (data) => {
        setLoading(true);
        createProductAction(address, data)
            .then(_ => {
                toast(<NotificationSuccess text="Product added successfully."/>);
                getProducts();
            })
            .catch(error => {
                console.log({error});
                toast(<NotificationError text="Failed to create a product."/>);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    const buyProduct = async (product) => {
        setLoading(true);
        buyProductAction(address, product, 1)
            .then(_ => {
                toast(<NotificationSuccess text="Product bought successfully"/>);
                getProducts();
            })
            .catch(error => {
                console.log({error})
                toast(<NotificationError text="Failed to purchase product."/>);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    const deleteProduct = async (product) => {
        setLoading(true);
        deleteProductAction(address, product.appId)
            .then(_ => {
                getProducts();
            })
            .catch(error => {
                console.log({error})
                toast(<NotificationError text="Failed to delete product."/>);
            })
            .finally(_ => {
                toast(<NotificationSuccess text="Product deleted successfully"/>);
                setLoading(false);
            });
    };

    return (
        <>
            {!loading ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="fs-4 fw-bold mb-0">Street Food</h1>
                        <AddProduct createProduct={createProduct}/>
                    </div>
                    <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                        {
                            products.map((product, index) => (
                                <Product
                                    address={address}
                                    product={product}
                                    buyProduct={buyProduct}
                                    deleteProduct={deleteProduct}
                                    key={index}
                                />
                            ))
                        }
                    </Row>
                </>
            ) : (
                <Loader/>
            )}
        </>
    );
};

Products.propTypes = {
    address: PropTypes.string.isRequired,
};

export default Products;

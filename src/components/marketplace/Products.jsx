import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyProductAction, createProductAction, deleteProductAction, getProductsAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Products = ({address, fetchBalance}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProducts = async () => {
        try {
            setLoading(true);
            const products = await getProductsAction()
            if (!products) {
                return
            }

            setProducts(products);
        } catch (e) {
            console.log({e})
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const createProduct = async (data) => {
        try {
            setLoading(true);
            await createProductAction(address, data);
            toast(<NotificationSuccess text="Product added successfully."/>);
            await getProducts();
            await fetchBalance(address);
        } catch (error) {
            console.log(error);
            toast(<NotificationError text={error?.message || "Failed to create a product."}/>);
        }finally {
            setLoading(false);
        }
    };

    const buyProduct = async (product, count) => {
        try {
            setLoading(true);
            await buyProductAction(address, product, count);
            toast(<NotificationSuccess text="Product bought successfully"/>);
            getProducts();
            fetchBalance(address);
        } catch (error) {
            console.log(error)
            toast(<NotificationError text="Failed to purchase product."/>);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (product) => {
        try {
            setLoading(true);
            await deleteProductAction(address, product.appId);
            toast(<NotificationSuccess text="Product deleted successfully"/>);
            getProducts();
            fetchBalance(address);
        } catch (error) {
            console.log(error)
            toast(<NotificationError text="Failed to delete product."/>);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Street Food</h1>
                <AddProduct createProduct={createProduct}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {products.map((product, index) => (
                        <Product
                            address={address}
                            product={product}
                            buyProduct={buyProduct}
                            deleteProduct={deleteProduct}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Products.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Products;

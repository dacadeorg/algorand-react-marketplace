import React from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, Stack} from "react-bootstrap";

const Product = ({address, product, buyProduct, deleteProduct}) => {
    const {id, name, price, owner, image, sold} =
        product;

    return (
        <Col key={id}>
            <Card className=" h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary text-truncate">{owner}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className=" ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <div className="d-flex flex-row gap-4">
                        <Button
                            variant="outline-dark"
                            onClick={() => buyProduct(product)}
                            className="w-100 py-3"
                        >
                            Buy for {price} ALGO
                        </Button>
                        { product.owner === address &&
                            <Button
                                variant="outline-dark"
                                onClick={() => deleteProduct(product)}
                                className="w-100 py-3"
                            >
                                Delete product
                            </Button>
                        }
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

Product.propTypes = {
    address: PropTypes.string.isRequired,
    product: PropTypes.instanceOf(Object).isRequired,
    buyProduct: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired
};

export default Product;

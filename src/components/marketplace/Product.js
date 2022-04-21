import React from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, Stack} from "react-bootstrap";

const Product = ({product, buyProduct}) => {
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
                    <img src={image} alt={name} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Button
                        variant="outline-dark"
                        onClick={() => buyProduct(product)}
                        className="w-100 py-3"
                    >
                        Buy for {price} ALGO
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

Product.propTypes = {
    product: PropTypes.instanceOf(Object).isRequired,
    buyProduct: PropTypes.func.isRequired,
};

export default Product;

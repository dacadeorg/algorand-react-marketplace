import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Stack,
  FloatingLabel,
} from "react-bootstrap";
import { microAlgosToString, truncateAddress } from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const Property = ({
  address,
  property,
  buyProperty,
  deleteProperty,
  rateProperty,
}) => {
  const { title, image, location, price, bought, appId, owner } = property;

  const [rate, setRate] = useState(property.rate);

  const ratedIcon = () => {
    if (property.rate > 5) {
      return "bi bi-star-fill";
    } else if (property.rate > 0) {
      return "bi bi-star-half";
    } else {
      return "bi bi-star";
    }
  };

  return (
    <Col key={appId}>
      <Card className="h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Identicon size={28} address={owner} />
            <Badge
              bg={bought === 1 ? "success" : "secondary"}
              className="ms-auto"
            >
              {bought === 1 ? "Bought" : "Available"}
            </Badge>
          </Stack>
        </Card.Header>
        <div className="ratio ratio-4x3">
          <img src={image} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1">{location}</Card.Text>
          <Form className="d-flex align-content-stretch flex-row gap-2">
            <Button
              variant={bought === 1 ? "outline-success" : "outline-dark"}
              onClick={() => buyProperty(property)}
              className={bought === 1 ? "w-75 py-3" : "btn w-75 py-3"}
              disabled={bought === 1}
            >
              {bought === 1
                ? "Bought"
                : `Buy for ${microAlgosToString(price)} ALGO`}
            </Button>
            {property.owner === address && bought !== 1 && (
              <Button
                variant="outline-danger"
                onClick={() => deleteProperty(property)}
                className="btn"
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
            {bought === 1 && (
              <>
                <FloatingLabel
                  controlId="inputCount"
                  label={property.rate > 0 ? "Rated" : "Rate"}
                  className="w-25"
                >
                  <Form.Control
                    type="number"
                    value={rate}
                    min="1"
                    max="10"
                    readOnly={property.rate > 0 || property.buyer !== address}
                    onChange={(e) => {
                      setRate(Number(e.target.value));
                    }}
                  />
                </FloatingLabel>
                <Button
                  variant="outline-secondary"
                  onClick={() => rateProperty(property, rate)}
                  disabled={property.rate > 0 || property.buyer !== address}
                >
                  <i className={ratedIcon()}></i>
                </Button>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

Property.propTypes = {
  address: PropTypes.string.isRequired,
  property: PropTypes.instanceOf(Object).isRequired,
  buyProperty: PropTypes.func.isRequired,
  deleteProperty: PropTypes.func.isRequired,
  rateProperty: PropTypes.func.isRequired,
};

export default Property;

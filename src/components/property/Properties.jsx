import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProperty from "./AddProperty";
import Property from "./Property";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import {
  createPropertyAction,
  getPropertiesAction,
  deletePropertyAction,
  buyPropertyAction,
  ratePropertyAction,
} from "../../utils/propertycontract";

const Properties = ({ address, fetchBalance }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProperties = async () => {
    setLoading(true);
    toast(<NotificationSuccess text="Fetching properties" />);
    getPropertiesAction()
      .then((products) => {
        if (products) {
          setProperties(products);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getProperties();
  }, []);

  const createProperty = async (data) => {
    setLoading(true);
    createPropertyAction(address, data)
      .then(() => {
        toast(<NotificationSuccess text="Propery added successfully." />);
        getProperties();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create a product." />);
        setLoading(false);
      });
  };

  const buyProperty = async (property) => {
    setLoading(true);
    buyPropertyAction(address, property)
      .then(() => {
        toast(<NotificationSuccess text="Property bought successfully" />);
        getProperties();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to purchase property." />);
        setLoading(false);
      });
  };

  const rateProperty = async (property, rate) => {
    setLoading(true);
    ratePropertyAction(address, property, rate)
      .then(() => {
        toast(<NotificationSuccess text="Property rated successfully" />);
        getProperties();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to rate property." />);
        setLoading(false);
      });
  };

  const deleteProperty = async (property) => {
    setLoading(true);
    deletePropertyAction(address, property.appId)
      .then(() => {
        toast(<NotificationSuccess text="Property deleted successfully" />);
        getProperties();
        fetchBalance(address);
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete property." />);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold mb-0">Properties</h1>
        <AddProperty createProperty={createProperty} />
      </div>
      <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
        <>
          {properties.map((data, index) => (
            <Property
              address={address}
              property={data}
              buyProperty={buyProperty}
              deleteProperty={deleteProperty}
              rateProperty={rateProperty}
              key={index}
            />
          ))}
        </>
      </Row>
    </>
  );
};

Properties.propTypes = {
  address: PropTypes.string.isRequired,
  fetchBalance: PropTypes.func.isRequired,
};

export default Properties;

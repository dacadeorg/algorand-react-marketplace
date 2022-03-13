import React from "react";
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PropTypes from "prop-types";
import {truncateAddress} from "../../utils";
import {Button} from "react-bootstrap";

const Address = ({ address }) => {
  if (address) {
    return (
        <Button variant="outline-secondary" className="rounded-pill">

          {/* format user wallet address to a more suitable display */}
          {truncateAddress(address)}
        </Button>
    );
  }

  return null;
};

Address.propTypes = {
  address: PropTypes.string,
};

Address.defaultProps = {
  address: "",
};

export default Address;

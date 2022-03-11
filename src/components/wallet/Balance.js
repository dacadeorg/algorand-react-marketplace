import React from "react";
import PropTypes from "prop-types";
import {formatBigNumber} from "../../utils";

const Balance = ({ amount, symbol }) => {
  if (amount) {
    return (
      <div>

        <span id="balance">

        {/* convert big number from wei */}
            ${formatBigNumber(amount)}
        </span>
          <span className="">{symbol}</span>
      </div>
    );
  }

  return null;
};

Balance.propTypes = {
  symbol: PropTypes.string,
  amount: PropTypes.number,
};

Balance.defaultProps = {
  amount: 0,
  symbol: "",
};

export default Balance;

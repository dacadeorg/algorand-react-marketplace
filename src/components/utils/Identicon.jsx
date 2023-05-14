import Identicon from 'react-identicons';

import PropTypes from "prop-types";

const AddressIdenticon = ({size, address, ...rest}) => (
    <div {...rest} style={{width: `${size}px`, height: `${size}px`}}>
         <Identicon string={address} size={30}  />
    </div>
);

Identicon.propTypes = {
    size: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired
};

export default AddressIdenticon;

import Jazzicon from "react-jazzicon";
import PropTypes from "prop-types";
import Products from "../marketplace/Products";

const Identicon = ({size, address, ...rest}) => (
    <div {...rest} style={{width: `${size}px`, height: `${size}px`}}>
        <Jazzicon diameter={size} seed={parseInt(address.slice(2, 10), 16)}/>
    </div>
);

Products.propTypes = {
    size: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired
};

export default Identicon;
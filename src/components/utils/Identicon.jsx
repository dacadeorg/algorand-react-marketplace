import Jazzicon from "react-jazzicon";

export default function Identicon({size, address, ...rest}) {

    return (
        <div {...rest} style={{width: `${size}px`, height: `${size}px`}}>
            <Jazzicon diameter={size} seed={parseInt(address.slice(2, 10), 16)}/>
        </div>
    )
}
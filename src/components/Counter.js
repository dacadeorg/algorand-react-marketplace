import {Card, Button} from "react-bootstrap"
import Wallet from "./wallet";
const Counter =({address, amount, symbol, destroy}) => {

    return(

        <Card bg={"black"} className="text-center" style={{ width: '40%' }}>
            <Card.Header>
                <Wallet
                    address={address}
                    amount={amount}
                    symbol={symbol}
                    destroy={destroy}
                />

            </Card.Header>
            <Card.Body>
                <Card.Title>Count </Card.Title>
                {/*<Card.Text>*/}
                {/*    With supporting text below as a natural lead-in to additional content.*/}
                {/*</Card.Text>*/}
                <br/>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" >
                        Increase Count
                    </Button>
                    <Button variant="outline-danger" disabled={false} size="lg">
                       Decrease Count
                    </Button>
                </div>
                {/*<Button variant="primary">Decrease Count</Button>*/}
            </Card.Body>
        </Card>
    )
}

export default Counter

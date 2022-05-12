from pyteal import *

marketplace_note = Bytes("tutorial-marketplace:uv1")
marketplace_address = Addr("ZBPYEPTNDALN272CYRPU7PSFMXP6QZPVCYF32TPTATUKD57CN4UCSMJOYI")


class Product:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION")
        price = Bytes("PRICE")
        sold = Bytes("SOLD")

    class AppMethods:
        buy = Bytes("buy")

    def application_creation(self):
        create_txn = Gtxn[0]
        pay_txn = Gtxn[1]
        return Seq([
            # Check group
            Assert(Global.group_size() == Int(2)),
            Assert(create_txn.sender() == pay_txn.sender()),
            # Check payment transaction
            Assert(pay_txn.amount() == Int(0)),
            Assert(pay_txn.receiver() == marketplace_address),
            # Check create transaction
            Assert(create_txn.application_args.length() == Int(4)),
            Assert(create_txn.note() == marketplace_note),
            Assert(Btoi(create_txn.application_args[3]) > Int(0)),
            # Create application
            App.globalPut(self.Variables.name, create_txn.application_args[0]),
            App.globalPut(self.Variables.image, create_txn.application_args[1]),
            App.globalPut(self.Variables.description, create_txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(create_txn.application_args[3])),
            App.globalPut(self.Variables.sold, Int(0)),
            Approve()
        ])

    def buy(self):
        call_txn = Gtxn[0]
        pay_txn = Gtxn[1]
        count = call_txn.application_args[1]
        return Seq([
            # Check group
            Assert(Global.group_size() == Int(2)),
            Assert(pay_txn.sender() == call_txn.sender()),
            # Check payment transaction
            Assert(pay_txn.type_enum() == TxnType.Payment),
            Assert(pay_txn.receiver() == Global.creator_address()),
            Assert(pay_txn.amount() == App.globalGet(self.Variables.price) * Btoi(count)),
            # Update state
            App.globalPut(self.Variables.sold, App.globalGet(self.Variables.sold) + Btoi(count)),
            Approve()
        ])

    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.application_creation()],
            [Txn.on_completion() == OnComplete.DeleteApplication, self.application_deletion()],
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()]
        )

    def approval_program(self):
        return self.application_start()

    def clear_program(self):
        return Return(Int(1))

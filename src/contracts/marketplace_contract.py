from pyteal import *


class Product:
    class Variables:
        name = Bytes("NAME")
        price = Bytes("PRICE")
        image = Bytes("IMAGE")
        sold = Bytes("SOLD")

    class AppMethods:
        buy = "buy"

    def application_start(self):
        return Cond(
            [Txn.application_id() == Int(0), self.app_initialization()],
            [Txn.on_completion() == OnComplete.DeleteApplication, self.app_deletion()],
            [Txn.application_args[0] == Bytes(self.AppMethods.buy), self.buy(count=Txn.application_args[1])],
        )

    def app_initialization(self):
        return Seq([
            Assert(Txn.application_args.length() == Int(3)),
            Assert(Txn.note() == Bytes("marketplace-tutorial:uv1")),
            Assert(Btoi(Txn.application_args[1]) > Int(0)),
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[1])),
            App.globalPut(self.Variables.image, Txn.application_args[2]),
            App.globalPut(self.Variables.sold, Int(0)),
            Approve()
        ])

    def buy(self, count):
        valid_number_of_transactions = Global.group_size() == Int(2)

        valid_payment_to_seller = And(
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == Global.creator_address(),
            Gtxn[1].amount() == App.globalGet(self.Variables.price) * Btoi(count),
            Gtxn[1].sender() == Gtxn[0].sender(),
        )

        can_buy = And(valid_number_of_transactions,
                      valid_payment_to_seller)

        update_state = Seq([
            App.globalPut(self.Variables.sold, App.globalGet(self.Variables.sold) + Btoi(count)),
            Approve()
        ])

        return If(can_buy).Then(update_state).Else(Reject())

    def approval_program(self):
        return self.application_start()

    def app_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

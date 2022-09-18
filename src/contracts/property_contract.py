from pyteal import *


class PropertyContract:
    class Variables:
        title = Bytes("TITLE")  # ByteSlice
        image = Bytes("IMAGE")  # ByteSlice
        location = Bytes("LOCATION")  # ByteSlice
        bought = Bytes("BOUGHT")  # Uint64 0 means false, 1 means true
        owner = Bytes("OWNER")  # ByteSlice
        buyer = Bytes("BUYER")  # ByteSlice
        rate = Bytes("RATE")  # ByteSlice
        price = Bytes("PRICE")  # Uint64

    class AppMethods:
        buy = Bytes("buy")
        rate = Bytes("rate")

    # to create a new property listed for adoption
    def application_creation(self):
        return Seq([
            # The number of arguments attached to the transaction should be exactly 5.
            Assert(Txn.application_args.length() == Int(5)),

            # The note attached to the transaction must be "tutorial-marketplace:uv1", which we define to be the note that marks a product within our marketplace
            Assert(Txn.note() == Bytes("property-dapp:uv2")),

            # Store the transaction arguments into the applications's global's state
            App.globalPut(self.Variables.title, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.location, Txn.application_args[2]),
            App.globalPut(self.Variables.bought, Int(0)),
            App.globalPut(self.Variables.rate, Int(0)),
            App.globalPut(self.Variables.owner, Txn.application_args[3]),
            App.globalPut(self.Variables.buyer, Txn.application_args[3]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[4])),

            Approve(),
        ])

    def buy(self):

        scratch_owner = ScratchVar(TealType.bytes)

        scratch_owner.store(App.globalGet(self.Variables.owner))

        Assert(
            And(
                    # The number of transactions within the group transaction must be exactly 2.
                    # first one being the adopt function and the second being the payment transactions
                    Global.group_size() == Int(2),

                    # check that the buy call is made ahead of the payment transaction
                    Txn.group_index() == Int(0),

                    # Txn.applications[0] is a special index denoting the current app being interacted with
                    Txn.applications.length() == Int(1),

                    # The number of arguments attached to the transaction should be exactly 2.
                    Txn.application_args.length() == Int(2),

                    # Check that current owner is not the transaction sender as that's redundant
                    scratch_owner.load() != Txn.application_args[1],
            ),
        )

        # checks for second transaction
        Assert(
            And(
                # The second transaction of the group must be the payment transaction.
                Gtxn[1].type_enum() == TxnType.Payment,
                # The receiver of the payment should be the creator of the app
                Gtxn[1].receiver() == Global.creator_address(),
                # The payment amount should match the product's price multiplied by the number of products bought
                Gtxn[1].amount() == App.globalGet(self.Variables.price),
                # The sender of the payment transaction should match the sender of the smart contract call transaction.
                Gtxn[1].sender() == Gtxn[0].sender(),
            )
        )

        return Seq([
            App.globalPut(self.Variables.bought, Int(1)),
            App.globalPut(self.Variables.buyer, Txn.application_args[1]),
            Approve()
        ])

    # rate the property owner
    def rate(self):

        scratch_buyer = ScratchVar(TealType.bytes)

        scratch_buyer.store(App.globalGet(self.Variables.buyer))

        Assert(
            And(
                    # The number of transactions within the group transaction must be exactly 2.
                    # first one being the adopt function and the second being the payment transactions
                    Global.group_size() == Int(1),

                    # Txn.applications[0] is a special index denoting the current app being interacted with
                    Txn.applications.length() == Int(1),

                    # The number of arguments attached to the transaction should be exactly 2.
                    Txn.application_args.length() == Int(2),

                    # Check that buyer is the one rating the property
                    scratch_buyer.load() == Gtxn[0].sender(),
            ),
        )

        return Seq([
            App.globalPut(self.Variables.rate, Btoi(Txn.application_args[1])),
            Approve()
        ])

    # To delete a property.
    def application_deletion(self):
        return Return(Txn.sender() == Global.creator_address())

    # Check transaction conditions
    def application_start(self):
        return Cond(
            # checks if the application_id field of a transaction matches 0.
            # If this is the case, the application does not exist yet, and the application_creation() method is called
            [Txn.application_id() == Int(0), self.application_creation()],
            # If the the OnComplete action of the transaction is DeleteApplication, the application_deletion() method is called
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            # if the first argument of the transaction matches the AppMethods.buy value, the buy() method is called.
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
            [Txn.application_args[0] == self.AppMethods.rate, self.rate()],
        )

    # The approval program is responsible for processing all application calls to the contract.
    def approval_program(self):
        return self.application_start()

    # The clear program is used to handle accounts using the clear call to remove the smart contract from their balance record.
    def clear_program(self):
        return Return(Int(1))
from pyteal import *

def approval_program():
    price = Bytes("price")  # uint64
    on_creation = Seq([
        App.globalPut(Bytes("Id"), Bytes("1")),
        App.globalPut(Bytes("owner"), Txn.sender()),
        App.globalPut(Bytes("name"), Bytes("Apple")),
        App.globalPut(Bytes("image"), Bytes("google.com")),
        App.globalPut(Bytes("description"), Bytes("apple is a fruit")),
        App.globalPut(Bytes("location"), Bytes("Abuja")),
        App.globalPut(Bytes("price"), App.globalGet(price)),
        App.globalPut(Bytes("sold"), Int(0)),
        App.globalPut(Bytes("price"), Int(0)),
        Return(Int(1))
    ])


    on_buy = Seq([
        Assert(And(
            Txn.type_enum() == TxnType.Payment,
            Txn.close_remainder_to() == Global.zero_address(),
            Txn.rekey_to() == Global.zero_address(),
            Global.group_size() == Int(1),
            Txn.fee() <= Global.min_txn_fee() * Int(2),
        )),
        Return(Int(1))
    ])

    return on_buy

with open('dacade.teal', 'w') as f:
    compiled = compileTeal(approval_program(), Mode.Application)
    f.write(compiled)

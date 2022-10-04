from pyteal import *

from property_contract import PropertyContract

if __name__ == "__main__":
    approval_program = PropertyContract().approval_program()
    clear_program = PropertyContract().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program, Mode.Application, version=6)
    print(compiled_approval)
    with open("src/contracts/property_contract_approval.teal", "w") as teal:
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("src/contracts/property_contract_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()

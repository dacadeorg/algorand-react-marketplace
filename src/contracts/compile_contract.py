from pyteal import *

from marketplace_contract import Product

if __name__ == "__main__":
    program = Product().approval_program()
    compiled = compileTeal(program, Mode.Application, version=6)
    print(compiled)
    with open("src/contracts/marketplace_approval.teal", "w") as teal:
        teal.write(compiled)
        teal.close()

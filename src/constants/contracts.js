export const approvalProgram = `
#pragma version 6
txn ApplicationID
int 0
==
bnz main_l6
txna ApplicationArgs 0
byte "buy"
==
bnz main_l3
err
main_l3:
global GroupSize
int 2
==
gtxn 1 TypeEnum
int pay
==
gtxn 1 Amount
byte "PRICE"
app_global_get
txna ApplicationArgs 1
btoi
*
==
&&
gtxn 1 Sender
gtxn 0 Sender
==
&&
&&
bnz main_l5
int 0
return
main_l5:
byte "SOLD"
byte "SOLD"
app_global_get
txna ApplicationArgs 1
btoi
+
app_global_put
int 1
return
main_l6:
txn NumAppArgs
int 3
==
assert
txn Note
byte "Products_Example_1"
==
assert
byte "OWNER"
txna ApplicationArgs 0
app_global_put
byte "PRICE"
txna ApplicationArgs 1
btoi
app_global_put
byte "NAME"
txna ApplicationArgs 2
app_global_put
int 1
return
`

export const clearStateProgram = `
#pragma version 6
int 1
`
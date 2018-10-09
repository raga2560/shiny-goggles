bitcoin = require('bitcoinjs-lib');
bitcoincontrol = require('bitcoincontrol');
compositekeylib = bitcoincontrol.compositekeylib;

/*

This example uses bitcoin testnet

*/

var uidkeypair = bitcoin.ECPair.fromWIF(
 'cRgnQe1TQngWfnsLo9YUExBjx3iVKNHu2XogVF8JhHiKQTJVQHhk',
 bitcoin.networks.testnet);


var tmpKeypair = bitcoin.ECPair.fromWIF(
'cRgnQe1TQngWfnsLo9YUExBjx3iVKNHu2ZfiRcUivATuojDdzdus',
 bitcoin.networks.testnet);


var onepubKey = tmpKeypair.getPublicKeyBuffer();

var uidpubKey = uidkeypair.getPublicKeyBuffer();

// This is the address of http://bitcoinfaucet.uo1.net/ to return testnet bitcoins
var addresstosend = '2Mso8V2XzMK2aC9Woqbgn8jLyQ2t1ozPqnE';

var toscriptPubKey =  bitcoin.address.toOutputScript(addresstosend, bitcoin.networks.testnet);

console.log("The address to which all spent transactions is sent = \n"+ addresstosend);


console.log("The uidpubKey used = "+ onepubKey.toString('hex'));
		  
console.log(".........First set of data ........");
console.log(".........Buffer code address creation ........");
console.log("The buffer code used = "+ onepubKey.toString('hex'));

var addr1 = compositekeylib.getBufControlCodeAddress(onepubKey, uidpubKey,  bitcoin.networks.testnet);
console.log("Buffer code address = "+addr1);

console.log(".........Second set of data ........");
console.log(".........String code address creation ........");
var strcode = "hello";
console.log("The string code used = "+ strcode);
var addr2 = compositekeylib.getStrControlCodeAddress(strcode,  uidpubKey, bitcoin.networks.testnet);
console.log("String code address = "+addr2);


console.log(".........Third set of data ........");
console.log(".........Custom contract address creation ........");
var pubKeyHash = bitcoin.crypto.hash160(onepubKey) ; 

var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

console.log("Custom contract input = "+onepubKey.toString('hex'));
console.log("Custom contract redeemScript = "+redeemScript.toString('hex'));

var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

console.log("scriptpubkey = "+scriptPubKey.toString('hex'));
var address = bitcoin.address.fromOutputScript(scriptPubKey, bitcoin.networks.testnet)



var addr3 = compositekeylib.getCustomContractAddress(redeemScript,  uidpubKey, bitcoin.networks.testnet);
console.log("Custom contract address = "+addr3);

console.log(".......Spending from first address  ........");
// Example to unlock using buffer code address
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = tmpKeypair.getPublicKeyBuffer();
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = toscriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockBufCode (code, uidpubKey,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from buffer code address =\n"+tx.toHex());



console.log(".......Spending from second address  ........");

// Example to unlock using string code address
var tx1 = "fdb768004672c2f344db52b776ca0b6457082b8d5a20564bb420dd92883f4494";
var code = "hello"
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = toscriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockStrCode (code,  uidpubKey, tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from string code address =\n"+tx.toHex());




console.log("..........Spending from third address  ..........");

// Example to unlock using custom contract input address
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = toscriptPubKey;
var contractinput = onepubKey.toString('hex');
var amount = 141515;
var tx = compositekeylib.getTransactionForCustomContract(contractinput, uidpubKey,redeemScript,
  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from custom contract address =\n"+tx.toHex());





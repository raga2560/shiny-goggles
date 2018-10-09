bitcoin = require('bitcoinjs-lib');
bitcoincontrol = require('bitcoincontrol');
compositekeylib = bitcoincontrol.compositekeylib;


var uidkeypair = bitcoin.ECPair.fromWIF(
 'cRgnQe1TQngWfnsLo9YUExBjx3iVKNHu2XogVF8JhHiKQTJVQHhk',
 bitcoin.networks.testnet);


var tmpKeypair = bitcoin.ECPair.fromWIF(
'cRgnQe1TQngWfnsLo9YUExBjx3iVKNHu2ZfiRcUivATuojDdzdus',
 bitcoin.networks.testnet);


var onepubKey = tmpKeypair.getPublicKeyBuffer();
var onepubKeyhex =  new Buffer(onepubKey, 'hex');

var uidpubKey = uidkeypair.getPublicKeyBuffer();
var uidpubKeyhex =  new Buffer(uidpubKey, 'hex');
		  


var addr1 = compositekeylib.getBufControlCodeAddress(tmpKeypair.getPublicKeyBuffer(), uidpubKey,  bitcoin.networks.testnet);
console.log("address1 = "+addr1);

var addr2 = compositekeylib.getStrControlCodeAddress('hello',  uidpubKey, bitcoin.networks.testnet);
console.log("address2 = "+addr2);


var pubKeyHash = bitcoin.crypto.hash160(onepubKey) ; 

var redeemScript =  bitcoin.script.compile([bitcoin.opcodes.OP_HASH160, pubKeyHash, 
bitcoin.opcodes.OP_EQUAL ]) 

console.log("redeemScript="+redeemScript.toString('hex'));

var scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))

console.log("scriptpubkey="+scriptPubKey.toString('hex'));
var address = bitcoin.address.fromOutputScript(scriptPubKey, bitcoin.networks.testnet)



var addr3 = compositekeylib.getCustomContractAddress(redeemScript,  uidpubKey, bitcoin.networks.testnet);
console.log("address3 = "+addr3);

// unlock using buffer code
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = tmpKeypair.getPublicKeyBuffer();
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockBufCode (code, uidpubKey,  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from addr1="+tx.toHex());




// unlock using string code
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var code = "hello"
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var amount = 141515;
var tx = compositekeylib.getTransactionForunlockStrCode (code,  uidpubKey, tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from addr2="+tx.toHex());





// unlock using custom contract input
var tx1 = "52a6d4903cd534b1902fdbe3073b5c983a2f59a5d48dff6211b39fdf5b1bac02";
var indextospend = 0;
var sequence = 141155;
var outscriptPubKey = scriptPubKey;
var contractinput = tmpKeypair.getPublicKeyBuffer();
var amount = 141515;
var tx = compositekeylib.getTransactionForCustomContract(contractinput, uidpubKey,redeemScript,
  tx1, indextospend, sequence, outscriptPubKey, amount);

console.log("transaction to withdraw from addr3="+tx.toHex());





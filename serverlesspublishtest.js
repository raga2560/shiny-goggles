bitcoin = require('bitcoinjs-lib');
bitcoincontrol = require('bitcoincontrol');
serverless = bitcoincontrol.serverlesslib;

contractinfo = require('./config/contract.json');
partnerinfo = require('./config/partner.json');
bufferReverse = require('buffer-reverse')



var creatorstub = {
 doc_id: 'doc12',
 doc_type: 'pdf',
 doc_hash: '262772827acb72727'
}


// deterministic RNG for testing only
function rng () { return Buffer.from('1zzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

var network = bitcoin.networks.testnet;

var activatingkeypair = bitcoin.ECPair.makeRandom({ network: network, rng: rng })

console.log(activatingkeypair.toWIF());





var uidkey = Buffer.from('a56677b666c88777a1');

var serverlesstype = 1; // doc in composite-key 
serverless.init(contractinfo, partnerinfo, network);

var address = serverless.doc1Upload(creatorstub, uidkey, serverlesstype );

var amount = 2000;
var txpromise = serverless.regularSendingFund(serverlesstype, amount, address, activatingkeypair); // -> popup for partner to send money, amount
 txpromise.then(function(tx) {
  console.log(tx.toHex());
  serverless.sendtx(tx).then(function(tx1) {

  console.log("sending=", JSON.stringify(tx1));
 }).catch (function(error){
  console.log(error);
 });
 }).catch (function(error){
  console.log(error);
});;


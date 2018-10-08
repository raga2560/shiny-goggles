bitcoin = require('bitcoinjs-lib');
shorter = require('shorter');
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
function rng () { return Buffer.from('pzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

var network = bitcoin.networks.testnet;

var activatingkeypair = bitcoin.ECPair.makeRandom({ network: network, rng: rng })

console.log(activatingkeypair.toWIF());

var activeaddr = activatingkeypair.getAddress();



var uidkey = Buffer.from('a56677b666c88777a1');

var received = {"address":"2MxMt7uiXHGEFogDdgRWCVXgMvakVKfvVWT","uidkey":"0266b44e24fd5e008f261aa1255e63189c89ba9e28dc6a003a849ff207d41eb155","moneydata":{"planid":1,"vendorid":1,"expiry":1,"createdate":1,"randompin":"2626727"}};

// base64 encoding test
var msg = JSON.stringify(received);
var msgbuf = new Buffer(msg);
var msgbufbase64 = msgbuf.toString('base64');
 console.log("base64="+msgbufbase64);

var s1 = shorter.compress(msg);
console.log("shorter s1="+ s1.toString('hex'));



// base64 decoding test

var p = new Buffer(msgbufbase64, 'base64');
var s = p.toString();
 console.log("after decode base64="+s);

var serverlesstype = 1; // doc in composite-key 
serverless.init(contractinfo, partnerinfo, network);

var creatorstub = received.moneydata;
uidkey = new Buffer(received.uidkey, 'hex');
var testaddress = serverless.doc1Upload(creatorstub, uidkey, serverlesstype );
console.log("testaddress="+testaddress);


var address = received.address; 

var txpromise = serverless.compReceive1toManyFund(creatorstub, uidkey, activeaddr);
 txpromise.then(function(tx) {
  if(tx != 0)
    console.log(tx.toHex());
  else {  
     console.log("no balance to withdraw");
   }
 }).catch (function(error){

  console.log(error);
});;








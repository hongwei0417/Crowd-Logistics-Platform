var Sender_Auth = artifacts.require("./Sender_Auth.sol");
var Driver_Auth = artifacts.require("./Driver_Auth.sol");
var Sender_Request = artifacts.require("./Sender_Request.sol");
var Driver_Request = artifacts.require("./Driver_Request.sol");
var Transaction = artifacts.require("./Transaction.sol");
var Sender = artifacts.require("./Sender.sol");


var fs = require('fs');
var ethFile = `${__dirname}/../client/src/eth.json`;
var eth = require(ethFile);


module.exports = function(deployer, network, accounts) {


  deployer.deploy(Sender).then(function() {
    return deployer.deploy(Transaction, Sender.address);
  }).then(function(instance) {
    eth.sender_addr = Sender.address;
    eth.transaction_addr = instance.address;

    fs.writeFile(ethFile, JSON.stringify(eth, null, 2), function (err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(eth));
      console.log('writing to ' + ethFile);
    });

  });
};


// export default deploy_contract = async (deployer) => {
//   const sInstance = await Sender.deployed();
//   const tInstance = await Transaction.deployed(sInstance.address);
//   console.log(sInstance)
//   console.log(tInstance)
// }

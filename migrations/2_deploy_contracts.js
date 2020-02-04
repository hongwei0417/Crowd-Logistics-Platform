var Sender_Auth = artifacts.require("./Sender_Auth.sol");
var Driver_Auth = artifacts.require("./Driver_Auth.sol");
var Sender_Request = artifacts.require("./Sender_Request.sol");
var Driver_Request = artifacts.require("./Driver_Request.sol");
var Transaction = artifacts.require("./Transaction.sol");
var Sender = artifacts.require("./Sender.sol");



module.exports = function(deployer, network, accounts) {
  // deployer.deploy(Sender_Auth);
  // deployer.deploy(Driver_Auth);
  // deployer.deploy(Sender_Request);
  // deployer.deploy(Driver_Request);
  // deployer.deploy(Transaction);

  deployer.deploy(Sender).then(function() {
    return deployer.deploy(Transaction, Sender.address);
  }).then(function(instance) {
    console.log(instance.address)
  });
};


// export default deploy_contract = async (deployer) => {
//   const sInstance = await Sender.deployed();
//   const tInstance = await Transaction.deployed(sInstance.address);
//   console.log(sInstance)
//   console.log(tInstance)
// }

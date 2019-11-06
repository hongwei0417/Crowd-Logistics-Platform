var Sender_Auth = artifacts.require("./Sender_Auth.sol");
var Driver_Auth = artifacts.require("./Driver_Auth.sol");
var Sender_Request = artifacts.require("./Sender_Request.sol");
var Driver_Request = artifacts.require("./Driver_Request.sol");
var Transaction = artifacts.require("./Transaction.sol");

module.exports = function(deployer) {
  deployer.deploy(Sender_Auth);
  deployer.deploy(Driver_Auth);
  deployer.deploy(Sender_Request);
  deployer.deploy(Driver_Request);
  deployer.deploy(Transaction);
};

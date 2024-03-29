const Dogs = artifacts.require("Dogs");
const DogsUpdated = artifacts.require("DogsUpdated");
const Proxy = artifacts.require("Proxy");

module.exports = async function (deployer, network, accounts) {
//Deploy contrcts
  const dogs = await Dogs.new();
  const proxy = await Proxy.new(dogs.address);

//Create Proxy Dog to fool Truffle
  var proxyDog = await Dogs.at(proxy.address);
//Set the nr of dogs through the proxy
  await proxyDog.setNumberOfDogs(10);
//Tested
  var nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("Before update:" + nrOfDogs.toNumber());
//Deploy new version
  const dogsUpdated = await DogsUpdated.new();
  proxy.upgrade(dogsUpdated.address);
  proxyDog = await DogsUpdated.at(proxy.address);
  proxyDog.initialize(accounts[0]);

  var nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("After update:" + nrOfDogs.toNumber());

//Set the nr of dogs through the proxy with NEW FUNC CONTRACT
  await proxyDog.setNumberOfDogs(30);

  var nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("After update 2:" + nrOfDogs.toNumber());
}

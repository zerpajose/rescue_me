const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const AnimalContract = await ethers.getContractFactory("Animal");

  // here we deploy the contract
  const deployedAnimalContract = await AnimalContract.deploy();
    
  // Wait for it to finish deploying
  await deployedAnimalContract.deployed();

  // print the address of the deployed contract
  console.log(
    "Animal Contract Address:",
    deployedAnimalContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
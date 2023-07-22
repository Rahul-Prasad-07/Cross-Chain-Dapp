const hre = require("hardhat");

async function main() {
  const SendMessage = await hre.ethers.getContractFactory("SendMessage");
  const sendMessage = await SendMessage.deploy("", "");

  await sendMessage.deployed();
  console.log("SendMessage deployed to:", sendMessage.address);
}

// handle errors
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

/**
 * In the code snippet above:

The main function has the SendMessage contract factory obtained using hre.ethers.getContractFactory.

The sendMessage contract is deployed using the SendMessage.deploy method with two strings as arguments.

await sendMessage.deployed() statement ensures that the deployment is completed before moving forward.

The deployed contract's address is logged into the console.
 */

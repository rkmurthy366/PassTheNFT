const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("PNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();

  console.log("Contract deployed to:", nftContract.address);
  console.log(`Verify with:\n npx hardhat verify --network rinkeby ${nftContract.address});
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

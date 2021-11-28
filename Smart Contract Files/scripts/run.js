const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("PNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.mintNFT();
  await txn.wait();
  console.log("Minting Done 1");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 1");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 2");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 3");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 4");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 5");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 6");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 7");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 8");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 9");

  txn = await nftContract.transferNFT(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    1
  );
  await txn.wait();
  console.log("Transferring Done 10");
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

import React, { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
  TransferNFT,
} from "./utils/interact.js";
import Description from "./components/Description";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [status, setStatus] = useState("");
  const [walletAddress, setWallet] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [tokenID, setTokenID] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
    setStatus(walletResponse.status);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const onMintPressed = async () => {
    const { status } = await mintNFT();
    setStatus(status);
  };

  const onTransferPressed = async () => {
    const { status } = await TransferNFT(toAddr, tokenID);
    setStatus(status);
  };

  return (
    <div>
      <div className="Header-Section">
        <div className="header gradient-text-1">Pass The NFT</div>
        <button id="walletButton" onClick={connectWalletPressed}>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      </div>

      <div className="body-buttons">
        {/* <p id="status">{status}</p> */}
        <p className="minting-section gradient-text-2">Minting Section</p>
        <button id="mintButton" onClick={onMintPressed}>
          Mint the NFT
        </button>

        <p className="transferring-section gradient-text-2">
          Transferring Section
        </p>
        <form>
          <p className="body-heading">Enter The Address To Transfer</p>
          <input
            type="text"
            placeholder="Address"
            onChange={(event) => setToAddr(event.target.value)}
          />
          <p className="body-heading">Enter The Token-ID</p>
          <input
            type="text"
            placeholder="Token-ID"
            onChange={(event) => setTokenID(event.target.value)}
          />
        </form>
        <button id="mintButton" onClick={onTransferPressed}>
          Transfer the NFT
        </button>
      </div>

      <Description></Description>
      <Footer></Footer>
    </div>
  );
};

export default App;

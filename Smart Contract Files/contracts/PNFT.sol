// SPDX-License-Identifier: UNLICENSED    
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract PNFT is ERC721URIStorage, Ownable, VRFConsumerBase{
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  bytes32 internal keyHash;
  uint256 internal fee;
  uint256 internal randomResult;

  constructor() 
    VRFConsumerBase(
      0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
      0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
    )
    ERC721("PassTheNFT", "PNFT") 
  {
    keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
  }

  uint256 public maxTokens = 5555;
  uint256 public maxPlayers = 10;
  uint256 public price = 0 ether;

  struct TokenInfo {
    uint256 tokenNum;
    address minter;
    address currentOwner;
    uint256 transfers;
    bool isWinner;
    address winner;
  }

  // Mapping of newItemId with TokenInfo struct
  mapping(uint256 => TokenInfo) tokens;
  
  function setPrice(uint256 newPrice) public onlyOwner {
    price = newPrice;
  }

  function withdrawAll() public onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }

  function getRandomNumber() public onlyOwner returns(bytes32 requestId) {
    return requestRandomness(keyHash, fee);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = randomness;
  }  

  function randomNumber(uint256 _tokenId) internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(_tokenId * randomResult))) % maxPlayers + 1;
  }
  
  function mintNFT() public payable{
    require(msg.value >= price, 'PRICE NOT MET');
    require(_tokenIds.current() < maxTokens, 'ALL TOKENS MINTED');

    uint256 newItemId = _tokenIds.current() + 1;
    TokenInfo storage newToken = tokens[newItemId];
    newToken.tokenNum = newItemId;
    newToken.minter = msg.sender;
    newToken.currentOwner = msg.sender;
    newToken.transfers = 0;
    newToken.isWinner = false;

    // Write SVG
    // Update Token URI
    _safeMint(msg.sender, newItemId);
    writeSVG(newItemId);
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    _tokenIds.increment();
  }

  function transferNFT(address friend, uint256 _tokenId) public {
    require(msg.sender != friend, 'cannot gift to yourself');
    require(ownerOf(_tokenId) == msg.sender);
    TokenInfo storage updateTokenDetails = tokens[_tokenId];

    updateTokenDetails.transfers += 1;
    updateTokenDetails.currentOwner = friend;
    if (updateTokenDetails.transfers == randomNumber(_tokenId)) {
      updateTokenDetails.isWinner = true;
      updateTokenDetails.winner = friend;
    }
    
    // Update SVG
    // Update Token URI
    _transfer(msg.sender, friend, _tokenId); 
    writeSVG(_tokenId);
    console.log("An NFT w/ ID %s has been transferred from %s to %s", _tokenId, msg.sender, friend);
  }

  function writeSVG(uint256 _tokenId) public {
    TokenInfo storage readTokenDetails = tokens[_tokenId];
    uint256 _tokenNum = readTokenDetails.tokenNum;
    string memory tMinter = toAsciiString(readTokenDetails.minter);
    string memory tWinner;
    string memory tId = Strings.toString(readTokenDetails.tokenNum);
    string memory tTransfers = Strings.toString(readTokenDetails.transfers);

    if (readTokenDetails.isWinner == true) {
      tWinner = toAsciiString(readTokenDetails.winner);
      tWinner = string(abi.encodePacked(tWinner, " wins the Game"));
    }
    else {
      tWinner = "Nobody won yet";
    }
    
    string memory baseSVG = "<svg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 1000 1000'><style>.base { fill: white; font-family: sans-serif; font-size: 30px; }</style><rect width='100%' height='100%' fill='black' stroke='pink' stroke-width='3%' fill-opacity='0.9' stroke-opacity='1'/><text x='50%' y='20%' class='base' dominant-baseline='middle' text-anchor='middle'>Pass The NFT Game";

    string memory finalSVG = string(abi.encodePacked(baseSVG, "<tspan x='50%' y='40%'>Token Id = ", tId, "</tspan><tspan x='50%' y='50%'>", tMinter, " Minted The NFT</tspan><tspan x='50%' y='60%'>Transfers Done = ", tTransfers,"</tspan><tspan x='50%' y='80%'>", tWinner, "</tspan></text></svg>"));

    // console.log("---------------------------------");
    // console.log(finalSVG);
    // console.log("---------------------------------");
  
    // Get all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "PNFT #',
            tId,
            '", "description": "A purely On-Chain Dynamic NFT Game.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(finalSVG)),
            '"}'
          )
        )
      )
    );

    string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

    // console.log("\n--------------------");
    // console.log(
    //   string(
    //     abi.encodePacked(
    //       "https://nftpreview.0xdev.codes/?code=",
    //       finalTokenUri
    //     )
    //   )
    // );
    // console.log("--------------------\n");

    // Set TokenURI
    _setTokenURI(_tokenNum, finalTokenUri);
  }

  // Address to String --> https://ethereum.stackexchange.com/a/8447/86278
  function toAsciiString(address x) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
        bytes1 hi = bytes1(uint8(b) / 16);
        bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
        s[2*i] = char(hi);
        s[2*i+1] = char(lo);            
    }
    return string(s);
  }

  function char(bytes1 b) internal pure returns (bytes1 c) {
      if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
      else return bytes1(uint8(b) + 0x57);
  }

}
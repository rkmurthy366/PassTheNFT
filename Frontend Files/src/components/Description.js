import React from "react";
import "./Description.css";

const Description = () => {
  return (
    <div className="description">
      <p className="desc-text-center gradient-text-2">Description</p>
      <p className="desc-text">
        In this game the users will have access to mint a single NFT for a
        single transaction. Once the user mints the NFT that person is obliged
        to transfer it with anyone and again receiver has to tranfer this NFT to
        someone else and so on until a WIN is declared in the NFT. Everytime a
        person transfer's the NFT to other person, the contents of the NFT
        changes. The individual has to share these NFT until its declared in the
        NFT that the user has won.
      </p>
      <p className="desc-text">
        This game is inspired from the traditional Musical Chairs game, but the
        rules are changed a bit. Instead of the person losing the game when the
        music stops, here in this game the individual wins only when the WIN is
        declared in the NFT.
      </p>
      <p className="desc-text">
        Here, the users wont have any idea when the "WIN" is declared in the
        NFT. Each NFT token will have some random number associated with it,
        when the number of transfers crosses that random number, the NFT
        property changes to WIN and Victory is declared to the user who holds
        that NFT in thier wallet.
      </p>
    </div>
  );
};

export default Description;

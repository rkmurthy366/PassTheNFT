import React from "react";
import "./Footer.css";
import logo from "./twitter.png";
const TWITTER_HANDLE = "rkmurthy366";
const TWITTER_LINK = `https://twitter.com/@${TWITTER_HANDLE}`;

const Footer = () => {
  return (
    <div className="footer-section">
      <div className="twitter">
        <img alt="Twitter Logo" className="twitter-logo" src={logo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  );
};
export default Footer;

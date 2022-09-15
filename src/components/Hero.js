import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css"

const Hero = () => {
  let navigate = useNavigate();

  const goExplore = () => {
    navigate("/explore");
  };
  
  const goCreate = () => {
    if(typeof window.ethereum === 'undefined') {
      alert("Please install Metamask")
      return
    }
    if(!localStorage.getItem('wallet')) {
      alert("Please connect Wallet")
      return
    }
    navigate("/create")
  }

  return (
    <div id="hero">
      <h1 id="header-text-first"> NFT </h1>
      <h1 id="header-text-second"> Darkroom Marketplace</h1>
      <h5 id="header-subtext">Craft, hunt and trade NFT's in the dark</h5>
      <div id="hero-buttons">
        <button id="explore" onClick={goExplore}>Explore</button>
        <button id="create" onClick={goCreate}>Create</button>
      </div>
    </div>
  );
};

export default Hero;

import React from "react";
import Hero from "../components/Hero";
import Grocery from "../components/Grocery";
import OurPolicy from "../components/OurPolicy";
import IndustrialStore from "../components/IndustrialStore";

const Home = () => {
  return (
    <div>
      <Hero />
      <Grocery />
      <IndustrialStore/>
      <OurPolicy />
    </div>
  );
};

export default Home;

import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import Gallery from '../components/Gallery';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero scrollToSection={()=>{}} />
      <Services />
      <Gallery />
      <WhyUs />
    </>
  );
};

export default HomePage;

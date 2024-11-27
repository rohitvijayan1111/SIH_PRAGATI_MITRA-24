import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import landing from '../assets/landing.png';
import ProblemSection from "./ProblemSection";
import PainPointsSection from "./PainPointSection";
import SolutionComponent from "./SolutionComponent";
import UniqueFeatures from "./UniqueFeatures";
import SolutionOutcome from "./SolutionOutcome";
import AyushInfoComponent from "./AyushInfoComponent";
import { useNavigate } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    color: #333;
    overflow-x: hidden;
  }
`;

const HomepageContainer = styled.div`
  width: 100%;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(1.1);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// Navbar styling
const Navbar = styled.nav`
  width: 100%;
  padding: 1rem 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #164863;
  color: #fff;
  position: fixed;
  top: 0;
  z-index: 20;
`;

const NavLogo = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: #ffda79;
`;

// Mobile menu animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  a {
    color: #fff;
    text-decoration: none;
    font-size: 1em;
    transition: color 0.3s ease;

    &:hover {
      color: #ffda79;
    }
  }

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    padding: 1rem 0;
    gap: 2rem;
    animation: ${slideIn} 0.3s ease-out;

    a {
      font-size: 1.2em;
      padding: 10px 0;
      color: #ffda79;
    }
  }
`;

// Overlay for mobile menu
const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 15;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffda79;
  font-size: 1.5em;
  cursor: pointer;
  z-index: 20;

  @media (max-width: 768px) {
    display: block;
  }
`;

// Hero section styling with animation
const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  color: #fff;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 20px;
    text-align: center;
  }
`;

const HeroImage = styled.div`
  flex: 2;
  width: 100%;
  height: 80%;
  background-image: url(${landing});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  animation: ${zoomIn} 1.5s ease-out forwards;
  margin-top:50px;
  @media (max-width: 768px) {
    height: 50vh;
    margin-top: 60px;
  }
`;

const HeroHeading = styled.h1`
  font-size: 2.7em;
  font-weight: bold;
  font-family: "Sour Gummy", sans-serif;
  margin-bottom: 20px;
  color: #4A628A;
  opacity: 0;
  animation: ${fadeIn} 1.2s ease-out 0.5s forwards;
  margin-top:70px;
  @media (max-width: 768px) {
    font-size: 1.8em;
    margin-top: 0px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 50%;
  z-index: 1;
  padding: 20px;
  animation: ${fadeIn} 1s ease-in-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 20px;
  }
`;

const CTAButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #ffda79;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  opacity: 0;
  animation: ${fadeIn} 1.2s ease-out 1s forwards;
  text-align: center;

  &:hover {
    background-color: #ffbd59;
  }

  @media (max-width: 768px) {
    font-size: 1em;
    padding: 12px 25px;
  }
`;

const HeaderSection = styled.header`
  background-color: #4a90e2;
  color: white;
  padding: 40px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 10px;
  font-weight: 500;
`;

const Intro = styled.p`
  font-size: 1.1rem;
  margin-top: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

// Section Styling
const Section = styled.section`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
`;

const SectionContent = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
`;

// Pain Points Section
const PainPointsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PainPointItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;

  &::before {
    content: "•";
    font-size: 1.5rem;
    color: #ff6b6b;
    margin-right: 10px;
  }
`;

// Features Section
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background-color: #f0f4f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FeatureTitle = styled.h4`
  font-size: 1.4rem;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

// Outcomes Section
const Outcomes = styled.div`
  background-color: #f8f9fa;
  padding: 60px 20px;
  text-align: center;
`;

const OutcomeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const OutcomeItem = styled.div`
  background-color: #fff;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OutcomeTitle = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const OutcomeDescription = styled.p`
  font-size: 1.1rem;
  color: #777;
`;

// CTA Section
const CTA = styled.div`
  background-color: #4a90e2;
  color: white;
  padding: 40px 20px;
  text-align: center;
  margin-top: 40px;
`;



const FooterWrapper = styled.footer`
  background-color: #5b47ed;
  color: white;
  padding: 40px 20px;
  text-align: center;
  font-family: Arial, sans-serif;
`;



// Right Section (Call to Action)
const FooterRight = styled.div`
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin: 5px 0;
  }

  p {
    font-size: 0.9rem;
    color: #ddd;
  }
`;
const FooterLeft = styled.div`
  display: flex;
  justify-content: space-between;  // Ensures the two columns are spaced apart
  gap: 40px;  // Adds some space between the two columns
  width: 100%;  // Makes sure the content spans the full width
  flex-wrap: wrap;  // Allows wrapping if the screen size is smaller

  @media (max-width: 768px) {
    flex-direction: column;  // Stacks the columns vertically on smaller screens
    gap: 20px;
  }
`;

const FooterColumn = styled.div`
  flex: 1;  // Allows each column to take equal space
  min-width: 250px;  // Ensures columns don't shrink too much on smaller screens
  max-width: 500px;  // Limits the maximum width to maintain good readability
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #ddd;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #ddd;

  li {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
`;

// Updated Footer Content
const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

// Bottom Section (Legal and Social Media Links)
const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 40px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`;

// Legal Links
const LegalLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    text-decoration: none;
    color: #ddd;
    font-size: 0.85rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }
`;

// Social Media Links
const SocialMediaLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    font-size: 1.5rem;
    color: white;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }
`;

const LoginButton = styled.button`
  padding: 2px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085; /* Even darker blue when clicked */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 143, 255, 0.5); /* Focus effect */
  }
`;

function DetailsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('login');
  };

  return (
    <HomepageContainer>
      <GlobalStyle />
      <Overlay isOpen={isMenuOpen} onClick={toggleMenu} />

      {/* Navbar Component */}
      <Navbar>
      <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </MenuButton>
        <NavLogo>PRAGATI MITRA</NavLogo>
        <NavLinks isOpen={isMenuOpen}>
          <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
          <a href="#about" onClick={() => scrollToSection('about')}>Problem</a>
          <a href="#features" onClick={() => scrollToSection('features')}>Pain Points</a>
          <a href="#solution" onClick={() => scrollToSection('solution')}>Solution</a>
          <a href="#usp" onClick={() => scrollToSection('usp')}>USP</a>
          <a href="#output" onClick={() => scrollToSection('output')}>Outcome</a>
          <a href="#ayush" onClick={() => scrollToSection('ayush')}>Ministry of AYUSH</a>
          <a href="#contact" onClick={() => scrollToSection('contact')}>Contact Us</a>
        </NavLinks>
        <LoginButton onClick={handleLoginClick}>Login</LoginButton>
      </Navbar>

      {/* Hero Section */}
      <HeroSection id="home">
        <HeroContent>
          <HeroHeading>Streamlined Annual Report Preparation Portal for Educational Institutes</HeroHeading>
          <CTAButton onClick={() => scrollToSection('about')}>Learn More</CTAButton>
        </HeroContent>
        <HeroImage />
      </HeroSection>

      <div id="about">
      <ProblemSection />
      </div>

      <div id="features">
      <PainPointsSection />
      </div>

      <div id="solution">
      <SolutionComponent />
      </div>

      <div id="usp">
      <UniqueFeatures />
      </div>

      <div id="output">
      <SolutionOutcome />
      </div>

      <div id="ayush">
      <AyushInfoComponent />
      </div>

      <div id="contact">
      <FooterWrapper >
        <FooterContent>
          {/* Left Section - Description and Features */}
          <FooterLeft>
            {/* Description Column */}
            <FooterColumn>
              <FooterTitle>Description</FooterTitle>
              <Description>
              The Annual Report Preparation Portal is a dynamic and interactive platform designed for educational institutes to streamline the creation of comprehensive annual reports. It enables seamless data collection, integration, analysis, and visualization from multiple departments.                        </Description>
            </FooterColumn>

            {/* Features Column */}
            <FooterColumn>
              <FooterTitle>Key Features</FooterTitle>
              <FeaturesList>
                <li>Data Collection from Various Sources</li>
                <li>Comprehensive Data Analysis and Visualization</li>
                <li>Automated Report Generation</li>
                <li>Real-time Collaboration Tools</li>
                <li>Multilingual Support for Diverse Users</li>
              </FeaturesList>
            </FooterColumn>
          </FooterLeft>

          <FooterRight>
            <p>Need to prepare Report?</p>
            <h2>We are Here!!!</h2>
          </FooterRight>
        </FooterContent>

        {/* Bottom Section */}
        <FooterBottom>
          <LegalLinks>
            <a href="#cookies-policy">Cookies Policy</a>
            <a href="#legal-terms">Legal Terms</a>
            <a href="#privacy-policy">Privacy Policy</a>
          </LegalLinks>
          <SocialMediaLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">🌐</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">📺</a>
          </SocialMediaLinks>
        </FooterBottom>
      </FooterWrapper>
      </div>
    </HomepageContainer>
  );
}

export default DetailsPage;

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import painPointsImage from '../assets/pain.png';

// Styled components for Pain Points Section
const PainPointsSectionWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 20px;
  border-radius: 10px;
  margin: 40px 0;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f9fafb;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 30px 15px;
  }
`;

// Image Wrapper with animation
const ImageWrapper = styled.div`
  flex: 1;
  margin-left: 20px;
  overflow: hidden;
  border-radius: 10px;

  @media (max-width: 768px) {
    margin: 0 0 20px 0;
    width: 100%;
  }
`;

const PainPointsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 1s ease, transform 1s ease;

  ${PainPointsSectionWrapper}.visible & {
    opacity: 1;
    transform: scale(1);
  }
`;

// Content Styling
const ContentWrapper = styled.div`
  flex: 2;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInTitle 1s forwards;

  @keyframes fadeInTitle {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Pain Points List with Animation
const PainPointsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PainPointItem = styled.li`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-weight: 500;
  opacity: ${(props) => (props.animate ? 1 : 0)};
  transform: ${(props) => (props.animate ? 'translateY(0)' : 'translateY(10px)')};
  transition: opacity 0.5s ease, transform 0.5s ease;
  
  &:nth-child(1) {
    transition-delay: 0.2s;
  }
  &:nth-child(2) {
    transition-delay: 0.4s;
  }
  &:nth-child(3) {
    transition-delay: 0.6s;
  }
  &:nth-child(4) {
    transition-delay: 0.8s;
  }
  &:nth-child(5) {
    transition-delay: 1s;
  }

  &::before {
    content: "•";
    margin-right: 10px;
    font-size: 1.5rem;
    color: #ff6b6b;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PainPointsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setAnimateItems(true); // Start list item animation when section is visible
        observer.disconnect(); // Stop observing once section is visible
      }
    }, {
      threshold: 0.3, // Trigger animation when 30% of the section is visible
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <PainPointsSectionWrapper ref={sectionRef} className={isVisible ? 'visible' : ''}>
      {/* Content Section */}
      <ContentWrapper>
        <SectionTitle>Current Pain Points</SectionTitle>
        <PainPointsList>
          <PainPointItem animate={animateItems}>
            Time-consuming manual data entry and report preparation
          </PainPointItem>
          <PainPointItem animate={animateItems}>
            Complex integration of data from various sources
          </PainPointItem>
          <PainPointItem animate={animateItems}>
            Lack of automation leading to errors and delays
          </PainPointItem>
          <PainPointItem animate={animateItems}>
            Difficulty in visualizing data in an insightful way
          </PainPointItem>
          <PainPointItem animate={animateItems}>
            Compliance issues with privacy regulations
          </PainPointItem>
        </PainPointsList>
      </ContentWrapper>

      {/* Image Section */}
      <ImageWrapper>
        <PainPointsImage src={painPointsImage} alt="Pain Points Illustration" />
      </ImageWrapper>
    </PainPointsSectionWrapper>
  );
};

export default PainPointsSection;

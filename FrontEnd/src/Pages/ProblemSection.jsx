import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import problem from '../assets/problem.png';

const ProblemSectionWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 20px;
  border-radius: 10px;
  margin: 40px 0;
  max-width: auto;
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
    flex-direction: column;
    padding: 30px 15px;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  margin-right: 20px;
  overflow: hidden;
  border-radius: 10px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
    width: 100%;
  }
`;

const ProblemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 1s ease, transform 1s ease;

  ${ProblemSectionWrapper}.visible & {
    opacity: 1;
    transform: scale(1);
  }
`;

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

const BulletPointsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BulletPoint = styled.li`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-weight: 500;
  opacity: ${(props) => (props.animate ? 1 : 0)};
  transform: ${(props) => (props.animate ? 'translateY(0)' : 'translateY(10px)')};
  transition: opacity 1s ease, transform 1s ease;
  transition-delay: ${(props) => props.delay}s;

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

const ProblemSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Stop observing once visible
      }
    }, {
      threshold: 0.3, // Trigger when 30% of the section is visible
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
    <ProblemSectionWrapper ref={sectionRef} className={isVisible ? 'visible' : ''}>
      <ImageWrapper>
        <ProblemImage src={problem} alt="Problem Illustration" />
      </ImageWrapper>

      <ContentWrapper>
        <SectionTitle>The Problem</SectionTitle>
        <BulletPointsList>
          {[
            "Educational institutes generate vast amounts of data every year.",
            "Data includes academic performance, financial statements, research publications, student achievements, etc.",
            "Preparing a comprehensive annual report is complex and time-consuming.",
            "The report must be visually appealing, coherent, and easy to understand.",
            "Data aggregation, analysis, and presentation require significant manual effort.",
            "A solution is needed to automate and streamline this process."
          ].map((text, index) => (
            <BulletPoint key={index} animate={isVisible} delay={index * 0.3}>
              {text}
            </BulletPoint>
          ))}
        </BulletPointsList>
      </ContentWrapper>
    </ProblemSectionWrapper>
  );
};

export default ProblemSection;

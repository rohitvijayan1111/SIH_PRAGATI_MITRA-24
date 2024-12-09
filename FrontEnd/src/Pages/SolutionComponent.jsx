import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import solutionImage from '../assets/solution.jpeg';

const SolutionSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  border-radius: 10px;
  margin: 40px 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f0f9ff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SolutionImageWrapper = styled.div`
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

const SolutionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 1s ease, transform 1s ease;

  ${SolutionSection}.visible & {
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
  color: #1c3d58;
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

const SectionContent = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInContent 1s 0.5s forwards;

  @keyframes fadeInContent {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 40px;
  opacity: 0;
  animation: fadeInGrid 1s 1s forwards;

  @keyframes fadeInGrid {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.5s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInCard 1s 0.5s forwards;

  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c3d58;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
`;

const SolutionComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    if (cardsRef.current) {
      cardsRef.current.forEach((card) => cardObserver.observe(card));
    }

    return () => {
      if (cardsRef.current) {
        cardsRef.current.forEach((card) => cardObserver.disconnect());
      }
    };
  }, []);

  return (
    <SolutionSection ref={sectionRef} className={isVisible ? 'visible' : ''}>
      <TopSection>
        <SolutionImageWrapper>
          <SolutionImage src={solutionImage} alt="Solution Illustration" />
        </SolutionImageWrapper>

        <ContentWrapper>
          <SectionTitle>What we bring to the table</SectionTitle>
          <SectionContent>
            Our portal automates data collection, integration, analysis, and report generation. It is designed to reduce manual effort, enhance accuracy, and provide valuable insights through dynamic visualizations and collaboration features.
          </SectionContent>
        </ContentWrapper>
      </TopSection>

      <FeaturesGrid>
        <FeatureCard ref={(el) => (cardsRef.current[0] = el)}>
          <FeatureTitle>Data Collection & Integration</FeatureTitle>
          <FeatureDescription>
            Import data from various sources like databases, spreadsheets, and surveys.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard ref={(el) => (cardsRef.current[1] = el)}>
          <FeatureTitle>Data Analysis & Visualization</FeatureTitle>
          <FeatureDescription>
            Customizable dashboards with graphs and charts to visualize key data.
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard ref={(el) => (cardsRef.current[2] = el)}>
          <FeatureTitle>Automated Report Generation</FeatureTitle>
          <FeatureDescription>
            Generate comprehensive reports in multiple formats (PDF, HTML, etc.).
          </FeatureDescription>
        </FeatureCard>
        <FeatureCard ref={(el) => (cardsRef.current[3] = el)}>
          <FeatureTitle>Collaboration & Feedback</FeatureTitle>
          <FeatureDescription>
            Real-time collaboration and feedback features for stakeholders.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </SolutionSection>
  );
};

export default SolutionComponent;

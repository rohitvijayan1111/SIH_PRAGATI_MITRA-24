import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import stream from '../assets/stream.png'
import real from '../assets/real.png'
import colloboration from '../assets/colloboration.png'

const OutcomeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 40px 15px;
  }
`;

const OutcomeHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1c3d58;
    margin-bottom: 10px;
    animation: fadeIn 1s forwards;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  p {
    font-size: 1.2rem;
    color: #555;
    line-height: 1.8;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
  }
`;

const OutcomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
  width: 100%;
  opacity: 0;
  animation: fadeInGrid 1s 0.5s forwards;

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

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OutcomeCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1c3d58;
    margin-bottom: 15px;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const OutcomeImage = styled.img`
  width: 100%;
  max-width: 250px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 10px;
  object-fit: cover;
`;

const SolutionOutcome = () => {
  const [isVisible, setIsVisible] = useState(false);

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

    const section = document.querySelector('#outcome-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <OutcomeSection id="outcome-section" className={isVisible ? 'visible' : ''}>
      <OutcomeHeader>
        <h2>Solution Outcome</h2>
        <p>Our solution has been designed to streamline the data collection, integration, and reporting processes for educational institutes, enabling them to save time, reduce errors, and foster collaboration.</p>
      </OutcomeHeader>

      <OutcomeGrid>
        <OutcomeCard>
          <OutcomeImage src={stream} alt="Outcome 1" />
          <h3>Data Streamlining</h3>
          <p>Automated data collection from various sources, reducing manual entry and improving efficiency.</p>
        </OutcomeCard>
        <OutcomeCard>
          <OutcomeImage src={real} alt="Outcome 2" />
          <h3>Real-Time Reporting</h3>
          <p>Instant generation of detailed reports based on the data collected, helping institutes make informed decisions quickly.</p>
        </OutcomeCard>
        <OutcomeCard>
          <OutcomeImage src={colloboration} alt="Outcome 3" />
          <h3>Collaboration Tools</h3>
          <p>Real-time collaboration between stakeholders for feedback and review, fostering greater engagement.</p>
        </OutcomeCard>
      </OutcomeGrid>
    </OutcomeSection>
  );
};

export default SolutionOutcome;

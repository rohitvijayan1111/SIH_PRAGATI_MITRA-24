import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import ayushImage from '../assets/ayush.png'; // Replace with the correct path

// Styled Components
const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 0 auto;
  display: block;
  border-radius: 12px;
`;

const Content = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  opacity: 0;
  transform: translateY(50px);

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1d3557;
  margin-bottom: 15px;
`;

const Paragraph = styled.li`
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 10px;
list-style-type: none;
  strong {
    color: #2a9d8f;
  }
    &::before {
    content: "•";
    margin-right: 10px;
    font-size: 1.5rem;
    color: #ff6b6b;
  }
`;

const Titles = styled.h1`
  font-size: 2.5rem;
  color: #1d3557;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AyushInfoComponent = () => {
  const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true });

  return (
    <Container>
        <Titles> ANALYSIS ON MINISTRY OF AYUSH</Titles>
      <Image src={ayushImage} alt="Ministry of AYUSH" />
      <Content ref={contentRef} className={contentInView ? 'in-view' : ''}>
        <Title>Challenges Faced by Ministry of AYUSH</Title>
        <Paragraph>
          <strong>Ministry of AYUSH</strong> manages and documents data related to traditional medical systems like <strong>Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homoeopathy.</strong>
        </Paragraph>
        <Paragraph>
          The ministry runs various <strong>programs, projects, research studies, and collaborations</strong> with educational institutions and healthcare providers.
        </Paragraph>
        <Paragraph>
          These initiatives require <strong>consistent monitoring, data collection, and report generation</strong> to showcase progress, outcomes, and challenges.
        </Paragraph>

        <Title>Issues with Current Reporting</Title>
        <Paragraph>
          The current process is often <strong>time-consuming</strong> and prone to <strong>errors</strong> when done manually.
        </Paragraph>
        <Paragraph>
          Data must be <strong>collected from multiple sources</strong>, integrated, analyzed, and used to generate meaningful reports.
        </Paragraph>
        <Paragraph>
          This <strong>hinders efficiency</strong> and makes it challenging for the ministry to present accurate reports on time.
        </Paragraph>
      </Content>
    </Container>
  );
};

export default AyushInfoComponent;

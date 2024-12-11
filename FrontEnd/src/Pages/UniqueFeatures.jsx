import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import solution from '../assets/solution.jpeg'
import excel from '../assets/excel.png'
import database from '../assets/database.png'
import google from '../assets/googleform.png'
import existing from '../assets/existing.png'
import charts from '../assets/charts.png'
import user from '../assets/user.png'
import captcha from '../assets/captcha.png'
import role from '../assets/role.png'
import chatting from '../assets/chatting.png'
import mail from '../assets/mail.png'
import deadline from '../assets/deadline.png'
import lock from '../assets/lock.png'
import multilingual from '../assets/multilingual.png'
import report from '../assets/report.png'
import ai from '../assets/AI.png'
import kpi from '../assets/kpi.png'
import custom from '../assets/custom.png'
import multilanguage from '../assets/multilanguage.jpg'
import gdpr from '../assets/gdpr.png'
import { motion } from 'framer-motion';
const FeatureSection = styled.section`
  padding: 60px 20px;
  background-color: #f7f9fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 20px 0;
  opacity: 1; /* Set to 1 for debugging */
  transform: translateY(0); /* Remove for debugging */
  transition: opacity 0.6s ease, transform 0.6s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;


const FeatureTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
`;

const FeatureRow = styled(motion.div)`
  display: flex;
  align-items: center;
  height:auto;
  justify-content: space-between;
  margin: 20px 0;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background: white;
  &:nth-child(even) {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeatureImage = styled(motion.img)`
  width: 60px;
  height: auto;
  margin-right: 20px;
`;

const FeatureText = styled.div`
  flex: 1;
  text-align: left;
`;

const FeatureHeading = styled.h3`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
`;

const FeatureDescription = styled(motion.p)`
  font-size: 1rem;
  color: #666;
`;



const UniqueFeatures = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <FeatureSection ref={sectionRef} className={isVisible ? 'visible' : ''}>
      <FeatureTitle>How We Stand Out</FeatureTitle>

      {/* Data Collection */}
      <FeatureContainer>
        <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
          <FeatureHeading>Data Collection</FeatureHeading>

          {/* Import from Excel */}
          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={excel} width="20px" height="20px" alt="Excel Icon" variants={imageVariants} />
            <p style={{width:"200px"}}><strong>Import from Excel:<br></br></strong> Upload data directly from Excel files.</p>
          </FeatureDescription>

          {/* Import from Database */}
          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={database} alt="Database Icon" variants={imageVariants} />
            <p style={{width:"200px"}}><strong>Import from Database:<br></br></strong> Pull data seamlessly from your database.</p>
          </FeatureDescription>

          {/* Integration with Existing Database */}
          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={existing} alt="Integration Icon" variants={imageVariants} />
            <p style={{width:"200px"}}><strong>Existing Database:<br></br></strong> Connect with pre-existing databases.</p>
          </FeatureDescription>

          {/* Integration with Google Forms */}
          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={google} style={{width:"35px"}}  alt="Google Forms Icon" variants={imageVariants} />
            <p style={{width:"260px",marginBottom:"5px"}}><strong>Integration with Google Forms:<br></br></strong> Capture data from Google Forms automatically.</p>
          </FeatureDescription>
        </FeatureRow>
      </FeatureContainer>

      {/* Data Visualization */}
      <FeatureContainer>
  <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
    <FeatureHeading>Data Visualization</FeatureHeading>
    
    {/* Graphs */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={charts} alt="Graphs Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>Graphs & Charts:<br></br></strong> Present collected data in visually compelling graph formats.</p>
    </FeatureDescription>
    

    
    {/* User Experience */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={user} alt="User Experience Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>User Experience:<br></br></strong> Intuitive and immersive design for effective data interpretation.</p>
    </FeatureDescription>
  </FeatureRow>
</FeatureContainer>


      {/* Communication */}
      <FeatureContainer>
  <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
    <FeatureHeading>Communication</FeatureHeading>
    
    {/* In-Built Mail */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={mail} alt="Mail Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>In-Built Mail:<br></br></strong> Email updates to stakeholders.</p>
    </FeatureDescription>
    
    {/* In-App Chat */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={chatting} alt="Chat Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>In-App Chat:<br></br></strong> Real-time communication on project progress.</p>
    </FeatureDescription>
  </FeatureRow>
</FeatureContainer>


      {/* Control Over Data Collection */}
      <FeatureContainer>
  <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
    <FeatureHeading>Control Over Data<br></br> Collection</FeatureHeading>

    {/* Lock Forms */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={lock} alt="Lock Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>Lock Forms:<br></br></strong> Administrators can lock forms as needed.</p>
    </FeatureDescription>

    {/* Deadline Reminders */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={deadline} alt="Reminder Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>Deadline Reminders:<br></br></strong> Automated email reminders for pending entries.</p>
    </FeatureDescription>
  </FeatureRow>
</FeatureContainer>

<FeatureContainer>
  <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
    <FeatureHeading>Security</FeatureHeading>
    
    {/* Role-based Authentication */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={role} alt="Role-based Authentication Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>Role-based Authentication:<br></br></strong> Secure access using JWT.</p>
    </FeatureDescription>
    
    {/* Captcha-Enabled Login */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={captcha} alt="Captcha Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>Captcha-Enabled Login:<br></br></strong> Prevents unauthorized bot entry.</p>
    </FeatureDescription>

    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={gdpr} alt="Captcha Icon" variants={imageVariants} />
      <p style={{width:"200px"}}><strong>GDPR & FERPA Standards:<br></br></strong> Data security and privacy compliance.</p>
    </FeatureDescription>
  </FeatureRow>
</FeatureContainer>


      <FeatureContainer>
  <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
    <FeatureHeading>Reports</FeatureHeading>

    {/* Formatted Reports */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={report} alt="Report Icon" variants={imageVariants} />
      <p style={{width:"200px"}}>
        <strong>Formatted Reports:<br></br></strong> Supports tables, images, graphs, videos, and more.
      </p>
    </FeatureDescription>

    {/* Multilingual Support */}
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={multilingual} alt="Multilingual Icon" variants={imageVariants} />
      <p style={{width:"200px"}}>
        <strong>Multilingual Output:<br></br></strong> Generate reports in multiple languages.
      </p>
    </FeatureDescription>
    <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
      <FeatureImage src={ai} alt="ai Icon" variants={imageVariants} />
      <p style={{width:"220px"}}>
        <strong>AI-Powered Data Analysis:<br></br></strong> Advanced AI algorithms analyze tables and graphs to provide valuable insights.
      </p>
    </FeatureDescription>
  </FeatureRow>
</FeatureContainer>

<FeatureContainer>
        <FeatureRow variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}>
          <FeatureHeading>Add Ons</FeatureHeading>

          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={kpi} width="20px" height="20px" alt="Excel Icon" variants={imageVariants} />
            <p style={{width:"200px"}}><strong>Custom KPI Indicator:<br></br></strong>  Administrators can generate new KPIs with customizable charts and graphs.</p>
          </FeatureDescription>

          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={custom} alt="Database Icon" variants={imageVariants} />
            <p style={{width:"220px"}}><strong>Custom Form Generation:<br></br></strong> Seamlessly create forms with a user-friendly interface.</p>
          </FeatureDescription>

          <FeatureDescription variants={textVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}>
            <FeatureImage src={multilanguage} alt="Integration Icon" variants={imageVariants} />
            <p style={{width:"200px"}}><strong>Multilingual Support:<br></br></strong>  Supports access in over 200 languages, ensuring global accessibility.</p>
          </FeatureDescription>

        </FeatureRow>
      </FeatureContainer>

    </FeatureSection>
  );
};

export default UniqueFeatures;

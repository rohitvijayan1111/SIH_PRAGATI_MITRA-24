import React from "react";
import styled from "styled-components";

// Footer Wrapper
const FooterWrapper = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 40px 20px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

// Footer Sections
const FooterSection = styled.div`
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

// Footer Logo or Title
const FooterLogo = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #ff6b6b;
`;

// Navigation Links
const FooterNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    color: #ffffff;
    font-size: 1rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }
`;

// Contact Section
const ContactInfo = styled.div`
  font-size: 0.9rem;

  p {
    margin: 5px 0;
  }
`;

// Social Media Icons
const SocialMedia = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;

  a {
    color: white;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6b6b;
    }
  }

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

// Copyright Section
const Copyright = styled.div`
  margin-top: 20px;
  font-size: 0.85rem;
  color: #ddd;

  @media (min-width: 768px) {
    text-align: right;
    margin-top: 0;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      {/* Logo Section */}
      <FooterSection>
        <FooterLogo>EduPortal</FooterLogo>
        <p>Streamlining the process of preparing annual reports.</p>
      </FooterSection>

      {/* Navigation Links */}
      <FooterSection>
        <FooterNav>
          <ul>
            <li><a href="#problem-overview">Problem Overview</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#solution-highlights">Solutions</a></li>
            <li><a href="#outcomes">Expected Outcomes</a></li>
          </ul>
        </FooterNav>
      </FooterSection>

      {/* Contact Info */}
      <FooterSection>
        <ContactInfo>
          <p>Email: support@eduportal.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Edu St, Knowledge City</p>
        </ContactInfo>
      </FooterSection>

      {/* Social Media */}
      <FooterSection>
        <SocialMedia>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">🌐</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">🔗</a>
        </SocialMedia>
      </FooterSection>

      {/* Copyright */}
      <FooterSection>
        <Copyright>
          &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
        </Copyright>
      </FooterSection>
    </FooterWrapper>
  );
};

export default Footer;

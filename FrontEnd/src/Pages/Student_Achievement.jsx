// Student_Achievement.js

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const AchievementsContainer = styled.div`
    font-family: 'Roboto', sans-serif;
    background-color: #f4f6f9;
    color: #333;
    padding: 20px;
    animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #002b5b;
`;

const UploadButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const UploadButton = styled.button`
    padding: 12px 24px;
    font-size: 18px;
    cursor: pointer;
    border: none;
    background-color: #004080;
    color: white;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #003060;
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(1px) scale(1.02);
    }
`;

const CardContainer = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 10px;
    animation: ${fadeIn} 1s ease-in-out;
`;

const Card = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    flex: 1 1 calc(45% - 20px);
    max-width: 380px;
    min-height: 200px;
    text-align: center;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

    &:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        background-color: #f1f8ff;
    }
`;

const CardTitle = styled.h3`
    font-size: 1.8rem;
    color: #004080;
    margin: 10px 0 0;
`;

const CardIcon = styled.i`
    font-size: 3rem;
    color: #004080;
    margin-bottom: 10px;
    transition: transform 0.3s, color 0.3s;

    ${Card}:hover & {
        color: #003060;
        transform: scale(1.1);
    }
`;

const CardDescription = styled.p`
    font-size: 1rem;
    color: #666;
    margin-top: 8px;
    line-height: 1.5;
`;

const Student_Achievement = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }, []);

    const handleCardClick = (type) => {
        navigate(`details/${type}`);
    };

    const achievements = [
        {
            type: 'Symposium',
            icon: 'fas fa-comments',
            description: 'Uploaded details of participation in academic symposiums, including discussions and presentations.',
        },
        {
            type: 'Hackathon',
            icon: 'fas fa-laptop-code',
            description: 'Shared experiences and projects developed during hackathons, showcasing innovative solutions.',
        },
        {
            type: 'Paper Publication',
            icon: 'fas fa-file-alt',
            description: 'Provided information on published papers, including titles, journals, and publication dates.',
        },
        {
            type: 'Patent',
            icon: 'fas fa-cogs',
            description: 'Detailed patented inventions, including application numbers and brief descriptions of the technology.',
        },
    ];

    return (
        <AchievementsContainer>
            <Title>Achievements</Title>
            <UploadButtonContainer>
                <Link to="upload">
                    <UploadButton>Upload Achievement</UploadButton>
                </Link>
            </UploadButtonContainer>
            <CardContainer>
                {achievements.map(({ type, icon, description }) => (
                    <Card key={type} onClick={() => handleCardClick(type)}>
                        <CardIcon className={icon} aria-hidden="true" />
                        <CardTitle>{type}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </Card>
                ))}
            </CardContainer>
        </AchievementsContainer>
    );
};

export default Student_Achievement;

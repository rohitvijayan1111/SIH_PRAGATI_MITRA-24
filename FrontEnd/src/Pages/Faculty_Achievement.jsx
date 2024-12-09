import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AchievementsContainer = styled.div`
    font-family: 'Roboto', sans-serif;
    background-color: #f8fafc;
    color: #333;
    padding: 20px 40px;
    min-height: 100vh;
`;

const AchievementsHeading = styled.h2`
    font-size: 2.8rem;
    color: #003366;
    margin-bottom: 30px;
    font-weight: bold;
    text-align: center;
    position: relative;

    &::after {
        content: '';
        width: 100px;
        height: 4px;
        background-color: #003366;
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
    }
`;

const UploadButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
`;

const UploadButton = styled(Link)`
    padding: 12px 30px;
    font-size: 18px;
    cursor: pointer;
    background: linear-gradient(135deg, #004080, #0059b3);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background: linear-gradient(135deg, #003366, #004080);
        transform: translateY(-3px);
    }
`;

const TopBar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
`;

const SearchBar = styled.input`
    padding: 10px;
    font-size: 16px;
    width: 60%;
    max-width: 400px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    transition: box-shadow 0.3s;

    &:focus {
        box-shadow: 0 0 10px rgba(0, 0, 255, 0.2);
    }
`;

const ExportButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    background-color: #28a745;
    color: white;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #218838;
        transform: translateY(-3px);
    }
`;

const CardContainer = styled.div`
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
`;

const CardLink = styled(Link)`
    text-decoration: none;
    width: calc(33% - 20px);
    min-width: 280px;
    max-width: 400px;
`;

const Card = styled.div`
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    overflow: hidden;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    }
`;

const CardIcon = styled.i`
    font-size: 3rem;
    color: #0059b3;
    margin-bottom: 15px;
`;

const CardTitle = styled.h3`
    font-size: 1.6rem;
    color: #003366;
    font-weight: bold;
    margin-bottom: 12px;
`;

const CardDescription = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
`;

const Faculty_Achievement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAchievements, setFilteredAchievements] = useState([]);

    const achievements = useMemo(() => [
        { type: 'Research Papers', icon: 'fas fa-book', description: 'Published research papers in various journals and conferences.' },
        { type: 'Patents', icon: 'fas fa-cogs', description: 'Filed and granted patents for innovative solutions.' },
        { type: 'Conference', icon: 'fas fa-chalkboard-teacher', description: 'Presented at national and international conferences.' },
        { type: 'Book Published', icon: 'fas fa-book-open', description: 'Authored and published books in relevant fields.' },
        { type: 'Award Received', icon: 'fas fa-trophy', description: 'Received awards for outstanding achievements and contributions.' },
    ], []);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        setFilteredAchievements(
            achievements.filter(achievement =>
                achievement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, achievements]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <AchievementsContainer>
            <AchievementsHeading>Achievements</AchievementsHeading>
           
            <UploadButtonContainer>
                <UploadButton to="upload">Upload Achievement</UploadButton>
            </UploadButtonContainer>
            <CardContainer>
                {filteredAchievements.map(({ type, icon, description }) => (
                    <CardLink to={`details/${encodeURIComponent(type)}`} key={type}>
                        <Card>
                            <CardIcon className={icon} aria-hidden="true"></CardIcon>
                            <CardTitle>{type}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </Card>
                    </CardLink>
                ))}
            </CardContainer>
        </AchievementsContainer>
    );
};

export default Faculty_Achievement;

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import styled from 'styled-components'; 
import { getTokenData } from "../Pages/authUtils";
import Navigation from "./Navigation";
import SideBar_Infra from "../Pages/SideBar_Infra";

import Finance_Sidebar from "../Pages/Finance_Sidebar";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const tokenData = getTokenData();
    let user = tokenData.role;
    const navigate = useNavigate(); // Added to handle navigation

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('loggedIn');
        if (isLoggedIn === 'false') {
            navigate('/'); 
        }
    }, [navigate]);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <Container>
            <NavBar onToggleSidebar={toggleSidebar} />
            <ContentWrapper>
                <SidebarContainer>
                    
                    {user==="Infrastructure Coordinator" && <SideBar_Infra/>}
                    {user==="Finance Coordinator" && <Finance_Sidebar/>}
                    {user==="Student" && <Finance_Sidebar/>}
                    {user !== 'Event Coordinator' && user!=="Finance Coordinator" && user!== 'Attendance Manager' && user!=="Student"  && user!=="Faculty"  && user!=="Infrastructure Coordinator" && <SideBar/>}
                </SidebarContainer>
                <MainContent>
                    <Navigation />
                    <Outlet /> {/* Render nested routes */}
                </MainContent>
            </ContentWrapper>
        </Container>
    );
}

export default Layout;

// Styled Components

const Container = styled.div`
    margin-top: 0%;
    width: 100%;
    height: 100%;
`;

const ContentWrapper = styled.div`
    display: flex;
`;

const SidebarContainer = styled.aside`
`;

const MainContent = styled.div`
    margin-left: 85px;
    width: 100%;
    min-height: 100vh;
    background-color: #f4f4f4;
    @media (max-width: 480px) {
        margin-left: 0px;
    }
`;

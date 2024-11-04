import React, { useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import './Layout.css'; 
import Navigation from "./Navigation";
import Attendance_SideBar from "../Attendance_Component/Attendance_SideBar";
import HallBooking_SideBar from "../HallBooking_Component/HallBooking_SideBar";
import { getTokenData } from "../Pages/authUtils";
const Layout = () => {
    const tokenData=getTokenData();
    let user = tokenData.role;
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('loggedIn');
        if (isLoggedIn === 'false') {
          navigate('/'); 
        }
    }, []);

    return (
        <div>
            <NavBar/>
            <div className="er">
                <aside>
      {user=== 'Attendance Manager' && <Attendance_SideBar/>}
      {user === 'Event Coordinator' && <HallBooking_SideBar/>}
      {user !== 'Event Coordinator' && user!== 'Attendance Manager' && <SideBar/>}
                </aside>
                <div className="pr">
                <Navigation/>
                    <div className="main-frame">
                    <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;

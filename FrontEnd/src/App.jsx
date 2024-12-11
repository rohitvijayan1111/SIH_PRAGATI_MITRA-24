import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes,Route,useLocation } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout';
import DashBoard from './Pages/DashBoard';
import LoginPage from './Pages/LoginPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import SignPage from './Pages/Signup';
import EmailNotification from "./Pages/EmailNotification";
import EditForm from "./Pages/EditForm";
import ViewForm from "./Pages/ViewForm";
import AddForm from "./Pages/AddForm";
import CreateNewForm from "./Pages/CreateNewForm";
import ViewOtherForms from "./Pages/ViewOtherForms";
import Invalidpage from "./Pages/Invalidpage";
import OtherForms from "./Components/OtherForms";
import OtherFormsRecords from "./Components/OtherFormsRecords";
import ProtectedRoute from "./Pages/ProtectedRoute";
import SetDeadlinePage from "./Components/SetDeadlinePage";
import AssignTask from "./Components/AssignTask";
import Shadow_OtherForms from "./Components/Shadow_OtherForms";
import ManageAssignedUsers from "./Components/ManageAssignedUsers";
import AddNewRecord from "./Pages/AddNewRecord";
import { ViewOtherFormRecord, EditOtherFormRecord } from "./Pages/ViewOtherFormRecord";
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from "./Pages/HomePage";
import FormSelectionPage from "./Pages/FormSelectionPage";
import ChatSpace from "./Pages/ChatSpace";
import DatabasePage from "./Pages/DatabasePage";
import UploadDatabasePage from "./Pages/UploadDatabasePage";
import DetailsPage from "./Pages/DetailsPage";

import TablesPage from "./Pages/TablesPage";
import CreateFormPage from "./Pages/CreateFormPage";
import RenderFormPage from "./Pages/RenderFormPage";
import OtherFormsRecordForIconNondept from "./Components/OtherFormsRecordsForIconNondept";
import AddFormnonDept from "./Pages/AddFormnonDept";
import EditFormNonDep from "./Pages/EditFormNonDep";
import CreateReport from "./Pages/CreateReport";
import ReportsList from "./Pages/ReportsList";
import OtherFormsRecordForIcon from "./Components/OtherFormsRecordsForIcon";
import Documents from "./Pages/Reportgenaration";
import DashboardSettings from "./Pages/DashboardSettings";
import FinanceSummaryTable from "./Pages/FinanceSummaryTable";
import Student_Achive_Form from "./Pages/Student_Achive_Form";
import Student_Achive_Detail from "./Pages/Student_Achive_Detail";
import Student_Achievement from "./Pages/Student_Achievement";
import Faculty_Achievement from "./Pages/Faculty_Achievement";
import Faculty_AchieForm from "./Pages/Faculty_AchieForm";
import Faculty_AchieDetails from "./Pages/Faculty_AchieDetails";
import Faculty_Std_Analysis from "./Pages/Faculty_Std_Analysis";

import GraphConfigWizard from "./Pages/GraphConfigWizard";
import SimpleDashboardWizard from "./Pages/DashboardSettings";
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return ( 
    
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className='app'>
       <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<DetailsPage/>} />
            <Route path="/login" element={ <LoginPage/> } />
            <Route path="/invalidpage" element={<Invalidpage />} />
            <Route path="/signup" element={<SignPage />} />
            <Route path="/dashboard/*" element={<Layout />}>
            <Route index element={<ProtectedRoute element={DashBoard} />} />
            <Route path="settings/create-new-graph" element={<ProtectedRoute element={DashboardSettings} />} />
            <Route path="settings/create-new-graph-ai" element={<ProtectedRoute element={GraphConfigWizard} />} />
              {/* <Route path="club-activity" element={<ProtectedRoute element={Clubactivities} />} /> */}
              <Route path="mail" element={<ProtectedRoute element={EmailNotification} />} />
              {/* <Route path="view-other-forms" element={<ViewOtherForms />} />
              <Route path="view-other-forms/new-form" element={<CreateNewForm/>} />
              <Route path="view-other-forms/new-record" element={<AddNewRecord />} />
              <Route path="view-other-forms/view-record" element={<ViewOtherFormRecord />} />
              <Route path="view-other-forms/view-record/edit-form-record" element={<EditOtherFormRecord />} /> */}
              <Route path="forms" element={<OtherForms/>} />
              <Route path="gforms" element={<HomePage/>} />
              <Route path="form-type" element={ <FormSelectionPage/> } />
              <Route path="chat" element={<ChatSpace/>} />
              <Route path="dynamic" element={ <DatabasePage/> } />
              <Route path="details" element={ <DetailsPage/> } />
              <Route path="dbimport" element={ <UploadDatabasePage/> } />
              <Route path="dynamic/tables/:database" element={ <TablesPage/> } />
              <Route path="gforms/gcreate-form" element={<CreateFormPage/>} />
              <Route path="gforms/render-form/:id" element={<RenderFormPage />} />
              <Route path="assigned-forms" element={<Shadow_OtherForms/>} />
              <Route path="forms/deadline" element={<SetDeadlinePage/>} />
              <Route path="forms/assign-task" element={<AssignTask/>} />
              <Route path="forms/form-records" element={<OtherFormsRecords/>} />
              <Route path="forms/form-records/:table" element={ <OtherFormsRecordForIcon/> }/>
              <Route path="forms/form-records/:table/add-form" element={<AddForm />} />
              <Route path="forms/form-records/:table/edit-form" element={<EditForm />} />
              <Route path="nondeptforms/form-records/:table" element={<OtherFormsRecordForIconNondept/>}/>
              <Route path="nondeptforms/form-records/:table/add-form" element={<AddFormnonDept />} />
              <Route path="nondeptforms/form-records/:table/edit-form" element={<EditFormNonDep/>}/>
              
              <Route path="forms/Manage-Assigned-Users" element={<ManageAssignedUsers/>} />
              <Route path="forms/form-records/edit-form" element={<EditForm/>} />
              <Route path="forms/form-records/add-form" element={<AddForm />} />
              <Route path="forms/create-form" element={<CreateNewForm/>} />
              <Route path="faculty-details/edit-form" element={<EditForm/>} />
              <Route path="faculty-details/add-form" element={<AddForm />} />
              <Route path="*" element={<Invalidpage />} />

              <Route path="gforms" element={<HomePage/>} />
              <Route path="form-type" element={ <FormSelectionPage/> } />
              <Route path="chat" element={<ChatSpace/>} />
              <Route path="dynamic" element={ <DatabasePage/> } />
              <Route path="dbimport" element={ <UploadDatabasePage/> } />
              <Route path="dynamic/tables/:database" element={ <TablesPage/> } />
              <Route path="gforms/gcreate-form" element={<CreateFormPage/>} />
              <Route path="gforms/render-form/:id" element={<RenderFormPage />} />
              <Route path="report-generation" element={ <Documents/> }/>
              <Route path="initiate-report" element={<CreateReport/>}/>
              <Route path="Reports" element={<ReportsList/>}/>
              <Route path="settings/create-new-graph" element={<ProtectedRoute element={DashboardSettings} />} />
              <Route path="summary" element = {<FinanceSummaryTable/>}/>
              <Route path = "student_Achievement/upload" element={<Student_Achive_Form/>}/>
              <Route path = "student_Achievement/details/:type" element={<Student_Achive_Detail/>}/>
              <Route path = "student_Achievement" element={<Student_Achievement/>}/>

              <Route path = "faculty_Achievement" element={<Faculty_Achievement/>}/>
                 <Route path = "faculty_Achievement/upload" element={<Faculty_AchieForm/>}/>
                 <Route path = "faculty_Achievement/details/:type" element={<Faculty_AchieDetails/>}/>
                 <Route path = "faculty_std_analysis" element={<Faculty_Std_Analysis/>}/>


            </Route>
            <Route path="*" element={<Invalidpage />} />
          </Routes>
        </Router>
      </div>
    </LocalizationProvider>
  );
}

export default App;

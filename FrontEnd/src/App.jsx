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
import AddForm from "./Pages/AddForm";
import CreateNewForm from "./Pages/CreateNewForm";
import Invalidpage from "./Pages/Invalidpage";
import OtherForms from "./Components/OtherForms";
import OtherFormsRecords from "./Components/OtherFormsRecords";
import ProtectedRoute from "./Pages/ProtectedRoute";
import SetDeadlinePage from "./Components/SetDeadlinePage";
import AssignTask from "./Components/AssignTask";
import Shadow_OtherForms from "./Components/Shadow_OtherForms";
import ManageAssignedUsers from "./Components/ManageAssignedUsers";
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from "./Pages/HomePage";
import CreateFormPage from "./Pages/CreateFormPage";
import RenderFormPage from "./Pages/RenderFormPage";
import ChatSpace from "./Pages/ChatSpace";
import FormSelectionPage from "./Pages/FormSelectionPage";
import DatabasePage from "./Pages/DatabasePage";
import TablesPage from "./Pages/TablesPage";
import UploadDatabasePage from "./Pages/UploadDatabasePage";
import DetailsPage from "./Pages/DetailsPage";
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
              <Route path="forms/Manage-Assigned-Users" element={<ManageAssignedUsers/>} />
              <Route path="forms/form-records/edit-form" element={<EditForm/>} />
              <Route path="forms/form-records/add-form" element={<AddForm />} />
              <Route path="forms/create-form" element={<CreateNewForm/>} />
              <Route path="faculty-details/edit-form" element={<EditForm/>} />
              <Route path="faculty-details/add-form" element={<AddForm />} />
              <Route path="*" element={<Invalidpage />} />
            </Route>
            <Route path="*" element={<Invalidpage />} />
          </Routes>
        </Router>
      </div>
    </LocalizationProvider>
  );
}

export default App;

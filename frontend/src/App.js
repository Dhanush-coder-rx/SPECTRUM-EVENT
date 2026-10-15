import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Register from './Register';
import Login from './Login';
import AdminDashboard from './AdminComponents/AdminDashboard';
import ManageHomeImages from './AdminComponents/ManageHomeImages';
import ManageManager from './AdminComponents/ManageManager';
import UpdatePassword from './AdminComponents/UpdatePassword';
import ViewAssignedEvents from './AdminComponents/ViewAssignedEvents';
import ManageRegEvents from './AdminComponents/ManageRegEvents';
import ManagerDashboard from './ManagerComponents/ManagerDashboard';
import UpdatePasswordmanager from './ManagerComponents/UpdatePasswordmanager';
import UserDashboard from './UserComponents/UserDashboard';
import ManageEventsType from './AdminComponents/ManageEventsType';
import BookEvent from './UserComponents/BookEvent';
import ViewRegisterEvents from './UserComponents/ViewRegisterEvents';
import AssignEvents from './AdminComponents/AssignEvents';
import ViewAssignedTask from './ManagerComponents/ViewAssignedTask';
import AddEventImages from './ManagerComponents/AddEventImages';
import OurServices from './UserComponents/OurServices';
import OurServicesHome from './OurServicesHome';
import UpdatePasswordUser from './UserComponents/UpdatePasswordUser';

export const baseurl = "http://localhost:8080"

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <ToastContainer />
           <Routes>
               <Route path="/" element={<Home />} />   
               <Route path="/login" element={<Login />} />   
               <Route path="/register" element={<Register />} />  
               <Route path="/OurServicesHome" element={<OurServicesHome />} />  

               <Route path="/adminDashboard" element={<AdminDashboard />}>
               <Route path="AssignEvents" element={<AssignEvents />} />
               <Route path="manageRegEvents" element={<ManageRegEvents />} />
               <Route path="viewAssignedEvents" element={<ViewAssignedEvents />} />
               <Route path="manageManager" element={<ManageManager />} />
               <Route path="manageEventsType" element={<ManageEventsType />} />
               <Route path="manageHomeImages" element={<ManageHomeImages />} />
              
               <Route path="updatePassword" element={<UpdatePassword />} />
               </Route>
               
               <Route path="/managerDashboard" element={<ManagerDashboard />}>ViewAssignedTask

               <Route path="ViewAssignedTask" element={<ViewAssignedTask />} />
               <Route path="AddEventImages" element={<AddEventImages />} />
              
               
               <Route path="updatePasswordmanager" element={<UpdatePasswordmanager />} />
               
               </Route>
             
               <Route path="/userDashboard" element={<UserDashboard />}>
               
               <Route path="BookEvent" element={<BookEvent/>} />
               <Route path="ViewRegisterEvents" element={<ViewRegisterEvents/>} />
               <Route path="OurServices" element={<OurServices />} />
               <Route path="UpdatePasswordUser" element={<UpdatePasswordUser />} />
               {/* <Route path="viewBudget" element={<ViewBudget/>} /> 
               <Route path="viewVacancies" element={<ViewVacancies />} /> 
               <Route path="giveFeedbacks" element={<GiveFeedbacks />} /> 
               <Route path="aboutUs" element={<AboutUs/>}/>
               <Route path="updateProfile" element={<UpdateProfile />} /> */}
               </Route>
               
           </Routes>
           </BrowserRouter>
   </div>
  );
}

export default App;

// ================= App.tsx =================
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { SiteSettingsProvider } from './siteSettingsContext';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ToursPage from './pages/ToursPage';
import BusesPage from './pages/BusesPage';
import ListingDetailPage from './pages/ListingDetailPage';
import RentalsPage from './pages/RentalsPage';
import TaxiBusesPage from './pages/TaxiBusesPage';
import TourPackagesPage from './pages/TourPackagesPage';
import DriversPage from './pages/DriversPage';
import HotelBookingsPage from './pages/HotelBookingsPage';
import DrivingSchoolPage from './pages/DrivingSchoolPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyNotificationsPage from './pages/MyNotificationsPage';
import ProfilePage from './pages/ProfilePage';
import StatusPage from './pages/StatusPage';

import './App.css';

const App: React.FC = () => (
  <AuthProvider>
    <SiteSettingsProvider>
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<MainLayout />}> 
          <Route path='/' element={<HomePage />} />
          <Route path='/listings' element={<ListingsPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/tours' element={<ToursPage />} />
          <Route path='/buses' element={<BusesPage />} />
          <Route path='/rentals' element={<RentalsPage />} />
          <Route path='/taxi-buses' element={<TaxiBusesPage />} />
          <Route path='/tour-packages' element={<TourPackagesPage />} />
          <Route path='/drivers' element={<DriversPage />} />
          <Route path='/hotel-bookings' element={<HotelBookingsPage />} />
          <Route path='/driving-school' element={<DrivingSchoolPage />} />
          <Route path='/listings/:id' element={<ListingDetailPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/my-bookings' element={<MyBookingsPage />} />
          <Route path='/status' element={<StatusPage />} />
          <Route path='/my-notifications' element={<MyNotificationsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </SiteSettingsProvider>
  </AuthProvider>
);

export default App;

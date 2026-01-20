import { Routes, Route } from 'react-router-dom';
// 1. IMPORT BOTH PAGES
import LandingPage from './main/main'; 
import Logup from './auth/logup'; 
import Login from './auth/login';
import Dashboard from './page/dashboard';
import MovieDetails from './page/MovieDetails';
import AddToListModal from './components/AddToListModal';
import MyLists from './page/MyLists';
import Trending from './page/Trending';
import Reviews from './page/Reviews';
import Profile from './page/Profile';
import EditProfileModal from './components/EditProfileModal';
import ProfileSkeleton from './components/skeleton';
import ForgotPassword from './auth/forget/ForgotPassword';
import ResetPassword from './auth/forget/ResetPassword';
function App() {
  return (
    <Routes>
      {/* 2. DEFINE THE STARTING PAGE */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/logup" element={<Logup />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/page/dashboard" element={<Dashboard />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/movie/:id/add-to-list" element={<AddToListModal />} />
      <Route path="/page/MyLists" element={<MyLists />} />
      <Route path="/page/trending" element={<Trending />} />
      <Route path="/page/Reviews" element={<Reviews />} />
      <Route path="/page/profile" element={<Profile />} />
      <Route path="/components/profile/edit" element={<EditProfileModal />} />
      <Route path="/components/profile/skeleton" element={<ProfileSkeleton />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
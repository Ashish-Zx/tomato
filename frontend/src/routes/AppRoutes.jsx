import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../pages/general/Home'
import CreateFood from '../pages/food-partner/CreateFood'
import Profile from '../pages/food-partner/Profile'
import Dashboard from '../pages/food-partner/Dashboard'
import UserProfile from '../pages/user/UserProfile'

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/foodPartner/register" element={<FoodPartnerRegister />} />
                <Route path="/foodPartner/login" element={<FoodPartnerLogin />} />
                <Route path="/" element={<Home />} />
                <Route path="/foodPartner/dashboard" element={<Dashboard />} />
                <Route path="/foodPartner/create-food" element={<CreateFood />} />
                <Route path="/foodPartner/profile/:id" element={<Profile />} />

            </Routes>

        </Router>
    )
}

export default AppRoutes
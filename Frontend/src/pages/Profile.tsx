
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    Edit,
    LogOut,
    ChevronRight,
    Trash2,
    Info,
    HelpCircle,
    EditIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

// Types for backend compatibility
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    profileType: string;
    profileDetails: Record<string, any>;
    profileCompleted: boolean;
}

interface OrganizationUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'Admin' | 'Member';
}


interface ProfileProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const Profile = ({ toggleTheme, isDarkMode }: ProfileProps) => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('https://ingeniumai.onrender.com/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                setUserProfile(data);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    // Mock data - will be replaced with backend data
    // const [userProfile] = useState<UserProfile>({
    //     id: '1',
    //     name: 'John Doe',
    //     email: 'john.doe@example.com',
    //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    // });

    const [organizationUsers] = useState<OrganizationUser[]>([
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e3c2d2?w=150&h=150&fit=crop&crop=face',
            role: 'Admin'
        },
        {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            role: 'Member'
        },
        {
            id: '4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            role: 'Member'
        }
    ]);

    const handleLogout = () => {
        // Sign out from Google OAuth session
        googleLogout();

        // Clear local data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profileCompleted');
        localStorage.removeItem('hasProfileType');

        // Redirect to login/home
        navigate('/');
        console.log('Logged out');
    };

    const handleEditProfile = () => {
        // Edit profile logic will be implemented here
        console.log('Edit profile clicked');
    };

    const handleDeleteAccount = () => {
        // Delete account logic will be implemented here
        console.log('Delete account clicked');
    };

    const handleChangeName = () => {
        // Change name logic will be implemented here
        console.log('Change name clicked');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
            />

            <main className="flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                User Profile
                            </h1>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-5 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </Button>
                    </header>

                    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10">
                        {/* Profile Section */}
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative">
                                        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-purple-200">
                                            {/* <AvatarImage src={userProfile.avatar} alt={userProfile.name} /> */}
                                            <AvatarImage src={user.picture} alt={user.name} />
                                            <AvatarFallback className="text-2xl sm:text-3xl">
                                                {/* {userProfile.name.split(' ').map(n => n[0]).join('')} */}
                                                {user.name.split(' ')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                                            {/* {userProfile.name} */}
                                            {user.name}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                                            {/* {userProfile.email} */}
                                            {user.email}
                                        </p>
                                        <button
                                            onClick={handleEditProfile}
                                            className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-150 mx-auto sm:mx-0"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            <span>Edit Profile Details</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization Users */}
                        {/* Show Organisation Users only if profileType is 'organisation' */}
                        {userProfile?.profileType === 'organization' && (
                            <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                                        Organisation Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 sm:p-8 pt-0">
                                    <div className="space-y-4">
                                        {organizationUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback className="text-sm">
                                                            {user.name.split(' ').map((n) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === 'Admin'
                                                        ? 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
                                                        : 'text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-600'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}


                        {/* Account Settings */}
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                                    Account Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 pt-0">
                                <div className="space-y-3">
                                    <button
                                        onClick={handleChangeName}
                                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                                    >
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Change Name</span>
                                        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-150 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                        <span className="text-sm font-medium">Delete Account</span>
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Footer Links */}
                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardContent className="p-6 sm:p-8">
                                <div className="space-y-3">
                                    <a
                                        href="#"
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">About Us</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                                    >
                                        <div className="flex items-center gap-3">
                                            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Contact Us</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
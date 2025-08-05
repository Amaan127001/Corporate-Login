
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, BarChart3, Mail, Megaphone, User, Menu, Sun, Moon, Plus, Filter, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ListMember {
    id: string;
    avatar: string;
    fullName: string;
    linkedin: string;
    company: string;
    position: string;
    email: string;
}

interface ContactList {
    id: string;
    name: string;
    memberCount: number;
    members: ListMember[];
}

interface ListsProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const SelectList = ({ toggleTheme, isDarkMode }: ListsProps) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [selectedList, setSelectedList] = useState<ContactList | null>(null);
    const [showListDetail, setShowListDetail] = useState(false);
    const [contactLists, setContactLists] = useState<ContactList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [memberForm, setMemberForm] = useState({
        fullName: '',
        email: '',
        linkedin: '',
        company: '',
        position: '',
        avatar: ''
    });

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<ListMember | null>(null);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        linkedin: '',
        company: '',
        position: '',
        avatar: ''
    });

    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [linkedinUrl, setLinkedinUrl] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const toggleSelectMember = (id: string) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleGenerate = () => {
        // Do something with selectedMembers
        console.log('Generating for:', selectedMembers);
    };

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const getAuthHeaders = () => {
        const token = getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // LinkedIn URL validation function
    const isValidLinkedInUrl = (url: string) => {
        const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        return pattern.test(url);
    };

    // Fetch lists from API
    const fetchLists = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/lists`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch lists');
            }

            const data = await response.json();
            setContactLists(data.map((list: any) => ({
                ...list,
                members: [] // Members will be loaded when list is selected
            })));
        } catch (err) {
            console.error('Error fetching lists:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch lists');
        } finally {
            setLoading(false);
        }
    };

    // Fetch members for a specific list
    const fetchListMembers = async (listId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/lists/${listId}/members`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            const members = await response.json();
            return members.map((member: any) => ({
                id: member._id,
                avatar: member.avatar,
                fullName: member.fullName,
                linkedin: member.linkedin,
                company: member.company,
                position: member.position,
                email: member.email
            }));
        } catch (err) {
            console.error('Error fetching members:', err);
            throw err;
        }
    };

    // Add new member
    const addMember = async (listId: string, memberData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/lists/${listId}/members`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add member');
            }

            return await response.json();
        } catch (err) {
            throw err;
        }
    };

    // Update member
    const updateMember = async (listId: string, memberId: string, memberData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/lists/${listId}/members/${memberId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update member');
            }

            return await response.json();
        } catch (err) {
            throw err;
        }
    };

    // Delete member
    const deleteMember = async (listId: string, memberId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/lists/${listId}/members/${memberId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete member');
            }

            return await response.json();
        } catch (err) {
            throw err;
        }
    };

    // Load initial data
    useEffect(() => {
        fetchLists();
    }, []);

    const handleListClick = async (list: ContactList) => {
        try {
            setLoading(true);
            const members = await fetchListMembers(list.id);
            const updatedList = { ...list, members };
            setSelectedList(updatedList);
            setShowListDetail(true);
        } catch (err) {
            setError('Failed to load list members');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLists = () => {
        setShowListDetail(false);
        setSelectedList(null);
        fetchLists(); // Refresh the lists to update member counts
    };

    const resetMemberForm = () => {
        setMemberForm({
            fullName: '',
            email: '',
            linkedin: '',
            company: '',
            position: '',
            avatar: ''
        });
        setEditingMember(null);
    };

    const handleAddMember = async () => {
        if (!isValidLinkedInUrl(linkedinUrl)) {
            alert('Please enter a valid LinkedIn URL');
            return;
        }

        try {
            // Extract profile name from URL
            const profileName = linkedinUrl.split('/in/')[1].replace('/', '');

            // Generate avatar from name
            const nameParts = profileName.split('-').map(part => part.charAt(0)).join('');
            const avatar = `https://ui-avatars.com/api/?name=${nameParts}&background=random`;


            const newMember = {
                avatar,
                fullName: profileName.replace(/-/g, ' '),
                linkedin: linkedinUrl,
                company: 'New Company',
                position: 'New Position',
                email: `${profileName}@example.com`
            };

            if (!selectedList) return;

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/lists/${selectedList.id}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMember)
            });

            if (!response.ok) throw new Error('Failed to add member');

            const addedMember = await response.json();

            // Update UI
            const updatedList = {
                ...selectedList,
                members: [...selectedList.members, {
                    id: addedMember.id,
                    ...newMember
                }],
                memberCount: selectedList.memberCount + 1
            };

            setSelectedList(updatedList);
            setIsAddMemberDialogOpen(false);
            setLinkedinUrl('');

            // Update lists count
            setContactLists(prev =>
                prev.map(list =>
                    list.id === selectedList.id
                        ? { ...list, memberCount: list.memberCount + 1 }
                        : list
                )
            );
        } catch (err) {
            console.error('Error adding member:', err);
            alert('Failed to add member: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    // Add after handleAddMember function
    const handleEditClick = (member: ListMember) => {
        setEditingMember(member);
        setEditForm({
            fullName: member.fullName,
            email: member.email,
            linkedin: member.linkedin,
            company: member.company,
            position: member.position,
            avatar: member.avatar
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedList || !editingMember) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/lists/${selectedList.id}/members/${editingMember.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) throw new Error('Failed to update member');

            const updatedMember = await response.json();

            // Update UI
            const updatedMembers = selectedList.members.map(m =>
                m.id === editingMember.id ? { ...updatedMember, id: m.id } : m
            );

            setSelectedList({
                ...selectedList,
                members: updatedMembers
            });

            setIsEditDialogOpen(false);
            setEditingMember(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update member');
        }
    };

    const handleEditMember = (member: ListMember) => {
        setMemberForm({
            fullName: member.fullName,
            email: member.email,
            linkedin: member.linkedin,
            company: member.company,
            position: member.position,
            avatar: member.avatar
        });
        setEditingMember(member);
        setShowAddMemberModal(true);
    };

    // Replace existing handleDeleteMember function
    const handleDeleteMember = async (member: ListMember) => {
        if (!selectedList) return;

        if (window.confirm(`Are you sure you want to delete ${member.fullName}?`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/lists/${selectedList.id}/members/${member.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete member');

                // Update UI
                const updatedMembers = selectedList.members.filter(m => m.id !== member.id);
                setSelectedList({
                    ...selectedList,
                    members: updatedMembers,
                    memberCount: selectedList.memberCount - 1
                });

                // Update lists count
                setContactLists(prev =>
                    prev.map(list =>
                        list.id === selectedList.id
                            ? { ...list, memberCount: list.memberCount - 1 }
                            : list
                    )
                );
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete member');
            }
        }
    };

    const handleSubmitMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedList) return;

        try {
            if (editingMember) {
                // Update existing member
                const updatedMember = await updateMember(selectedList.id, editingMember.id, memberForm);

                const updatedMembers = selectedList.members.map(m =>
                    m.id === editingMember.id
                        ? { ...updatedMember, id: updatedMember.id }
                        : m
                );

                setSelectedList({
                    ...selectedList,
                    members: updatedMembers
                });
            } else {
                // Add new member
                const newMember = await addMember(selectedList.id, memberForm);

                const updatedMembers = [...selectedList.members, { ...newMember, id: newMember.id }];
                setSelectedList({
                    ...selectedList,
                    members: updatedMembers
                });

                // Update the member count in the lists
                setContactLists(prevLists =>
                    prevLists.map(list =>
                        list.id === selectedList.id
                            ? { ...list, memberCount: list.memberCount + 1 }
                            : list
                    )
                );
            }

            setShowAddMemberModal(false);
            resetMemberForm();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save member');
        }
    };


    if (loading && !showListDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading lists...</p>
                </div>
            </div>
        );
    }

    if (error && !showListDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={fetchLists} className="bg-purple-600 hover:bg-purple-700 text-white">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className={`min-h-screen flex w-full ${isDarkMode ? 'dark' : ''}`}>
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
            />

            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarCollapsed(false)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Menu className="w-5 h-5 text-gray-500" />
                            </button>
                            {showListDetail && selectedList && (
                                <button
                                    onClick={handleBackToLists}
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-white truncate">
                                {showListDetail && selectedList ? selectedList.name : 'Select List'}
                            </h1>
                        </div>

                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
                    {!showListDetail ? (
                        // Lists Overview
                        <div className="space-y-6">
                            {contactLists.map((list) => (
                                <Card
                                    key={list.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
                                    onClick={() => handleListClick(list)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                                {list.name}
                                            </h3>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {list.memberCount} People
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // List Detail View
                        selectedList && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-xl">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Select {selectedList.name} List Members
                                    </h2>
                                    {/* Mobile/Tablet responsive table */}
                                    <div className="overflow-x-auto">
                                        <div className="min-w-full">
                                            {/* Desktop Table View */}
                                            <div className="hidden lg:block">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">LinkedIn</th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedList.members.map((member, index) => (
                                                            <tr key={member.id} className={`${index !== selectedList.members.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}>
                                                                <td className="py-3 px-4 whitespace-nowrap">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mr-2"
                                                                        checked={selectedMembers.includes(member.id)}
                                                                        onChange={() => toggleSelectMember(member.id)}
                                                                    />
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap">
                                                                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                                                        {member.fullName}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap">
                                                                    <a
                                                                        href={member.linkedin}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline text-sm flex items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
                                                                        </svg>
                                                                        Profile
                                                                    </a>
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                                    {member.position}
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                                    {member.company}
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                                    {member.email}
                                                                </td>
                                                                <td className="py-3 px-4 whitespace-nowrap text-right">
                                                                    <button onClick={() => handleEditClick(member)} className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded-full transition-colors duration-200 mr-1">
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteMember(member)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full transition-colors duration-200">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Mobile/Tablet Card View */}
                                            <div className="lg:hidden space-y-4">
                                                {selectedList.members.map((member) => (
                                                    <div key={member.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-start space-x-3">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-2"
                                                                checked={selectedMembers.includes(member.id)}
                                                                onChange={() => toggleSelectMember(member.id)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                                                        {member.fullName}
                                                                    </h4>
                                                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                                                        <button onClick={() => handleEditClick(member)} className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded-full transition-colors duration-200">
                                                                            <Edit className="w-4 h-4" />
                                                                        </button>
                                                                        <button onClick={() => handleDeleteMember(member)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full transition-colors duration-200">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1 text-sm">
                                                                    <p className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Position:</span> {member.position}
                                                                    </p>
                                                                    <p className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Company:</span> {member.company}
                                                                    </p>
                                                                    <p className="text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">Email:</span> {member.email}
                                                                    </p>
                                                                    <a
                                                                        href={member.linkedin}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline inline-flex items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
                                                                        </svg>
                                                                        LinkedIn Profile
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Responsive Pagination */}
                                    <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 space-y-3 sm:space-y-0">
                                        <span className="text-center sm:text-left">
                                            Showing 1 to {selectedList.members.length} of {selectedList.memberCount} entries
                                        </span>
                                        <div className="flex flex-wrap justify-center items-center space-x-1">
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm">&lt;</button>
                                            <button className="p-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium transition-colors duration-200 text-xs sm:text-sm">1</button>
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm">2</button>
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm">3</button>
                                            <span className="p-2 text-xs sm:text-sm">...</span>
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm">12</button>
                                            <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-xs sm:text-sm">&gt;</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors duration-200"
                                        onClick={handleGenerate}
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </main>
            </div>
            {/* Add Member Dialog */}
            {isAddMemberDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add New Member
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAddMemberDialogOpen(false);
                                    setLinkedinUrl('');
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    LinkedIn Profile URL *
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    className={`w-full px-3 py-2 border ${!isValidLinkedInUrl(linkedinUrl) && linkedinUrl.trim()
                                        ? "border-red-500 dark:border-red-400"
                                        : "border-gray-300 dark:border-gray-600"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white`}
                                />
                                {linkedinUrl.trim() && !isValidLinkedInUrl(linkedinUrl) && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                        Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddMemberDialogOpen(false);
                                        setLinkedinUrl('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={handleAddMember}
                                    disabled={!linkedinUrl.trim() || !isValidLinkedInUrl(linkedinUrl)}
                                >
                                    Add Member
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Member Dialog */}
            {isEditDialogOpen && editingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Edit Member
                            </h3>
                            <button
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setEditingMember(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    value={editForm.linkedin}
                                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={editForm.company}
                                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    value={editForm.position}
                                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Avatar URL
                                </label>
                                <input
                                    type="url"
                                    value={editForm.avatar}
                                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Leave empty for auto-generated avatar"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setEditingMember(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Update Member
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectList;

import React, { useState, useEffect } from 'react';
import {
    Reply,
    Forward,
    Archive,
    Trash2,
    MoreVertical,
    Search,
    Download,
    FileText,
    Image as ImageIcon,
    Menu,
    ArrowLeft,
    Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import EmojiPicker from '../components/EmojiPicker';
import AttachmentUpload from '../components/AttachmentUpload';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Attachment {
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'document';
    file?: File;
    url?: string;
}

interface Email {
    id: string;
    sender: string;
    senderEmail: string;
    subject: string;
    preview: string;
    time: string;
    avatar: string;
    isSelected?: boolean;
    content?: string;
    attachments?: Attachment[];
    isRead?: boolean;
}

interface MailData {
    emails: Email[];
    selectedEmail: Email | null;
}


interface MailProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}


const Mail = ({ toggleTheme, isDarkMode }: MailProps) => {
    const auth = useAuth();
    const user = auth.currentUser;
    const API_URL = process.env.REACT_APP_API_URL;
    // Then use `${API_URL}/api/mail` in fetch calls
    // const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyAttachments, setReplyAttachments] = useState<Attachment[]>([]);
    const [showEmailContent, setShowEmailContent] = useState(false);
    const [newEmailTo, setNewEmailTo] = useState('');
    const [newEmailSubject, setNewEmailSubject] = useState('');
    const [newEmailContent, setNewEmailContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [mailData, setMailData] = useState<MailData>({
        emails: [
            {
                id: '1',
                sender: 'Sarah Miller',
                senderEmail: 'sarah.miller@example.com',
                subject: 'Meeting reminder for tomorrow...',
                preview: 'Meeting reminder for tomorrow...',
                time: '10:30 AM',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&w=40&h=40&fit=crop&crop=face&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww',
            },
            {
                id: '2',
                sender: 'John Doe',
                senderEmail: 'john.doe@example.com',
                subject: 'Re: Project Update - Action items',
                preview: 'Re: Project Update - Action items...',
                time: 'Yesterday',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                // isSelected: true,
                content: `Hi Team,

Just wanted to follow up on the action items from our last meeting. Please ensure all tasks are updated in the project tracker by EOD tomorrow.

Let me know if you have any questions.

Thanks,
John`,
                attachments: [
                    { id: 'att1', name: 'Project_Brief_Update.pdf', size: '2.5 MB', type: 'pdf' },
                    { id: 'att2', name: 'Meeting_Notes_Screenshot.png', size: '800 KB', type: 'image' }
                ]
            },
            {
                id: '3',
                sender: 'Emily Carter',
                senderEmail: 'emily.carter@example.com',
                subject: 'Following up on our conversation...',
                preview: 'Following up on our conversation...',
                time: 'Oct 28',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            },
            {
                id: '4',
                sender: 'Michael Brown',
                senderEmail: 'michael.brown@example.com',
                subject: 'Quick question about the report...',
                preview: 'Quick question about the report...',
                time: 'Oct 27',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            },
            {
                id: '5',
                sender: 'Olivia Davis',
                senderEmail: 'olivia.davis@example.com',
                subject: 'Thanks for your help with the...',
                preview: 'Thanks for your help with the...',
                time: 'Oct 26',
                avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face',
            },
            {
                id: '6',
                sender: 'David Wilson',
                senderEmail: 'david.wilson@example.com',
                subject: 'Feedback on the proposal...',
                preview: 'Feedback on the proposal...',
                time: 'Oct 25',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            }
        ],
        selectedEmail: null
    });

    // Set selected email on component mount
    useEffect(() => {
        const selectedEmail = mailData.emails.find(email => email.isSelected);
        if (selectedEmail) {
            setMailData(prev => ({ ...prev, selectedEmail }));
        }
    }, []);

    // After marking as read
    useEffect(() => {
        if (mailData.selectedEmail && !mailData.selectedEmail.isRead && user?.token) {
            fetch(`${API_URL}/api/mail/${mailData.selectedEmail.id}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            // Update local state immediately
            setMailData(prev => ({
                ...prev,
                emails: prev.emails.map(e =>
                    e.id === mailData.selectedEmail?.id ? { ...e, isRead: true } : e
                ),
                selectedEmail: prev.selectedEmail ?
                    { ...prev.selectedEmail, isRead: true } : null
            }));
        }
    }, [mailData.selectedEmail, user?.token]);

    // Define fetchMailData so it can be used elsewhere in the component
    const fetchMailData = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const response = await fetch('https://ingeniumai.onrender.com/api/mail', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch mail data');

            const data = await response.json();
            setMailData({
                emails: data.map(formatEmail),
                selectedEmail: null
            });
        } catch (err) {
            setError('Failed to fetch mail data');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch mail data on component mount or when user changes
    useEffect(() => {
        fetchMailData();
    }, [user]);

    // Helper function to format email
    const formatEmail = (mail: any): Email => ({
        id: mail.id,  // Use mail.id instead of mail._id
        sender: mail.sender,
        senderEmail: mail.senderEmail,
        subject: mail.subject,
        preview: mail.preview,
        time: format(new Date(mail.sentAt), 'hh:mm a'),
        avatar: mail.avatar,
        content: mail.content,
        attachments: mail.attachments?.map((att: any) => ({
            id: att.id,
            name: att.name,
            size: att.size,
            type: att.type,
            url: att.url
        })),
        isRead: mail.isRead
    });

    const handleEmailSelect = (email: Email) => {
        setMailData(prev => ({
            ...prev,
            emails: prev.emails.map(e => ({
                ...e,
                isSelected: e.id === email.id
            })),
            selectedEmail: email
        }));
        setShowEmailContent(true);
    };

    const handleNewEmail = () => {
        setMailData(prev => ({
            ...prev,
            emails: prev.emails.map(e => ({ ...e, isSelected: false })),
            selectedEmail: null
        }));
        setShowEmailContent(true);
    };

    const handleBackToList = () => {
        setShowEmailContent(false);
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !mailData.selectedEmail || !user?.token) return;

        try {
            const response = await fetch('https://ingeniumai.onrender.com/api/mail/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    originalId: mailData.selectedEmail.id,
                    content: replyText,
                    attachments: replyAttachments.map(att => ({
                        id: att.id,
                        name: att.name,
                        size: att.size,
                        type: att.type,
                        url: att.url
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to send reply');

            // Clear and refresh
            setReplyText('');
            setReplyAttachments([]);
            await fetchMailData();
        } catch (err) {
            setError('Failed to send reply');
        }
    };

    const handleSendNewEmail = async () => {
        if (!user?.token || !newEmailTo.trim() || !newEmailSubject.trim()) return;
        setIsSending(true);
        try {
            const response = await fetch(`${API_URL}/api/mail/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    recipientEmail: newEmailTo,
                    subject: newEmailSubject,
                    content: newEmailContent,
                    attachments: replyAttachments.map(att => ({
                        id: att.id,
                        name: att.name,
                        size: att.size,
                        type: att.type,
                        url: att.url
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to send email');

            // Clear state and show success
            setNewEmailTo('');
            setNewEmailSubject('');
            setNewEmailContent('');
            setReplyAttachments([]);
            setShowEmailContent(false);

            // Refresh emails
            fetchMailData();
        } catch (err) {
            setError('Failed to send email');
        } finally {
            setIsSending(false);
        }
    };

    const handleNewEmailEmojiSelect = (emoji: string) => {
        setNewEmailContent(prev => prev + emoji);
    };

    const handleEmailAction = (action: string) => {
        console.log(`Email action: ${action}`, mailData.selectedEmail);
        // TODO: Implement actual email actions
    };

    const handleEmojiSelect = (emoji: string) => {
        setReplyText(prev => prev + emoji);
    };

    const handleAttachmentAdd = async (files: FileList) => {
        if (!user?.token) return;
        try {
            const newAttachments = await Promise.all(
                Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch(`${API_URL}/api/upload`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });

                    if (!response.ok) throw new Error('Upload failed');
                    return await response.json();
                })
            );

            setReplyAttachments(prev => [...prev, ...newAttachments]);
        } catch (err) {
            setError('Failed to upload attachments');
        }
    };



    const handleAttachmentRemove = (id: string) => {
        setReplyAttachments(prev => prev.filter(att => att.id !== id));
    };

    const handleDownloadAttachment = (attachment: Attachment) => {
        if (!attachment.url) return;
        window.open(`${API_URL}${attachment.url}`, '_blank');
    };

    const handleDeleteEmailAttachment = (emailId: string, attachmentId: string) => {
        setMailData(prev => ({
            ...prev,
            emails: prev.emails.map(email => {
                if (email.id === emailId) {
                    return {
                        ...email,
                        attachments: email.attachments?.filter(att => att.id !== attachmentId)
                    };
                }
                return email;
            }),
            selectedEmail: prev.selectedEmail?.id === emailId ? {
                ...prev.selectedEmail,
                attachments: prev.selectedEmail.attachments?.filter(att => att.id !== attachmentId)
            } : prev.selectedEmail
        }));
    };

    const filteredEmails = mailData.emails.filter(email =>
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                            >
                                <Menu className="w-5 h-5 text-gray-500" />
                            </button>
                            {showEmailContent && (
                                <button
                                    onClick={handleBackToList}
                                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                {showEmailContent && mailData.selectedEmail ? mailData.selectedEmail.subject : showEmailContent && !mailData.selectedEmail ? 'New Email' : 'Mails'}
                            </h1>
                            {isLoading && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-gray-500">Loading...</span>
                                </div>
                            )}
                        </div>
                        {/* New Email Button - Only show when no email is selected */}
                        {!showEmailContent && (
                            <Button
                                onClick={handleNewEmail}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="w-4 h-4" />
                                New Email
                            </Button>
                        )}
                    </div>
                </header>

                {/* Error Display */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex-shrink-0">
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        <button
                            onClick={fetchMailData}
                            className="mt-2 text-red-600 dark:text-red-400 text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 flex overflow-hidden min-h-0">
                    {/* Email List */}
                    <div className={`w-full lg:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto ${showEmailContent ? 'hidden lg:block' : 'block'
                        }`}>
                        {/* Search */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search mail..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email List */}
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredEmails.map((email) => (
                                <div
                                    key={email.id}
                                    onClick={() => handleEmailSelect(email)}
                                    className={`p-4 cursor-pointer transition-colors ${email.id === mailData.selectedEmail?.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <img
                                                src={email.avatar}
                                                alt={`Profile of ${email.sender}`}
                                                className="h-10 w-10 rounded-full mr-3 flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className={`font-semibold truncate ${email.isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
                                                    }`}>
                                                    {email.sender}
                                                </h3>
                                                <p className={`text-sm truncate ${email.isSelected ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {email.preview}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                                            {email.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Content */}
                    <div className={`flex-1 flex-col bg-gray-50 dark:bg-gray-900 ${showEmailContent ? 'flex' : 'hidden lg:flex'
                        } min-h-0`}>
                        {mailData.selectedEmail ? (
                            <>
                                {/* Email Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                            {mailData.selectedEmail.subject}
                                        </h2>
                                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEmailAction('reply')}
                                            >
                                                <Reply className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEmailAction('forward')}
                                            >
                                                <Forward className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEmailAction('archive')}
                                            >
                                                <Archive className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEmailAction('delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEmailAction('more')}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        From: {mailData.selectedEmail.sender} &lt;{mailData.selectedEmail.senderEmail}&gt;
                                    </div>
                                </div>

                                {/* Email Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Original Message */}
                                    {/* <div className="flex">
                                        <img
                                            src={mailData.selectedEmail.avatar}
                                            alt={`Profile of ${mailData.selectedEmail.sender}`}
                                            className="h-10 w-10 rounded-full mr-4 mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {mailData.selectedEmail.sender}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {mailData.selectedEmail.time}
                                                </span>
                                            </div>
                                            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                                {mailData.selectedEmail.content}
                                            </div>
                                        </div>
                                    </div> */}
                                    {mailData.selectedEmail && (
                                        <div className="flex">
                                            <img
                                                src={mailData.selectedEmail.avatar}
                                                alt={`Profile of ${mailData.selectedEmail.sender}`}
                                                className="h-10 w-10 rounded-full mr-4 mt-1 flex-shrink-0"
                                            />
                                            <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {mailData.selectedEmail.sender}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {mailData.selectedEmail.time}
                                                    </span>
                                                </div>
                                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                                    {mailData.selectedEmail.content}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Your Reply */}
                                    <div className="flex">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                            alt="Your profile"
                                            className="h-10 w-10 rounded-full mr-4 mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-blue-700 dark:text-blue-300">You</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Today, 9:15 AM</span>
                                            </div>
                                            <div className="text-gray-700 dark:text-gray-300">
                                                Hi John,<br /><br />
                                                Thanks for the reminder. I've updated my tasks in the tracker.<br /><br />
                                                Best,<br />
                                                [Your Name]
                                            </div>
                                            {/* Action Buttons within the message */}
                                            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:gap-6 mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                                                <Button
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm"
                                                    size="sm"
                                                >
                                                    ✓ Approve
                                                </Button>
                                                <Button
                                                    className="bg-blue-500 text-white hover:bg-blue-600 text-xs sm:text-sm"
                                                    size="sm"
                                                >
                                                    <img src="https://img.icons8.com/?size=15&id=11737&format=png&color=FFFFFF" alt="edit" /> Edit
                                                </Button>
                                                <Button
                                                    className="bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm"
                                                    size="sm"
                                                >
                                                    <img src="https://img.icons8.com/?size=15&id=C19x5dib8DcR&format=png&color=FFFFFF" alt="reg" /> Regenerate
                                                </Button>
                                                <Button
                                                    className="bg-gray-400 text-black hover:bg-gray-500 text-xs sm:text-sm"
                                                    size="sm"
                                                >
                                                    <img src="https://img.icons8.com/?size=15&id=91474&format=png&color=000000" alt="skip" /> Skip
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachments */}
                                    {mailData.selectedEmail.attachments && mailData.selectedEmail.attachments.length > 0 && (
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                Attachments ({mailData.selectedEmail.attachments.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {mailData.selectedEmail.attachments.map((attachment) => (
                                                    <div
                                                        key={attachment.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                                                    >
                                                        <div className="flex items-center">
                                                            {attachment.type === 'pdf' || attachment.type === 'document' ? (
                                                                <FileText className="text-red-500 mr-3 w-5 h-5" />
                                                            ) : (
                                                                <ImageIcon className="text-blue-500 mr-3 w-5 h-5" />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                    {attachment.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {attachment.size}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDownloadAttachment(attachment)}
                                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteEmailAttachment(mailData.selectedEmail!.id, attachment.id)}
                                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Section */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    <Textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Reply to ${mailData.selectedEmail.sender}...`}
                                        className="mb-3 min-h-[100px] resize-none border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />

                                    <AttachmentUpload
                                        attachments={replyAttachments}
                                        onAttachmentAdd={handleAttachmentAdd}
                                        onAttachmentRemove={handleAttachmentRemove}
                                    />

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center space-x-2">
                                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                        </div>
                                        <Button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim()}
                                            className='border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                                        >
                                            <img src="https://img.icons8.com/?size=20&id=86032&format=png&color=385CE9" alt="send" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : showEmailContent ? (
                            <div className="flex-1 flex flex-col">
                                {/* New Email Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Compose New Email
                                    </h2>
                                    <div className="space-y-4">
                                        <Input
                                            type="email"
                                            placeholder="To: recipient@example.com"
                                            value={newEmailTo}
                                            onChange={(e) => setNewEmailTo(e.target.value)}
                                            className="w-full dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Subject"
                                            value={newEmailSubject}
                                            onChange={(e) => setNewEmailSubject(e.target.value)}
                                            className="w-full dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* New Email Content */}
                                <div className="flex-1 p-6">
                                    <Textarea
                                        value={newEmailContent}
                                        onChange={(e) => setNewEmailContent(e.target.value)}
                                        placeholder="Write your email..."
                                        className="w-full min-h-[300px] resize-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    />
                                </div>

                                {/* New Email Compose Section */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-400">
                                    <AttachmentUpload
                                        attachments={replyAttachments}
                                        onAttachmentAdd={handleAttachmentAdd}
                                        onAttachmentRemove={handleAttachmentRemove}
                                    />

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center space-x-2">
                                            <EmojiPicker onEmojiSelect={handleNewEmailEmojiSelect} />
                                        </div>
                                        <Button
                                            onClick={handleSendNewEmail}
                                            disabled={isSending || !newEmailTo.trim() || !newEmailSubject.trim() || !newEmailContent.trim()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isSending ? 'Sending...' : 'Send Email'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-400">Select an email to view its content</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Mail;

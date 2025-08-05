import React, { useState } from 'react';
import {
    Rocket,
    Sparkles,
    ArrowRight,
    BookOpen,
    HelpCircle,
    Play,
    Menu
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';


interface CampProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}


const Campaigns = ({ toggleTheme, isDarkMode }: CampProps) => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);


    const handleCopilotMode = () => {
        // Future: Navigate to copilot campaign creation flow
        navigate('/selectlist');
        console.log('Starting Copilot Mode');
    };

    const handleAutopilotMode = () => {
        // Future: Navigate to autopilot campaign creation flow
        navigate('/selectlist');
        console.log('Launching Autopilot Mode');
    };

    const learnMoreItems = [
        {
            title: 'Campaign Best Practices',
            description: 'Discover tips for creating high-performing campaigns.',
            icon: BookOpen,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'Tutorials & Guides',
            description: 'Watch video tutorials and read step-by-step guides.',
            icon: Play,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            title: 'FAQ & Support',
            description: 'Find answers to common questions or contact support.',
            icon: HelpCircle,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
    ];

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
            />

            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-200">
                <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 ">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="lg:hidden p-2 mb-4 rounded-md hover:bg-accent"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                            Create Campaign
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Choose your campaign mode to get started.
                        </p>
                    </div>

                    {/* Campaign Mode Cards */}
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
                        {/* Copilot Mode */}
                        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 p-6 rounded-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl">Copilot Mode</CardTitle>
                                </div>
                                <p className="text-muted-foreground">
                                    Guided assistance for campaign creation.
                                </p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    Copilot mode provides step-by-step guidance, suggestions, and AI-powered
                                    assistance to help you craft effective campaigns. Ideal for users who want
                                    more control and customization with expert support.
                                </p>
                                <Button
                                    onClick={handleCopilotMode}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    size="lg"
                                >
                                    Start with Copilot
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Autopilot Mode */}
                        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 p-6 rounded-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                        <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl">Autopilot Mode</CardTitle>
                                </div>
                                <p className="text-muted-foreground">
                                    Fully automated campaign setup.
                                </p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    Autopilot mode automates the entire campaign creation process based on
                                    your goals and inputs. Perfect for users who want a quick and hands-off
                                    approach to launching campaigns.
                                </p>
                                <Button
                                    onClick={handleAutopilotMode}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    size="lg"
                                >
                                    Launch Autopilot
                                    <Rocket className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Learn More Section */}
                    <div className="mt-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                            Learn More
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {learnMoreItems.map((item, index) => (
                                <Card
                                    key={index}
                                    className="cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white dark:bg-gray-800"
                                >
                                    <CardContent className="p-6">
                                        <div className={`inline-flex p-3 rounded-lg ${item.bgColor} mb-4`}>
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Campaigns;
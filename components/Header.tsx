import React from 'react';
import { Briefcase } from 'lucide-react';

interface HeaderProps {
    jobCount: number;
}

export default function Header({ jobCount }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">JobFinder</h1>
                            <p className="text-sm text-gray-600">Find your dream career</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Opportunities</p>
                        <p className="text-2xl font-bold text-blue-600">{jobCount}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

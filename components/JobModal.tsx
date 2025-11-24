import React from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Job } from '../types';

interface JobModalProps {
    job: Job;
    onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
                        <p className="text-xl text-blue-600 font-medium">{job.employer}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{job.employment}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{job.salary}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    {job.requirements && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                        </div>
                    )}

                    {job.benefits && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h3>
                            <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
                        </div>
                    )}

                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}

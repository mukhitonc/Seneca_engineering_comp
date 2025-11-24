import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
    job: Job;
    onClick: (job: Job) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
    return (
        <div
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-300"
            onClick={() => onClick(job)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.employer}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {job.employment}
                </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{job.salary}</span>
                </div>
            </div>

            <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(job);
                }}
            >
                View Details
            </button>
        </div>
    );
}

"use client"

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';

interface Job {
  id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  employment: string;
  ai_used: string;
  requirements: string;
  benefits: string;
  employer: string;
}

export default function JobPostingPlatform() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 5;

  const loadJobsFromCSV = async () => {
    try {
      setLoading(true);
      const response = await fetch('/job_postings_dataset.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const parsedJobs: Job[] = results.data.map((row: any, index: number) => ({
            id: index + 1,
            title: row.title || '',
            description: row.description || '',
            salary: row.salary || 'Not specified',
            location: row.location || '',
            employment: row.employment_type || '',
            ai_used: row.ai_used || 'Unknown',
            requirements: row.requirements || '',
            benefits: row.benefits || '',
            employer: row.employer || ''
          }));

          setJobs(parsedJobs);
          setFilteredJobs(parsedJobs);
          setLoading(false);
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading CSV file:', error);
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (employmentFilter) {
      filtered = filtered.filter(job =>
        job.employment.toLowerCase() === employmentFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  useEffect(() => {
    loadJobsFromCSV();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, employmentFilter, jobs]);

  const uniqueLocations = [...new Set(jobs.map(job => job.location))].filter(Boolean);
  const employmentTypes = [...new Set(jobs.map(job => job.employment))].filter(Boolean);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
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
              <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)}</span> of <span className="font-semibold text-gray-900">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
          </p>
          {totalPages > 1 && (
            <p className="text-gray-600">
              Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
          )}
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-6 mb-8">
          {currentJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-300"
              onClick={() => setSelectedJob(job)}
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
                  setSelectedJob(job);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => paginate(page as number)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                <p className="text-xl text-blue-600 font-medium">{selectedJob.employer}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                <span>{selectedJob.employment}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                <span>{selectedJob.salary}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedJob.requirements}</p>
                </div>
              )}

              {selectedJob.benefits && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedJob.benefits}</p>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
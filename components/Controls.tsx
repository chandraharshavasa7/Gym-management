
import React, { useRef } from 'react';
import { FilterOption, Member } from '../types';
import { exportToCSV } from '../utils/csvExporter';
import { SearchIcon, DownloadIcon, SaveIcon, UploadIcon } from './Icons';

interface ControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  members: Member[];
  onImport: (members: Member[]) => void;
}

const Controls: React.FC<ControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  members,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportAll = () => {
    if (members.length === 0) {
      alert('No members to export.');
      return;
    }
    const jsonContent = JSON.stringify(members, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gym_members_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const data = JSON.parse(text);
          onImport(data);
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Failed to import file. Make sure it's a valid JSON backup file.");
      }
    };
    reader.readAsText(file);
    
    // Reset file input to allow importing the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-8 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          >
            <option value={FilterOption.ALL}>All Members</option>
            <option value={FilterOption.UNPAID_THIS_MONTH}>Unpaid This Month</option>
            <option value={FilterOption.RECENTLY_UPDATED}>Updated in Last 95 Days</option>
          </select>
        </div>
      </div>
       <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
         />
         <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
            <UploadIcon />
            <span>Import</span>
        </button>
        <button
          onClick={handleExportAll}
          className="flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <SaveIcon />
          <span>Export All</span>
        </button>
        <button
          onClick={() => exportToCSV(members)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 bg-brand-accent hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <DownloadIcon />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;

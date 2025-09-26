
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Member, PaymentStatus, FilterOption } from './types';
import Dashboard from './components/Dashboard';
import MemberGrid from './components/MemberGrid';
import MemberFormModal from './components/MemberFormModal';
import Controls from './components/Controls';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('gymMembers', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const handleSaveMember = (member: Member, originalId?: string) => {
    if (editingMember && originalId) {
      setMembers(members.map(m => (m.id === originalId ? member : m)));
    } else {
      setMembers([...members, member]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };
  
  const handleImport = (importedMembers: Member[]) => {
    if (window.confirm('Are you sure you want to import this data? This will overwrite all current member data.')) {
        // Basic validation
        if (Array.isArray(importedMembers) && importedMembers.every(m => m.id && m.fullName)) {
            setMembers(importedMembers);
            alert('Data imported successfully!');
        } else {
            alert('Import failed. The file format is invalid.');
        }
    }
  };

  const filteredMembers = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return members
      .filter(member => {
        const nameMatch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = member.id.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = member.phoneNumber.includes(searchTerm);
        return nameMatch || idMatch || phoneMatch;
      })
      .filter(member => {
        if (filter === FilterOption.UNPAID_THIS_MONTH) {
          if (member.paymentStatus === PaymentStatus.UNPAID) return true;
          if (member.lastPaymentDate) {
            return new Date(member.lastPaymentDate) < firstDayOfMonth;
          }
          return true; // No payment date means unpaid
        }
        if (filter === FilterOption.RECENTLY_UPDATED) {
            const ninetyFiveDaysAgo = new Date();
            ninetyFiveDaysAgo.setDate(now.getDate() - 95);
            return member.lastPaymentDate && new Date(member.lastPaymentDate) > ninetyFiveDaysAgo;
        }
        return true;
      })
      .sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime());
  }, [members, searchTerm, filter]);

  return (
    <div className="bg-brand-light min-h-screen font-sans text-brand-dark">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
             <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">Gym Member Hub</h1>
             <button
                onClick={handleAddMember}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
                <PlusIcon />
                <span className="hidden sm:inline">Add Member</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard members={members} />
        <Controls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          members={members}
          onImport={handleImport}
        />
        <MemberGrid
          members={filteredMembers}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
         {filteredMembers.length === 0 && (
            <div className="text-center py-16">
                <p className="text-gray-500 text-xl">No members found.</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters, or add a new member!</p>
            </div>
         )}
      </main>

      {isModalOpen && (
        <MemberFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMember}
          member={editingMember}
          existingIds={members.map(m => m.id)}
        />
      )}
    </div>
  );
};

export default App;

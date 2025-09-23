
import React from 'react';
import { Member } from '../types';
import MemberCard from './MemberCard';

interface MemberGridProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

const MemberGrid: React.FC<MemberGridProps> = ({ members, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map(member => (
        <MemberCard
          key={member.id}
          member={member}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MemberGrid;

import React from 'react';
import { Member, PaymentStatus } from '../types';
import { EditIcon, TrashIcon, CalendarIcon, ReceiptIcon, PhoneIcon, WhatsAppIcon, MessageIcon } from './Icons';

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete }) => {
  const isPaid = member.paymentStatus === PaymentStatus.PAID;
  const statusBgColor = isPaid ? 'bg-green-100' : 'bg-red-100';
  const statusTextColor = isPaid ? 'text-green-800' : 'text-red-800';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <div className="relative">
        <img
          src={member.photo || `https://i.pravatar.cc/300?u=${member.id}`}
          alt={member.fullName}
          className="w-full aspect-square object-cover object-top"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${statusBgColor} ${statusTextColor}`}>
          {member.paymentStatus}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-brand-primary truncate">{member.fullName}</h3>
        <p className="text-sm text-gray-500">ID: {member.id}</p>
        
        <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span>Joined: {formatDate(member.joiningDate)}</span>
            </div>
            <div className="flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5 text-gray-400" />
                <span>Last Paid: {formatDate(member.lastPaymentDate)}</span>
            </div>
            <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>{member.phoneNumber || 'N/A'}</span>
            </div>
        </div>

      </div>
       <div className="px-4 pb-4 flex justify-between items-center">
        <button
          onClick={() => onDelete(member.id)}
          className="p-2 text-gray-500 hover:text-brand-danger hover:bg-red-100 rounded-full transition-colors"
          aria-label="Delete Member"
        >
          <TrashIcon />
        </button>
        
        <div className="flex items-center gap-1">
          {member.phoneNumber && (
            <a
              href={`tel:${member.phoneNumber}`}
              className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-full transition-colors"
              aria-label="Call Member"
            >
              <PhoneIcon />
            </a>
          )}
          {(member.whatsAppNumber || member.phoneNumber) && (
            <a
              href={`https://wa.me/${(member.whatsAppNumber || member.phoneNumber).replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 rounded-full transition-colors"
              aria-label="Send WhatsApp Message"
            >
              <WhatsAppIcon />
            </a>
          )}
          {member.phoneNumber && (
            <a
              href={`sms:${member.phoneNumber}`}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
              aria-label="Send SMS Message"
            >
              <MessageIcon />
            </a>
          )}
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-gray-500 hover:text-brand-secondary hover:bg-blue-100 rounded-full transition-colors"
            aria-label="Edit Member"
          >
            <EditIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;

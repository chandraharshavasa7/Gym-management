import React, { useState, useEffect } from 'react';
import { Member, PaymentStatus } from '../types';
import { XIcon, TrashIcon } from './Icons';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member, originalId?: string) => void;
  member: Member | null;
  existingIds: string[];
}

const initialFormData: Member = {
  id: '', photo: '', fullName: '', address: '', phoneNumber: '', fatherName: '',
  fatherPhoneNumber: '', height: '', weight: '', whatsAppNumber: '', 
  paymentStatus: PaymentStatus.UNPAID, lastPaymentDate: '', joiningDate: '',
  lastUpdatedDate: '', paymentHistory: [], age: '', bloodGroup: '',
};

const MemberFormModal: React.FC<MemberFormModalProps> = ({ isOpen, onClose, onSave, member, existingIds }) => {
  const [formData, setFormData] = useState<Member>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({ date: '', amount: '' });

  const isEditing = !!member;

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        paymentHistory: member.paymentHistory || [], // Ensure paymentHistory is an array
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [member, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddPayment = () => {
    if (!newPayment.date || !newPayment.amount || parseFloat(newPayment.amount) <= 0) {
        setError('Please enter a valid date and a positive amount for the payment.');
        return;
    }
    setError(null);

    const paymentToAdd = {
        date: new Date(newPayment.date).toISOString(),
        amount: parseFloat(newPayment.amount)
    };

    const updatedHistory = [...formData.paymentHistory, paymentToAdd]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFormData(prev => ({
        ...prev,
        paymentHistory: updatedHistory,
        lastPaymentDate: updatedHistory[0].date,
        paymentStatus: PaymentStatus.PAID,
    }));

    setNewPayment({ date: '', amount: '' });
  };

  const handleDeletePayment = (indexToDelete: number) => {
    const updatedHistory = formData.paymentHistory.filter((_, index) => index !== indexToDelete);
    
    const newLastPaymentDate = updatedHistory.length > 0 ? updatedHistory[0].date : '';
    const newPaymentStatus = updatedHistory.length > 0 ? PaymentStatus.PAID : PaymentStatus.UNPAID;

    setFormData(prev => ({
        ...prev,
        paymentHistory: updatedHistory,
        lastPaymentDate: newLastPaymentDate,
        paymentStatus: newPaymentStatus,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.fullName) {
        setError('Member ID and Full Name are required.');
        return;
    }

    if (isEditing) {
        const otherMemberIds = existingIds.filter(id => id !== member!.id);
        if (otherMemberIds.includes(formData.id)) {
            setError('This Member ID is already in use by another member.');
            return;
        }
    } else {
        if (existingIds.includes(formData.id)) {
            setError('This Member ID already exists. Please use a unique ID.');
            return;
        }
    }
    
    const memberToSave = {
        ...formData,
        lastUpdatedDate: new Date().toISOString(),
        joiningDate: formData.joiningDate || new Date().toISOString(),
    };
    
    onSave(memberToSave, isEditing ? member!.id : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-brand-primary">{isEditing ? 'Edit Member' : 'Add New Member'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <div className="mt-1 flex items-center gap-4">
                    <img src={formData.photo || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-16 h-16 rounded-full object-cover"/>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                </div>
            </div>

            <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Member ID*</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name*</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input type="tel" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="fatherPhoneNumber" className="block text-sm font-medium text-gray-700">Father's Phone</label>
                <input type="tel" name="fatherPhoneNumber" value={formData.fatherPhoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input type="text" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">Joining Date</label>
                <input type="date" name="joiningDate" value={formData.joiningDate.split('T')[0]} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value={PaymentStatus.PAID}>Paid</option>
                    <option value={PaymentStatus.UNPAID}>Unpaid</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="lastPaymentDate" className="block text-sm font-medium text-gray-700">Last Payment Date</label>
                <input type="date" name="lastPaymentDate" value={formData.lastPaymentDate.split('T')[0]} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>

            {isEditing && (
                <div className="md:col-span-2 p-4 border-t mt-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment History</h3>
                    <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                        <div className="flex-grow w-full">
                            <label htmlFor="newPaymentDate" className="block text-sm font-medium text-gray-700">Payment Date</label>
                            <input type="date" id="newPaymentDate" value={newPayment.date} onChange={(e) => setNewPayment(p => ({...p, date: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="flex-grow w-full">
                            <label htmlFor="newPaymentAmount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input type="number" id="newPaymentAmount" placeholder="0.00" value={newPayment.amount} onChange={(e) => setNewPayment(p => ({...p, amount: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <button type="button" onClick={handleAddPayment} className="bg-brand-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto flex-shrink-0">
                            Add Payment
                        </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-md">
                        {(formData.paymentHistory && formData.paymentHistory.length > 0) ? (
                            formData.paymentHistory.map((payment, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                    <div>
                                        <p className="font-medium">{new Date(payment.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                        <p className="text-sm text-gray-600">Amount: ₹{payment.amount.toFixed(2)}</p>
                                    </div>
                                    <button type="button" onClick={() => handleDeletePayment(index)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full" aria-label="Delete Payment">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No payment history found.</p>
                        )}
                    </div>
                </div>
            )}
            
            {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
        </div>
          <div className="flex justify-end items-center p-4 border-t bg-gray-50">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2">Cancel</button>
            <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">{isEditing ? 'Save Changes' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;

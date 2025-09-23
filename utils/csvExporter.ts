import { Member } from '../types';

export const exportToCSV = (members: Member[]) => {
  const ninetyFiveDaysAgo = new Date();
  ninetyFiveDaysAgo.setDate(ninetyFiveDaysAgo.getDate() - 95);

  const filteredMembers = members.filter(
    (member) => new Date(member.lastUpdatedDate) > ninetyFiveDaysAgo
  );

  if (filteredMembers.length === 0) {
    alert('No members have been updated in the last 95 days to export.');
    return;
  }

  const csvContent = [
    ['ID', 'Name', 'Phone Number'],
    ...filteredMembers.map(member => [
      member.id,
      member.fullName,
      member.phoneNumber
    ])
  ]
    .map(e => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `gym_members_last_95_days_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
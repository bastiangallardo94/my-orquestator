import React from 'react';
import './StatusBadge.scss';

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === '-') { return status }
  const norm = String(status || '').toLowerCase();
  const cls =
    norm.includes('sche') || norm.includes('pend')
      ? 'status-badge status-pending'
      : norm.includes('aprob') || norm.includes('appr') || norm.includes('released')
        ? 'status-badge status-approved'
        : norm.includes('rech') || norm.includes('reject') || norm.includes('canceled')
          ? 'status-badge status-rejected'
          : 'status-badge';

  return <span className={cls}>{status || 'N/A'}</span>;
};
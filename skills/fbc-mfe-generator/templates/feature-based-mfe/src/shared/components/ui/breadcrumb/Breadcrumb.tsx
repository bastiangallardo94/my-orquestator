import React from 'react';
import { BreadcrumbProps } from './Breadcrumb.types';
import './Breadcrumb.scss';

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className='breadcrumb'>
      {items.map((item, index) => (
        <span key={index}>
          {item.url ? (
            <a href={item.url}>
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <span className='icon'> {'>'} </span>}
        </span>
      ))}
    </div>
  );
};


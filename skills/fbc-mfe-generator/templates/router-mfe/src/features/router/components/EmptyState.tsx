import React from 'react';
import emptyNotFoundSvg from '@shared/assets/images/empty_not_found.svg';

interface EmptyStateProps {
    message: string;
    altText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, altText = 'Empty state' }) => {
    return (
        <div className="maint-text-center maint-py-12">
            <img 
                src={emptyNotFoundSvg} 
                alt={altText} 
                className="maint-mx-auto maint-mb-4" 
                style={{ width: '396px' }} 
            />
            <p className="maint-text-gray-600 maint-text-lg">
                {message}
            </p>
        </div>
    );
};

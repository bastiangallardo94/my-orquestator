import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="maint-bg-white">
            <main className="maint-container maint-mx-auto maint-px-4 maint-pb-8 maint-bg-white">
                {children}
            </main>
        </div>
    );
};
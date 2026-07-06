import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="{{CSS_PREFIX}}bg-white">
            <main className="{{CSS_PREFIX}}container {{CSS_PREFIX}}mx-auto {{CSS_PREFIX}}px-4 {{CSS_PREFIX}}pb-8 {{CSS_PREFIX}}bg-white">
                {children}
            </main>
        </div>
    );
};
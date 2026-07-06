import React, { useState } from 'react';
import { navigateToUrl } from 'single-spa';
import Icon from "../../../shared/assets/images/Card-Prov.svg";

interface HomeCardProps {
    title: string;
    path: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
}

export const HomeCard = ({
    title,
    description,
    path,
    imageSrc,
    imageAlt = title,
}: HomeCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleNavigate = (path: string) => (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        try {
            navigateToUrl(path);
        } catch {
            if (typeof window !== 'undefined') window.location.assign(path);
        }
    };

    return (
        <div
            className="mf-bg-white mf-p-6 mf-border mf-rounded-lg mf-shadow-md mf-home-card mf-flex mf-flex-row  mf-border-solid mf-border-gray-300"
            role="button"
            tabIndex={0}
            data-testid="template-card"
            onClick={handleNavigate(path)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(path)(e as unknown as React.MouseEvent<HTMLElement>);
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={imageSrc ?? Icon}
                alt={imageAlt}
                className="mf-block mf-w-[54px] mf-h-[54px]"
                style={{ objectFit: 'cover' }}
            />
            <div className="mf-flex mf-flex-col mf-items-left mf-justify-left mf-ml-4">
                <h2 className="mf-text-[20px] mf-font-bold mf-leading-[27px] mf-mb-2 text-left" style={{ color: '#333333' }}>
                    {title}
                </h2>
                <p className='mf-text-[16]'>{description}</p>
            </div>
        </div>
    );

}

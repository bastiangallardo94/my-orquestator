import { capitalizeWords } from '@shared/utils/capitalizeWords';
import React from 'react';

interface HeaderProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
}

export const InspectionDetailItem = ({
    title,
    description,
    imageSrc,
    imageAlt = 'Card image',
}: HeaderProps) => {

    return (
        <div className="mf-flex mf-flex-row mf-items-center mf-pb-4">
            <img
                src={imageSrc}
                alt={imageAlt}
                className="mf-block mf-w-[20px] mf-h-[20px]"
                style={{ objectFit: 'cover' }}
            />
            <div className="mf-flex mf-flex-col mf-items-left mf-justify-left mf-ml-4">
                <p>{title}</p>
                <p className='mf-font-bold'>{capitalizeWords(description)}</p>
            </div>
        </div>
    )
}

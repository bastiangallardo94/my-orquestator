import React from 'react';
import Icon from '../../assets/images/inspection.svg';

interface HeaderProps {
	title: string;
	description?: string;
	imageSrc?: string;
	imageAlt?: string;
}

export const Header = ({
						   title,
						   description,
						   imageSrc,
						   imageAlt = 'Card image',
					   }: HeaderProps) => {

	return (
		<div>
			<div className="mf-flex mf-flex-row mf-items-center mf-p-2 mf-pb-6">
				<img
					src={imageSrc ?? Icon}
					alt={imageAlt}
					className="mf-block mf-w-[62px] mf-h-[62px]"
					style={{ objectFit: 'cover' }}
				/>
				<div className="mf-flex mf-flex-col mf-items-left mf-justify-left mf-ml-4">
					<h2 className="mf-text-[24px] mf-font-bold mf-leading-[27px] mf-mb-4 text-left" style={{ color: '#333333' }}>
						{title}
					</h2>
					{description && <p className='mf-text-[16]'>{description}</p>}
				</div>
			</div>
			<hr/>
		</div>
	);

}

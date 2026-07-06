/**
 * Card Component
 * 
 * Componente reutilizable de tarjeta que funciona como link al menú lateral.
 * 
 * Comportamiento del clic:
 * - Si el menú lateral está CERRADO: abre el drawer y navega a la ruta
 * - Si el menú lateral está ABIERTO: solo navega a la ruta (no abre drawer)
 * 
 * Esto evita redundancia al abrir el drawer cuando ya está visible.
 */

import { useGlobalDrawerState } from '@shared/hooks/useGlobalDrawerState';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { navigateToUrl } from 'single-spa';
import singleSpaReact from 'single-spa-react';
import Icon from '../../assets/images/Card-Prov.svg';

interface CardProps {
    title?: string;
    appPath?: string;
    imageSrc?: string;
    imageAlt?: string;
    onClick?: () => void;
    className?: string;
}

export const Card = ({
    title,
    appPath = `${process.env.APP_PATH ?? '/inspection'}`,
    imageSrc,
    imageAlt = 'Card image',
    onClick,
    className = ''
}: CardProps) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    /**
     * Hook para verificar el estado del drawer lateral
     * - isOpen=true: El menú ya está visible, no necesita abrirse
     * - isOpen=false: El menú está oculto, debe abrirse al hacer clic
     */
    const { isOpen: isDrawerOpen } = useGlobalDrawerState({
        namespace: 'template',
        storageKey: 'mf-template-drawer-open',
        defaultOpen: false
    });

    const cardTitle = title ?? t('card.template', 'Imports Inspection');

    /**
     * Manejador de navegación con lógica condicional del drawer
     * 
     * Flujo:
     * 1. Si hay onClick custom, ejecutarlo y salir
     * 2. Si el drawer está CERRADO: abrir drawer + navegar
     * 3. Si el drawer está ABIERTO: solo navegar (sin abrir drawer)
     */
    const handleNavigate = (path: string) => (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        if (onClick) {
            onClick();
            return;
        }

        // Solo abrir el drawer si está cerrado y la ruta corresponde a este microfrontend
        const shouldOpenDrawer = !isDrawerOpen && path?.startsWith(process.env.APP_PATH ?? '/inspection');

        if (shouldOpenDrawer) {
            try {
                // Dispatch evento custom para solicitar apertura del drawer
                const drawerEvent = new CustomEvent('request-drawer-open', {
                    bubbles: true,
                    detail: { requestOpen: true }
                });
                window.dispatchEvent(drawerEvent);
            } catch { /* ignore */ }

            try {
                // Click programático en el botón del drawer
                const menuButton = document.querySelector('[data-testid="drawer-header-button"]');
                if (menuButton && 'click' in menuButton) {
                    (menuButton as HTMLElement).click();

                    // Dispatch evento después de abrir el drawer
                    window.setTimeout(() => {
                        try {
                            const sidebarOpenedEvent = new CustomEvent('sidebar-opened', {
                                bubbles: true,
                                detail: { triggeredBy: 'template-card' }
                            });
                            window.dispatchEvent(sidebarOpenedEvent);
                        } catch { /* ignore */ }
                    }, 100);
                }
            } catch { /* ignore */ }
        }

        // Navegar a la ruta (siempre se ejecuta)
        try {
            navigateToUrl(path);
        } catch {
            if (typeof window !== 'undefined') window.location.assign(path);
        }
    };

    return (
        <div className="mf-template-scope">
            <div
                className={`mf-bg-white mf-cursor-pointer mf-w-[255px] mf-h-[246px] mf-box-border mf-transition-colors mf-duration-150 ${className}`}
                style={{
                    border: '1px solid #DFDFDF',
                    backgroundColor: isHovered ? '#f5f5f5' : '#FFFFFF'
                }}
                role="button"
                tabIndex={0}
                data-testid="template-card"
                onClick={handleNavigate(appPath)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigate(appPath)(e as unknown as React.MouseEvent<HTMLElement>);
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="mf-h-full mf-flex mf-flex-col mf-items-center mf-justify-center mf-p-6">
                    <img
                        src={imageSrc ?? Icon}
                        alt={imageAlt}
                        className="mf-block mf-w-[110px] mf-h-[110px]"
                        style={{ objectFit: 'cover' }}
                    />
                    <h2 className="mf-text-[18px] mf-font-normal mf-leading-[27px] mf-mt-4 mf-text-center" style={{ color: '#333333' }}>
                        {cardTitle}
                    </h2>
                </div>
            </div>
        </div>
    );
};

const lifecycles = singleSpaReact({
    React,
    ReactDOMClient: { createRoot },
    rootComponent: Card,
    errorBoundary(err, errInfo, props) {
        console.error('Error occurred in Card component:', err);
        console.error('Error info:', errInfo);
        console.error('Props at the time of error:', props);
        return <div className="mf-p-4 mf-text-red-600">Error loading card</div>;
    },
});

export const { bootstrap, mount, unmount } = lifecycles;

export default Card;

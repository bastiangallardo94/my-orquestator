import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import './SideDrawer.scss';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  className?: string;
  overlayClassName?: string;
  showOverlay?: boolean;
  animationDuration?: number;
}

export const SideDrawer = ({
    isOpen,
    children,
    onClose,
    title,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    preventScroll = true,
    className = '',
    overlayClassName = '',
    showOverlay = true,
    animationDuration = 300,
}: SideDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Handle ESC key
    useEffect(() => {
        if (!closeOnEsc || !isOpen) return;

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
            onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [closeOnEsc, isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (preventScroll && isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
            document.body.style.overflow = '';
            };
        }
    }, [preventScroll, isOpen]);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Don't render anything if not open
    if (!isOpen) return null;

    return (
        createPortal(
            <div
                className={`drawer-container ${showOverlay ? 'with-overlay' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                >
                {showOverlay && (
                    <div
                        className={`drawer-overlay ${overlayClassName}`}
                        onClick={handleOverlayClick}
                        data-testid="drawer-overlay"
                        style={{ animationDuration: `${animationDuration}ms` }}
                    />
                )}
                
                <div
                    ref={drawerRef}
                    className={`
                    drawer
                    drawer-right
                    drawer-lg
                    ${className}
                    `}
                    tabIndex={-1}
                    style={{ animationDuration: `${animationDuration}ms` }}
                >
                    <div className="drawer-content">
                        {title && <h2 className="mf-mb-6">{title}</h2>}
                        <div className="drawer-body">
                            {children}
                        </div>
                    </div>
                </div>
                </div>,
        document.body)  as unknown as React.ReactElement
    )
}


import '../../../styles/globals.css';
import React, { useCallback, useMemo, useEffect } from 'react';
import { useGlobalDrawerState } from '../../hooks/useGlobalDrawerState';
import singleSpaReact from 'single-spa-react';
import { Provider } from 'react-redux';
import store from '../../../infrastructure/store/store';
import { navigateToUrl } from 'single-spa';
import { PriceChange, ExpandLess, ExpandMore } from '@mui/icons-material';
import { getMenuDataByRoles } from '../../menu/menuData';
import { ENV } from '../../../constants/environment.config';
import { usePersistentExpandedSet } from '../../hooks/usePersistentExpandedSet';
import { useCurrentPath } from '../../hooks/useCurrentPath';
import { useAppRoles } from '../../hooks/useAppRoles';
import { MenuItemData } from '../../menu/model/types';
import { buildPathAncestors, isAncestorActive } from '../../menu/utils';
import { useTranslation } from 'react-i18next';

interface MenuItemProps {
    item: MenuItemData;
    level: number;
    currentPath: string;
    onNavigate: (path: string) => void;
    expandedItems: Set<string>;
    onToggleExpanded: (id: string) => void;
    pathAncestors: Record<string, string[]>;
}

const MenuItem = ({
    item,
    level = 0,
    currentPath,
    onNavigate,
    expandedItems,
    onToggleExpanded,
    pathAncestors
}: MenuItemProps) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentPath === item.path;
    const ancestorActive = !isActive && isAncestorActive(item, currentPath, pathAncestors);

    const handleClick = useCallback(() => {
        if (hasChildren) {
            onToggleExpanded(item.id);
        } else if (item.path) {
            onNavigate(item.path);
        }
    }, [hasChildren, onToggleExpanded, item.id, item.path, onNavigate]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    }, [handleClick]);

    const handleLinkClick = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        if (item.path) onNavigate(item.path);
    }, [item.path, onNavigate]);

    if (!hasChildren) {
        return (
            <li role="none" className="mf-text-neutral-7">
                <a
                    className={`mf-block mf-px-4 mf-py-2 mf-text-sm mf-whitespace-pre-line mf-m-0 mf-border-0 mf-outline-none mf-transition-colors mf-duration-150 mf-cursor-pointer mf-text-neutral-7 hover:mf-bg-neutral-2 focus:mf-bg-neutral-2 mf-no-underline ${isActive ? 'mf-bg-neutral-2 mf-font-medium' : 'mf-font-normal'} ${level >= 2 ? 'mf-pl-24' : level === 1 ? 'mf-pl-20' : 'mf-pl-4'}`}
                    href={item.path}
                    onClick={handleLinkClick}
                    onKeyDown={handleKeyDown}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    tabIndex={0}
                    style={{ textDecoration: 'none' }}
                >
                    <span className="mf-whitespace-pre-line mf-m-0 mf-p-0 mf-no-underline mf-text-neutral-7">{item.label}</span>
                </a>
            </li>
        );
    }

    return (
        <li role="none" className="mf-m-0 mf-p-0">
            <button
                type="button"
                className={`mf-w-full mf-flex mf-items-center mf-justify-between mf-text-left mf-cursor-pointer mf-outline-none mf-m-0 mf-border-0 mf-bg-transparent mf-no-underline mf-text-neutral-7 mf-text-[15px] mf-transition-colors mf-duration-150 mf-min-h-[48px] ${level === 1 ? 'mf-pl-20' : level >= 2 ? 'mf-pl-24' : 'mf-pl-5'} hover:mf-bg-neutral-2 focus:mf-bg-neutral-2 ${ancestorActive ? 'mf-font-medium' : 'mf-font-normal'}`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-expanded={isExpanded}
                aria-haspopup="true"
            >
                <div className="mf-flex mf-items-center mf-flex-1 mf-gap-0 mf-justify-start">
                    {item.icon && (
                        <span className="mf-flex mf-items-center mf-justify-center mf-w-[30px] mf-h-12 mf-flex-shrink-0 mf-mr-6 mf-leading-none">
                            <PriceChange sx={{ fontSize: 30, color: '#333333' }} />
                        </span>
                    )}
                    <span className="mf-flex mf-items-center mf-whitespace-pre-line mf-m-0 mf-p-0 mf-text-inherit mf-leading-[1.4] mf-text-base">{item.label}</span>
                </div>
                <span className="mf-flex mf-items-center mf-justify-center mf-mr-4 mf-p-0 mf-text-neutral-7">
                    {isExpanded ? (
                        <ExpandLess sx={{ fontSize: 28, color: '#333333' }} />
                    ) : (
                        <ExpandMore sx={{ fontSize: 28, color: '#333333' }} />
                    )}
                </span>
            </button>
            {isExpanded && item.children && (
                <ul className="mf-bg-neutral-1 mf-m-0 mf-p-0 mf-list-none mf-text-neutral-7" role="menu">
                    {item.children.map(child => (
                        <MenuItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            currentPath={currentPath}
                            onNavigate={onNavigate}
                            expandedItems={expandedItems}
                            onToggleExpanded={onToggleExpanded}
                            pathAncestors={pathAncestors}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

// Clave para localStorage
const EXPANDED_ITEMS_KEY = 'mf-template-expanded-menu-items';

const MenuItemContent = () => {
    const { isOpen: isSidebarOpen } = useGlobalDrawerState({
        namespace: 'template',
        storageKey: 'mf-template-drawer-open',
        defaultOpen: false
    });
    const { i18n } = useTranslation();
    const { roles } = useAppRoles();

    const { currentPath, setCurrentPath } = useCurrentPath();
    const { expanded, toggle, ensureVisible } = usePersistentExpandedSet(EXPANDED_ITEMS_KEY, ['template']);

    // Memoizar roles para evitar recreación en cada render
    const rolesString = useMemo(() => JSON.stringify(roles), [roles]);

    // Build menu filtered by user roles - rebuild when language or roles change
    const menuData = useMemo(() => getMenuDataByRoles(roles), [i18n.language, rolesString]);
    const pathAncestors = useMemo(() => buildPathAncestors(menuData), [menuData]);

    // Auto-expand ancestors when direct navigation into deep path
    useEffect(() => {
        const ancestors = pathAncestors[currentPath];
        if (ancestors && ancestors.length) ensureVisible(ancestors);
    }, [currentPath, pathAncestors, ensureVisible]);

    const handleNavigate = useCallback((path: string) => {
        if (!path) return;
        if (window.location.pathname === path) {
            setCurrentPath(path);
            return;
        }
        try {
            navigateToUrl(path);
            setCurrentPath(path);
        } catch (error) {
            console.error('[TemplateMenu][navigate][fallback]', { path, error });
            if (typeof window !== 'undefined') window.location.assign(path);
        }
    }, [setCurrentPath]);

    const handleToggleExpanded = useCallback((id: string) => {
        toggle(id);
    }, [toggle]);

    const handleButtonClick = useCallback(() => {
        // Si SIDEBAR_ENABLED es false, navegar a la ruta raíz
        if (!ENV.SIDEBAR_ENABLED) {
            const rootPath = `${ENV.APP_PATH}`;
            try {
                navigateToUrl(rootPath);
                setCurrentPath(rootPath);
            } catch (error) {
                console.error('[TemplateMenu][navigate][fallback]', { path: rootPath, error });
                if (typeof window !== 'undefined') window.location.assign(rootPath);
            }
            return;
        }

        // Si SIDEBAR_ENABLED es true, comportamiento normal: abrir drawer
        try {
            const drawerEvent = new CustomEvent('request-drawer-open', {
                bubbles: true,
                detail: { requestOpen: true }
            });
            window.dispatchEvent(drawerEvent);
        } catch { /* ignore */ }

        try {
            const menuButton = document.querySelector('[data-testid="drawer-header-button"]');
            if (menuButton && 'click' in menuButton) {
                (menuButton as HTMLElement).click();
            }
        } catch { /* ignore */ }

        const target = `${ENV.APP_PATH}/home`;
        if (!window.location.pathname.startsWith(`${ENV.APP_PATH}/`)) {
            try {
                navigateToUrl(target);
            } catch {
                console.error('Single-SPA navigation failed');
            }
        }
    }, [setCurrentPath]);

    const renderIcon = useCallback(() => (
        <PriceChange sx={{ fontSize: 30, color: '#333333' }} />
    ), []);

    if (!isSidebarOpen) {
        return (
            <div className="mf-template-scope" style={{ height: '48px' }}>
                <div
                    className="mf-flex mf-justify-center mf-items-center mf-w-[68px] mf-h-[48px] mf-bg-transparent mf-cursor-pointer mf-transition-colors mf-duration-150 mf-border-0 mf-rounded-none mf-relative hover:mf-bg-neutral-2"
                    onClick={handleButtonClick}
                    role="button"
                    aria-label="Abrir menú de Template"
                    title="Template"
                >
                    {renderIcon()}
                </div>
            </div>
        );
    }

    if (!ENV.SIDEBAR_ENABLED) {
        return (
            <div className="mf-template-scope" style={{ height: '48px' }}>
                <div
                    className="mf-flex mf-items-center mf-h-[48px] mf-bg-transparent mf-cursor-pointer mf-border-0 mf-rounded-none mf-relative hover:mf-bg-neutral-2"
                    onClick={handleButtonClick}
                    role="button"
                    aria-label="Abrir menú de Template"
                    title="Template"
                    style={{ minWidth: '319px' }}
                >
                    <div className="mf-flex mf-justify-center mf-items-center mf-w-[68px] mf-h-[48px] mf-flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <span className="mf-text-sm mf-font-medium mf-text-neutral-7 mf-whitespace-nowrap">
                        {ENV.COMPACT_MENU_LABEL}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="mf-template-scope" role="navigation" aria-label="Menú de navegación de Template">
            <div className="mf-w-full mf-bg-white mf-select-none mf-m-0 mf-p-0 mf-box-border">
                <ul className="mf-m-0 mf-p-0 mf-list-none" role="menu">
                    {menuData.map(item => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            level={0}
                            currentPath={currentPath}
                            onNavigate={handleNavigate}
                            expandedItems={expanded}
                            onToggleExpanded={handleToggleExpanded}
                            pathAncestors={pathAncestors}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Configuración del ciclo de vida para single-spa con React 18
const lifecycles = singleSpaReact({
    React,
    ReactDOMClient: require('react-dom/client'),
    rootComponent: (props) => (
        <Provider store={store}>
            <MenuItemContent />
        </Provider>
    ),
    errorBoundary(err, errInfo) {
        console.error("Error en Template MenuItem:", {
            error: err,
            info: errInfo,
            pathname: window.location.pathname,
        });
        return <div>Error loading Template menu</div>;
    },
});

export const { bootstrap, mount, unmount } = lifecycles;

export default MenuItemContent;

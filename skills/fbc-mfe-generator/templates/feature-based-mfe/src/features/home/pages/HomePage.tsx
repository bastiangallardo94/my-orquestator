import { USER_ROLES } from '@core/constants/roles';
import { ROUTES } from '@core/constants/routes';
import { Breadcrumb, BreadcrumbItem } from '@import/shipment-library-react';
import { Header } from '@shared/components/ui/Header';
import { useAppRoles } from '@shared/hooks/useAppRoles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HomeIcon from "../../../shared/assets/images/home.svg";
import { HomeCard } from '../components/HomeCard';

export const HomePage = () => {
    const { t } = useTranslation();
    const { roles } = useAppRoles();

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            label: t('common.home') || 'Home',
            url: ROUTES.FBC_HOME
        },
        {
            label: "Foreign trade",
            url: ROUTES.FOREIGN_TRADE
        },
        {
            label: t('home.title') || 'Home',
        }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="{{SCOPE_CLASS}} {{CSS_PREFIX}}-p-6 {{CSS_PREFIX}}-box-border {{CSS_PREFIX}}-border-solid {{CSS_PREFIX}}-border-gray-300 {{CSS_PREFIX}}-bg-white {{CSS_PREFIX}}-border {{CSS_PREFIX}}-rounded-lg">
                <Header
                    imageSrc={HomeIcon}
                    title={t('home.title') || 'Welcome'}
                    description={t('home.description') || 'Welcome to your microfrontend application'} 
                />
                <div className="{{CSS_PREFIX}}-pt-6 {{CSS_PREFIX}}-grid {{CSS_PREFIX}}-grid-cols-3 {{CSS_PREFIX}}-gap-6">
                    {/* TODO: Add your HomeCard components here */}
                    {/* Example:
                    <HomeCard
                        title={t('home.example.title') || 'Example Feature'}
                        description={t('home.example.description') || 'Example feature description'}
                        path={ROUTES.EXAMPLE}
                        imageSrc={ExampleIcon}
                    />
                    */}
                    
                    {/* Example with role-based rendering:
                    {roles.some(role => role.toUpperCase() === USER_ROLES.ADMIN.toUpperCase()) &&
                        <HomeCard
                            title="Admin Only Feature"
                            description="This feature is only visible to admins"
                            path={ROUTES.ADMIN_FEATURE}
                            imageSrc={AdminIcon}
                        />
                    }
                    */}
                </div>
            </div>
        </div>
    );
};

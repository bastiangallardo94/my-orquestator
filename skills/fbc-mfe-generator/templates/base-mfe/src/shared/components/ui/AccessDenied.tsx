import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
    requiredRoles?: string[];
    message?: string;
}

export const AccessDenied = ({ requiredRoles, message }: AccessDeniedProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="mf-min-h-screen mf-bg-neutral-50 mf-flex mf-items-center mf-justify-center mf-p-4">
            <div className="mf-max-w-md mf-w-full">
                <div className="mf-bg-white mf-rounded-lg mf-shadow-lg mf-p-8 mf-text-center">
                    {/* Icon */}
                    <div className="mf-mb-6">
                        <div className="mf-mx-auto mf-w-16 mf-h-16 mf-bg-red-100 mf-rounded-full mf-flex mf-items-center mf-justify-center">
                            <svg
                                className="mf-w-8 mf-h-8 mf-text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mf-text-2xl mf-font-bold mf-text-secondary-900 mf-mb-2">
                        {t('common.accessDenied') || 'Acceso Denegado'}
                    </h1>

                    {/* Message */}
                    <p className="mf-text-neutral-600 mf-mb-6">
                        {message ?? t('common.accessDeniedMessage') ?? 'No tienes los permisos necesarios para acceder a esta página.'}
                    </p>

                    {/* Required Roles */}
                    {requiredRoles && requiredRoles.length > 0 && (
                        <div className="mf-mb-6 mf-bg-neutral-50 mf-p-4 mf-rounded-lg">
                            <p className="mf-text-sm mf-text-neutral-700 mf-mb-2">
                                {t('common.requiredRoles') || 'Roles requeridos:'}
                            </p>
                            <div className="mf-flex mf-flex-wrap mf-gap-2 mf-justify-center">
                                {requiredRoles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="mf-px-3 mf-py-1 mf-bg-primary-100 mf-text-primary-700 mf-rounded-full mf-text-xs mf-font-medium"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

        {/* Actions */}
        <div className="mf-flex mf-gap-3 mf-justify-center">
          <Button
            onClick={handleGoBack}
            color="primary"
            variant="outlined"
            size="medium"
          >
            {t('common.goBack') || 'Volver'}
          </Button>
          <Button
            onClick={handleGoHome}
            color="primary"
            variant="contained"
            size="medium"
          >
            {t('common.goHome') || 'Ir al Inicio'}
          </Button>
        </div>
                </div>

                {/* Additional Help */}
                <div className="mf-mt-6 mf-text-center">
                    <p className="mf-text-sm mf-text-neutral-500">
                        {t('common.accessDeniedHelp') || 'Si crees que esto es un error, contacta con el administrador del sistema.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * AppLayout Component
 * 
 * Layout principal que envuelve todas las páginas de la aplicación.
 * 
 * @description
 * Proporciona la estructura base común para todas las vistas:
 * - Fondo neutral claro (bg-neutral-50) para contraste con contenido
 * - Contenedor responsivo centrado con padding consistente
 * - Altura mínima de pantalla completa (min-h-screen)
 * - Sistema de espaciado estandarizado (px-4, py-8)
 * 
 * Este layout es intencionalente simple y puede extenderse con:
 * - Header/navbar global
 * - Footer compartido
 * - Sidebar o menú lateral
 * - Breadcrumbs de navegación
 * - Notificaciones/toasts globales
 * 
 * @example
 * // Uso básico en una ruta
 * <Route path="/home" element={
 *   <PrivateRoute>
 *     <AppLayout>
 *       <HomePage />
 *     </AppLayout>
 *   </PrivateRoute>
 * } />
 * 
 * @example
 * // Extendiendo con props adicionales
 * interface ExtendedLayoutProps extends AppLayoutProps {
 *   showHeader?: boolean;
 *   showFooter?: boolean;
 * }
 */

import React from 'react';

/**
 * Props del componente AppLayout
 */
interface AppLayoutProps {
    /** Contenido de la página a renderizar dentro del layout */
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        /**
         * Contenedor principal:
         * - mf-min-h-screen: Asegura que el layout ocupe al menos toda la altura de la pantalla
         * - mf-bg-neutral-50: Fondo gris muy claro (#FAFAFA) para contraste visual
         * - Todas las clases usan prefijo 'mf-' para evitar conflictos CSS con otros microfrontends
         */
        <div className="mf-min-h-screen mf-bg-white">
            {/**
             * Elemento <main>:
             * - Semánticamente correcto para el contenido principal de la página
             * - mf-container: Ancho máximo responsivo (max-width según breakpoints)
             * - mf-mx-auto: Centrado horizontal
             * - mf-px-4: Padding horizontal de 16px para espaciado en móvil
             * - mf-py-8: Padding vertical de 32px para separación superior/inferior
             * 
             * El contenedor se adapta a diferentes breakpoints:
             * - Mobile: 100% width con padding de 16px
             * - Tablet: max-width ~768px
             * - Desktop: max-width ~1200px
             */}
            <main className="mf-container mf-mx-auto mf-px-4 mf-pb-8 mf-bg-white">
                {children}
            </main>
        </div>
    );
};

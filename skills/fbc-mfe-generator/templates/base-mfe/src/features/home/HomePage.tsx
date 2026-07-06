import React from 'react';

/**
 * HomePage - Main landing page
 * 
 * TODO: Customize this page for your application
 */
export const HomePage: React.FC = () => {
  // TODO: Add your custom hooks here
  // Example:
  // const { t } = useTranslation();
  // const { user } = useUser();

  return (
    <div className="{{SCOPE_CLASS}} {{CSS_PREFIX}}p-6">
      <h1 className="{{CSS_PREFIX}}text-3xl {{CSS_PREFIX}}font-bold {{CSS_PREFIX}}mb-4">
        Welcome to {{DISPLAY_NAME}}
      </h1>
      
      <p className="{{CSS_PREFIX}}text-lg {{CSS_PREFIX}}mb-6">
        This is a base microfrontend template with essential configuration.
      </p>

      <div className="{{CSS_PREFIX}}bg-blue-50 {{CSS_PREFIX}}border {{CSS_PREFIX}}border-blue-200 {{CSS_PREFIX}}rounded {{CSS_PREFIX}}p-4 {{CSS_PREFIX}}mb-6">
        <h2 className="{{CSS_PREFIX}}font-semibold {{CSS_PREFIX}}mb-2">
          🚀 Quick Start
        </h2>
        <ul className="{{CSS_PREFIX}}list-disc {{CSS_PREFIX}}list-inside {{CSS_PREFIX}}space-y-1">
          <li>Edit this page in <code>src/features/home/HomePage.tsx</code></li>
          <li>Add new components in <code>src/shared/components/</code></li>
          <li>Add new hooks in <code>src/shared/hooks/</code></li>
          <li>Configure routes in <code>src/App.tsx</code></li>
        </ul>
      </div>

      <div className="{{CSS_PREFIX}}bg-green-50 {{CSS_PREFIX}}border {{CSS_PREFIX}}border-green-200 {{CSS_PREFIX}}rounded {{CSS_PREFIX}}p-4">
        <h2 className="{{CSS_PREFIX}}font-semibold {{CSS_PREFIX}}mb-2">
          ✨ What's Included
        </h2>
        <ul className="{{CSS_PREFIX}}list-disc {{CSS_PREFIX}}list-inside {{CSS_PREFIX}}space-y-1">
          <li>Redux Toolkit (auth, config, tenant slices)</li>
          <li>i18n (Spanish, English, Chinese)</li>
          <li>Material UI + Tailwind CSS</li>
          <li>React Hook Form + Yup validation</li>
          <li>Jest + React Testing Library</li>
          <li>ESLint + Prettier</li>
        </ul>
      </div>

      {/* TODO: Add your components here */}
      <div className="{{CSS_PREFIX}}mt-6">
        {/* Example: <YourComponent /> */}
      </div>
    </div>
  );
};

export default HomePage;

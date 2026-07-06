import React from 'react';

/**
 * ExamplePage - Template for new features
 * 
 * TODO: Rename this file and component to match your feature name
 * Example: ExamplePage.tsx -> DashboardPage.tsx
 */
export const ExamplePage: React.FC = () => {
  // TODO: Add your custom hooks here
  // Example:
  // const { data, loading, error } = useExampleData();
  // const { t } = useTranslation();
  
  // TODO: Add your state management
  // const [state, setState] = useState();

  return (
    <div className="{{SCOPE_CLASS}} {{CSS_PREFIX}}p-6">
      <h1 className="{{CSS_PREFIX}}text-2xl {{CSS_PREFIX}}font-bold {{CSS_PREFIX}}mb-4">
        Example Feature Page
      </h1>
      
      <p className="{{CSS_PREFIX}}mb-4">
        This is a template for creating new features. Follow these steps:
      </p>

      <ol className="{{CSS_PREFIX}}list-decimal {{CSS_PREFIX}}list-inside {{CSS_PREFIX}}space-y-2">
        <li>Copy this folder to src/features/your-feature-name/</li>
        <li>Rename ExamplePage.tsx to YourFeaturePage.tsx</li>
        <li>Update the component name and logic</li>
        <li>Add your components in the components/ folder</li>
        <li>Add your types in types/</li>
        <li>Add your hooks in hooks/</li>
        <li>Add tests in __tests__/</li>
        <li>Add route in src/App.tsx</li>
      </ol>

      {/* TODO: Add your components here */}
      <div className="{{CSS_PREFIX}}mt-6">
        {/* Example component usage */}
        {/* <YourComponent /> */}
      </div>
    </div>
  );
};

export default ExamplePage;

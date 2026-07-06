const React = require('react');

// Mock de FbcSelect
const FbcSelect = ({ children, ...props }) => 
  React.createElement('select', { 'data-testid': 'fbc-select', ...props }, children);

// Mock de FbcButton
const FbcButton = ({ children, ...props }) =>
  React.createElement('button', { 'data-testid': 'fbc-button', ...props }, children);

// Mock de FbcTabs
const FbcTabs = (props) =>
  React.createElement('div', { 'data-testid': 'fbc-tabs', ...props });

module.exports = {
  FbcSelect,
  FbcButton,
  FbcTabs,
};

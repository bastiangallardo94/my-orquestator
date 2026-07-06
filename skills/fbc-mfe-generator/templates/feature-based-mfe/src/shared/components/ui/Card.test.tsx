import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';
import { navigateToUrl } from 'single-spa';

jest.mock('single-spa', () => ({
  navigateToUrl: jest.fn(),
}));

jest.mock('single-spa-react', () => () => ({
  bootstrap: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
}));

jest.mock('@shared/hooks/useGlobalDrawerState', () => ({
  useGlobalDrawerState: jest.fn().mockReturnValue({ isOpen: false }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, fallback: string) => fallback ?? key }),
}));

jest.mock('../../assets/images/Card-Prov.svg', () => 'card-icon.svg');

describe('Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default title when none is provided', () => {
    render(<Card />);
    expect(screen.getByText('Imports Inspection')).toBeInTheDocument();
  });

  it('renders with a custom title', () => {
    render(<Card title="My Custom Card" />);
    expect(screen.getByText('My Custom Card')).toBeInTheDocument();
  });

  it('renders the default icon when no imageSrc is provided', () => {
    render(<Card />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('renders the provided imageSrc', () => {
    render(<Card imageSrc="custom-image.png" imageAlt="Custom Alt" />);
    const img = screen.getByAltText('Custom Alt');
    expect(img).toHaveAttribute('src', 'custom-image.png');
  });

  it('has the correct role="button" attribute', () => {
    render(<Card />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick handler when provided and card is clicked', () => {
    const onClickMock = jest.fn();
    render(<Card onClick={onClickMock} />);
    fireEvent.click(screen.getByTestId('template-card'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('calls navigateToUrl when no onClick is provided', () => {
    render(<Card appPath="/inspection" />);
    fireEvent.click(screen.getByTestId('template-card'));
    expect(navigateToUrl).toHaveBeenCalledWith('/inspection');
  });

  it('navigates on Enter keydown', () => {
    render(<Card appPath="/inspection" />);
    fireEvent.keyDown(screen.getByTestId('template-card'), { key: 'Enter' });
    expect(navigateToUrl).toHaveBeenCalledWith('/inspection');
  });

  it('navigates on Space keydown', () => {
    render(<Card appPath="/inspection" />);
    fireEvent.keyDown(screen.getByTestId('template-card'), { key: ' ' });
    expect(navigateToUrl).toHaveBeenCalledWith('/inspection');
  });

  it('applies hover styles on mouse enter', () => {
    render(<Card />);
    const card = screen.getByTestId('template-card');
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle({ backgroundColor: '#f5f5f5' });
  });

  it('reverts hover styles on mouse leave', () => {
    render(<Card />);
    const card = screen.getByTestId('template-card');
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    expect(card).toHaveStyle({ backgroundColor: '#FFFFFF' });
  });
});

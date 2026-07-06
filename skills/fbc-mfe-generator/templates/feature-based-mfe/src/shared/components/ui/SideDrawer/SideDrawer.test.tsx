import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SideDrawer } from './SideDrawer';

// Mock createPortal to render inline (simplifies testing)
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: any) => node,
}));

describe('SideDrawer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('does not render when isOpen=false', () => {
    const { container } = render(
      <SideDrawer isOpen={false} onClose={jest.fn()}>
        <p>content</p>
      </SideDrawer>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen=true', () => {
    render(
      <SideDrawer isOpen={true} onClose={jest.fn()}>
        <p>content</p>
      </SideDrawer>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <SideDrawer isOpen={true} onClose={jest.fn()} title="Drawer Title">
        <p>content</p>
      </SideDrawer>
    );

    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const mockClose = jest.fn();

    render(
      <SideDrawer isOpen={true} onClose={mockClose}>
        <p>content</p>
      </SideDrawer>
    );

    fireEvent.click(screen.getByTestId('drawer-overlay'));

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close when overlay clicked if closeOnOverlayClick=false', () => {
    const mockClose = jest.fn();

    render(
      <SideDrawer
        isOpen={true}
        onClose={mockClose}
        closeOnOverlayClick={false}
      >
        <p>content</p>
      </SideDrawer>
    );

    fireEvent.click(screen.getByTestId('drawer-overlay'));

    expect(mockClose).not.toHaveBeenCalled();
  });

  it('closes on ESC key when closeOnEsc=true', () => {
    const mockClose = jest.fn();

    render(
      <SideDrawer isOpen={true} onClose={mockClose}>
        <p>content</p>
      </SideDrawer>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close on ESC when closeOnEsc=false', () => {
    const mockClose = jest.fn();

    render(
      <SideDrawer isOpen={true} onClose={mockClose} closeOnEsc={false}>
        <p>content</p>
      </SideDrawer>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockClose).not.toHaveBeenCalled();
  });

  it('prevents body scroll when open', () => {
    render(
      <SideDrawer isOpen={true} onClose={jest.fn()}>
        <p>content</p>
      </SideDrawer>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when unmounted', () => {
    const { unmount } = render(
      <SideDrawer isOpen={true} onClose={jest.fn()}>
        <p>content</p>
      </SideDrawer>
    );

    unmount();

    expect(document.body.style.overflow).toBe('');
  });
});

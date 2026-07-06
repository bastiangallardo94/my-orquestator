import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import FileUploader from './FileUploader';

// Helper wrapper to simulate controlled usage
const ControlledWrapper = ({
  label = 'Upload',
  description,
}: {
  label?: string;
  description?: string;
  maxFiles?: number;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileUploader
      label={label}
      description={description}
      selectedFiles={files}
      onFilesSelected={setFiles}
      onRemoveFile={(file: File) => setFiles((prev) => {
        const newFiles = prev.filter((image) => image !== file);
        return newFiles
      })}
    />
  );
};

describe('FileUploader', () => {
  it('renders label and description', () => {
    render(<ControlledWrapper label="Upload your files" description="Drag or select files" />);
    expect(screen.getByText('Upload your files')).toBeInTheDocument();
    expect(screen.getByText('Drag or select files')).toBeInTheDocument();
  });

  it('calls onFilesSelected when files are selected manually', () => {
    render(<ControlledWrapper label="Upload" />);
    const input = screen.getByLabelText('Upload').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  it('calls onFilesSelected when files are dropped', () => {
    render(<ControlledWrapper label="Upload" />);
    const dropZone = screen.getByRole('input');
    const file = new File(['world'], 'drop.txt', { type: 'text/plain' });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(screen.getByText('drop.txt')).toBeInTheDocument();
  });

  it('removes a file when trash icon is clicked', () => {
    render(<ControlledWrapper label="Upload" />);
    const input = screen.getByLabelText('Upload').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['bye'], 'remove.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('remove.txt')).toBeInTheDocument();

    const removeButton = screen.getByAltText('Remove');
    fireEvent.click(removeButton);

    expect(screen.queryByText('remove.txt')).not.toBeInTheDocument();
  });

  it('removes a file when pressing Enter on trash icon', () => {
    render(<ControlledWrapper label="Upload" />);
    const input = screen.getByLabelText('Upload').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['bye'], 'keyboard.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    const removeButton = screen.getByAltText('Remove');
    fireEvent.keyDown(removeButton, { key: 'Enter' });

    expect(screen.queryByText('keyboard.txt')).not.toBeInTheDocument();
  });

});

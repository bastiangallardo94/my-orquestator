/* eslint-disable no-unused-vars */
import React, { useState, DragEvent, ChangeEvent } from 'react';
import './FileUploader.scss';
import CheckIcon from './img/check.svg';
import TrashIcon from './img/trash.svg';
import UploadIcon from './img/upload-icon.svg';

interface FileUploaderProps {
  label: string;
  description?: string;
  selectedFiles: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (file: File) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const newFiles = [...selectedFiles, ...fileArray];
    onFilesSelected(newFiles);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    handleFiles(e.target.files);
    e.target.value = ''
  };

  // Format file size in KB/MB
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`file-uploader-container ${disabled ?? 'disabled'}`}>
      {!disabled &&
        <div
          className={`file-uploader ${dragActive ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="input"
        >
          <label htmlFor="fileInput" className="label">
            <img
              alt="Upload"
              className="mf-block mf-w-[70px] mf-h-[60px] mf-mx-auto"
              style={{ objectFit: 'cover' }}
              src={UploadIcon}
            />
            <span>{label}</span>
          </label>
          <input
            type="file"
            multiple
            onChange={handleChange}
            style={{ display: 'none' }}
            id="fileInput"
          />
          {description && <p className="description">{description}</p>}
        </div>
      }

      <div>
        {selectedFiles.map((file, idx) => (
          <div
            key={idx}
            className='uploaded-file'>
            <img
              alt="Uploaded"
              className="mf-block mf-w-[20px] mf-h-[20px]"
              style={{ objectFit: 'cover' }}
              src={CheckIcon}
            />
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatSize(file.size)}</p>
            </div>
            <img
              alt="Remove"
              role='button'
              className="mf-block mf-w-[24px] mf-h-[24px] mf-ml-auto cursor-pointer"
              style={{ objectFit: 'cover' }}
              src={TrashIcon}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRemoveFile(file)
                }
              }}
              onClick={() => onRemoveFile(file)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;

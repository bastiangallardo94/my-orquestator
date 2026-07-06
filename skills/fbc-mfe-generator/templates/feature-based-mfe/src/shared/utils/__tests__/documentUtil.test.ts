import { getMimeType } from '../documentUtil';

describe('getMimeType', () => {
  it('returns correct MIME type for pdf', () => {
    expect(getMimeType('file.pdf')).toBe('application/pdf');
  });

  it('returns correct MIME type for jpg', () => {
    expect(getMimeType('image.jpg')).toBe('image/jpeg');
  });

  it('returns correct MIME type for jpeg', () => {
    expect(getMimeType('image.jpeg')).toBe('image/jpeg');
  });

  it('returns correct MIME type for png', () => {
    expect(getMimeType('image.png')).toBe('image/png');
  });

  it('returns correct MIME type for gif', () => {
    expect(getMimeType('image.gif')).toBe('image/gif');
  });

  it('returns correct MIME type for doc', () => {
    expect(getMimeType('file.doc')).toBe('application/msword');
  });

  it('returns correct MIME type for docx', () => {
    expect(getMimeType('file.docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });

  it('returns correct MIME type for xls', () => {
    expect(getMimeType('file.xls')).toBe('application/vnd.ms-excel');
  });

  it('returns correct MIME type for xlsx', () => {
    expect(getMimeType('file.xlsx')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it('returns application/octet-stream for unknown extension', () => {
    expect(getMimeType('file.unknown')).toBe('application/octet-stream');
  });

  it('returns application/octet-stream for file with no extension', () => {
    expect(getMimeType('filenoextension')).toBe('application/octet-stream');
  });

  it('is case-insensitive for extension', () => {
    expect(getMimeType('file.PDF')).toBe('application/pdf');
    expect(getMimeType('image.JPG')).toBe('image/jpeg');
  });

  it('handles file with multiple dots correctly', () => {
    expect(getMimeType('my.report.final.pdf')).toBe('application/pdf');
  });
});

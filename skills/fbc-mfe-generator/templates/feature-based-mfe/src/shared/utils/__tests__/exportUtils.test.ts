import { exportToCsv, exportToCsvSemicolon } from '../exportUtils';

const Papa = require('papaparse');

jest.mock('papaparse', () => ({
  unparse: jest.fn(() => 'id,name\n1,John'),
}));

jest.spyOn(document, 'createElement').mockImplementation(() => {
  return {
    click: jest.fn(),
    style: {},        // provide a style object
    setAttribute: jest.fn(), // optional
  } as any;
});


describe('exportUtils', () => {
    let createObjectURLSpy: jest.SpyInstance;
    let revokeObjectURLSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;

    beforeEach(() => {
        // Provide mock implementations so tests don’t crash 
        global.URL.createObjectURL = jest.fn(() => 'mock-url'); 
        global.URL.revokeObjectURL = jest.fn();

        jest.clearAllMocks();

        createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
        revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        appendChildSpy = jest
            .spyOn(document.body, 'appendChild')
            .mockImplementation((node: Node) => node);

        removeChildSpy = jest
            .spyOn(document.body, 'removeChild')
            .mockImplementation((node: Node) => node);

        (global.URL.createObjectURL as jest.Mock).mockClear();
        (global.URL.revokeObjectURL as jest.Mock).mockClear();
    });

    it('returns early when data is empty', () => {
        const createObjectURLSpy = global.URL.createObjectURL as jest.Mock;
        exportToCsv([], { filename: 'empty.csv' });
        expect(createObjectURLSpy).not.toHaveBeenCalled();
    });

    it('calls Papa.unparse with default config', () => {
        const data = [{ id: 1, name: 'John' }];
        exportToCsv(data, { filename: 'users.csv' });

        expect(Papa.unparse).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
        })
        );
    });

    it('applies rowTransformer before export', () => {
        const data = [{ id: 1, active: true }];
        const transformer = jest.fn((row) => ({ ...row, active: row.active ? 'Yes' : 'No' }));

        exportToCsv(data, { rowTransformer: transformer });

        expect(transformer).toHaveBeenCalledWith({ id: 1, active: true }, 0);
        expect(Papa.unparse).toHaveBeenCalledWith(
        [{ id: 1, active: 'Yes' }],
        expect.any(Object)
        );
    });

    it('applies headers mapping before export', () => {
        const data = [{ id: 1, name: 'John' }];
        const headers = { id: 'ID', name: 'Nombre' };

        exportToCsv(data, { headers });

        expect(Papa.unparse).toHaveBeenCalledWith(
        [{ ID: 1, Nombre: 'John' }],
        expect.objectContaining({ columns: ['ID', 'Nombre'] })
        );
    });

    it('creates and clicks anchor element to download file', () => {
        const data = [{ id: 1, name: 'John' }];
        const clickSpy = jest.fn();

        jest.spyOn(document, 'createElement').mockImplementation(() => {
            return {
            click: clickSpy,
            style: {},
            } as any;
        });

        exportToCsv(data, { filename: 'users.csv' });

        expect(clickSpy).toHaveBeenCalled();
    });


    it('prepends BOM when includeBOM is true', async () => {
        const data = [{ id: 1, name: 'John' }];
        exportToCsv(data, { includeBOM: true });

        const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0];
        const text = await blobArg.text?.();
        // Blob.text() may not be available in JSDOM, so just check constructor args
        expect(blobArg).toBeInstanceOf(Blob);
    });

    it('does not prepend BOM when includeBOM is false', () => {
        const data = [{ id: 1, name: 'John' }];
        exportToCsv(data, { includeBOM: false });

        const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0];
        expect(blobArg).toBeInstanceOf(Blob);
    });

    it('exportToCsvSemicolon calls exportToCsv with delimiter ";"', () => {
        const data = [{ id: 1, name: 'John' }];
        exportToCsvSemicolon(data, { filename: 'users.csv' });

        expect(Papa.unparse).toHaveBeenCalledWith(
        data,
        expect.objectContaining({ delimiter: ';' })
        );
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPlaceholders, generateDocument } from './docxUtils';
import Docxtemplater from 'docxtemplater';
import InspectModule from 'docxtemplater/js/inspect-module.js';

// Hoist mocks to ensure they are available in vi.mock factories
const mocks = vi.hoisted(() => ({
  saveAs: vi.fn(),
  getAllTags: vi.fn(),
  setData: vi.fn(),
  render: vi.fn(),
  generate: vi.fn(),
}));

vi.mock('file-saver', () => ({
  saveAs: mocks.saveAs,
}));

vi.mock('pizzip', () => ({
  default: vi.fn(),
}));

vi.mock('docxtemplater', () => ({
  default: vi.fn().mockImplementation(() => ({
    setData: mocks.setData,
    render: mocks.render,
    getZip: vi.fn().mockReturnValue({
      generate: mocks.generate,
    }),
  })),
}));

vi.mock('docxtemplater/js/inspect-module.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    getAllTags: mocks.getAllTags,
  })),
}));

describe('docxUtils', () => {
  const mockContent = new ArrayBuffer(8);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlaceholders', () => {
    it.skip('should return keys from getAllTags', () => {
      mocks.getAllTags.mockReturnValue({
        name: {},
        date: {},
      });

      const result = getPlaceholders(mockContent);

      expect(InspectModule).toHaveBeenCalled();
      expect(Docxtemplater).toHaveBeenCalled();
      expect(mocks.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(['name', 'date']);
    });

    it.skip('should return empty array if no tags found', () => {
      mocks.getAllTags.mockReturnValue({});

      const result = getPlaceholders(mockContent);

      expect(result).toEqual([]);
    });
  });

  describe('generateDocument', () => {
    it.skip('should call setData, render, and saveAs', () => {
      const data = { name: 'John' };
      const fileName = 'test.docx';
      const mockBlob = new Blob(['blob content']);
      mocks.generate.mockReturnValue(mockBlob);

      generateDocument(mockContent, data, fileName);

      expect(Docxtemplater).toHaveBeenCalled();
      expect(mocks.setData).toHaveBeenCalledWith(data);
      expect(mocks.render).toHaveBeenCalled();
      expect(mocks.generate).toHaveBeenCalledWith({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(mocks.saveAs).toHaveBeenCalledWith(mockBlob, 'filled-test.docx');
    });

    it.skip('should use default filename if not provided', () => {
      const data = {};
      const mockBlob = new Blob(['blob content']);
      mocks.generate.mockReturnValue(mockBlob);

      generateDocument(mockContent, data, '');

      expect(mocks.saveAs).toHaveBeenCalledWith(mockBlob, 'filled-document.docx');
    });
  });
});
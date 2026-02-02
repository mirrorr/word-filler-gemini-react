import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

// The inspect module can be used to get the list of tags
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import InspectModule from 'docxtemplater/js/inspect-module.js';

export const getPlaceholders = (content: ArrayBuffer): string[] => {
  const zip = new PizZip(content);
  const inspectModule = new InspectModule();
  new Docxtemplater(zip, {
    modules: [inspectModule],
    delimiters: { start: '{{', end: '}}' }
  });
  const tags = inspectModule.getAllTags();
  return Object.keys(tags);
};

export const generateDocument = (
  content: ArrayBuffer,
  data: Record<string, string>,
  originalFileName: string
) => {
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: '{{', end: '}}' },
    nullGetter: () => '',
  });

  doc.setData(data);
  doc.render();

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  saveAs(out, `filled-${originalFileName || 'document'}.docx`);
};

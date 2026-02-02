import { useState } from 'react';
import { getPlaceholders, generateDocument } from './utils/docxUtils';
import { FileUpload } from './components/FileUpload';
import { PlaceholderList } from './components/PlaceholderList';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploadKey, setUploadKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileLoaded = (content: ArrayBuffer, name: string) => {
    setFileName(name);
    setError('');
    setPlaceholders([]);
    setPlaceholderValues({});
    setFileContent(content);

    try {
      const tags = getPlaceholders(content);
      if (tags.length === 0) {
        setError("No placeholders in the format {{PLACEHOLDER}} found in the document.");
      } else {
        setPlaceholders(tags);
        const initialValues = tags.reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {} as Record<string, string>);
        setPlaceholderValues(initialValues);
      }
    } catch (err) {
      console.error(err);
      setError('Error reading .docx file. Please make sure it is a valid and uncorrupted .docx file.');
      setFileContent(null);
      setFileName('');
    }
  };

  const handleValueChange = (placeholder: string, value: string) => {
    setPlaceholderValues(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleGenerate = async () => {
    if (!fileContent) {
      setError('Please upload a file first.');
      return;
    }

    setIsGenerating(true);
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      generateDocument(fileContent, placeholderValues, fileName);
      toast.success('Document generated successfully!');
    } catch (err) {
      console.error(err);
      setError('An error occurred during document generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setPlaceholders([]);
    setPlaceholderValues({});
    setFileContent(null);
    setFileName('');
    setError('');
    setUploadKey((prev) => prev + 1);
  };

  const handleClearValues = () => {
    setPlaceholderValues({});
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4 sm:p-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Word Template Filler</h1>

        <FileUpload
          key={uploadKey}
          onFileLoaded={handleFileLoaded}
          onError={setError}
          fileName={fileName}
        />

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <PlaceholderList
          placeholders={placeholders}
          values={placeholderValues}
          onValueChange={handleValueChange}
        />

        {placeholders.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button onClick={handleRestart} className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300">
              Restart
            </button>
            <button onClick={handleClearValues} className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300">
              Clear values
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 flex items-center justify-center ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Document'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
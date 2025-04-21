import React, { useEffect, useRef, useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import GettingStarted from './GettingStarted';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useDirectoryContext } from '../hooks/useDirectoryContext';

const Editor: React.FC = () => {
  const { activeNotebook, activeFolder, activeFile } = useDirectoryContext();
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [fileContents, setFileContents] = useState(activeFile);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electron.readFile(`${activeNotebook}/${activeFolder}/${activeFile}`);
      console.log(data)
      setFileContents(data);
      setIsDirty(false);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile]);

  useEffect(() => {
    if (isDirty) {
      document.title = `Markdown Notes ✏️`;
    } else {
      document.title = 'Markdown Notes';
    }
  }, [isDirty]);

  const saveFile = () => {
    if (activeNotebook === '' || activeFolder === '' || activeFile === '') {
      setSaveStatus('Cannot save: No file selected');
      return;
    }

    try {
      const filePath = `${activeNotebook}/${activeFolder}`;
      console.log("DEBUG", filePath)
      window.electron.writeFile(filePath, activeFile, fileContents);
      setSaveStatus('File saved successfully');
      setIsDirty(false);

      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error saving file:', error);
      setSaveStatus('Error saving file');
    }
  };

  useKeyboardShortcuts({
    'Meta+s': saveFile, // Mac
    'Ctrl+s': saveFile // Windows
  });

  useEffect(() => {
    const fetchData = async () => {
      if (activeNotebook === '' || activeFolder === '' || activeFile === '')
        return;
      const filePath = `${activeNotebook}/${activeFolder}/${activeFile}`;
      const fileContent = await window.electron.readFile(filePath);
      setFileContents(fileContent);
    }

    fetchData();
  }, [activeNotebook, activeFolder, activeFile]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = textAreaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value =
          textarea.value.substring(0, start) +
          '\t' +
          textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
    }
  };

  if (!activeNotebook || !activeFolder || !activeFile) {
    return <GettingStarted />;
  }

  return (
    <div className="editor-wrapper">
      {activeNotebook !== '' && activeFolder !== '' && activeFile !== '' && (
        <BreadCrumbs crumbs={[activeNotebook, activeFolder, activeFile]} />
      )}

      <section className="editor">
        {saveStatus && <div className="save-status">{saveStatus}</div>}
        <textarea
          ref={textAreaRef}
          placeholder="Write your notes here..."
          className="editor__content"
          onKeyDown={handleKeyDown}
          value={fileContents}
          onChange={(e) => {
            setIsDirty(true);
            setFileContents(e.target.value);
          }}
        />
      </section>
    </div>
  );
};

export default Editor;

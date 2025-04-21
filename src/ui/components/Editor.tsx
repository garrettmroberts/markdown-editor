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
      const filePath = `src/data/${activeNotebook}/${activeFolder}/${activeFile}`;
      window.api.writeFile(filePath, fileContents);
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
    if (activeNotebook === '' || activeFolder === '' || activeFile === '')
      return;
    setFileContents(
      window.api.readFile(
        `src/data/${activeNotebook}/${activeFolder}/${activeFile}`
      ) || ''
    );
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

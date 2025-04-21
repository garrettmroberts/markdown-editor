import { useState } from 'react';
import { LuNotebook, LuNotebookPen } from 'react-icons/lu';
import { useDirectoryContext } from '../hooks/useDirectoryContext';

const NotebookFinder = () => {
  const { notebooks, activeNotebook, setActiveNotebook } =
    useDirectoryContext();

  const [isNotebookDirOpen, setIsNotebookDirOpen] = useState(false);

  return (
    <div className="notebook-finder-container">
      <div
        className="notebook-finder"
        onClick={() => {
          setIsNotebookDirOpen(!isNotebookDirOpen);
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isNotebookDirOpen}
        aria-haspopup="listbox"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsNotebookDirOpen(!isNotebookDirOpen);
          }
        }}
      >
        <div className="notebook-finder__header">
          <p className="notebook-finder__header__label">Current notebook:</p>
          <div className="notebook-finder__header__title">
            <LuNotebookPen aria-hidden="true" />
            <span>{activeNotebook}</span>
          </div>
        </div>
        <div
          className={`notebook-finder__chevron ${isNotebookDirOpen ? 'notebook-finder__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </div>
      <div
        className={`notebook-finder__dropdown ${isNotebookDirOpen ? 'notebook-finder__dropdown--visible' : ''}`}
        role="listbox"
        aria-hidden={!isNotebookDirOpen}
      >
        {notebooks
          .filter((nb) => nb !== activeNotebook)
          .map((nb) => (
            <div
              className="notebook-finder__dropdown__notebook"
              key={nb}
              onClick={(e) => {
                e.stopPropagation();
                setActiveNotebook(nb);
                setIsNotebookDirOpen(false);
              }}
              role="option"
              tabIndex={isNotebookDirOpen ? 0 : -1}
              aria-selected={false}
            >
              <LuNotebook aria-hidden="true" />
              <span>{nb}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotebookFinder;

import { useRef, useState } from 'react';
import { HiLightningBolt } from 'react-icons/hi';
import {
  MdChevronLeft,
  MdChevronRight,
  MdSettings,
  MdAdd
} from 'react-icons/md';
import React from 'react';
import { useDirectoryContext } from '../hooks/useDirectoryContext';
import Dropdown from './Dropdown';
import List from './List';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIContext } from '../hooks/useUIContext';
import { ModalTypes } from '../contexts/UIContext';

const Navigator = () => {
  const {
    notebooks,
    activeNotebook,
    setActiveNotebook,
    folders,
    activeFolder,
    setActiveFolder,
    files,
    activeFile,
    setActiveFile
  } = useDirectoryContext();
  const { setModal } = useUIContext();
  const [navWidth, setNavWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const draggingRef = useRef(false);
  const mouseXRef = useRef(0);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
  };

  useKeyboardShortcuts({
    'Meta+n': handleToggleCollapse, // Mac
    'Ctrl+n': handleToggleCollapse // Windows
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);

    mouseXRef.current = e.clientX;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const newWidth = e.clientX;

    mouseXRef.current = newWidth;

    if (newWidth >= 200) {
      setNavWidth(newWidth);
      setIsCollapsed(false);
    } else if (newWidth <= 60) {
      setIsCollapsed(true);
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    setIsDragging(false);

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const openCreationModal = () => {
    setModal(ModalTypes.CREATE_NOTEBOOK);
  };

  const openSettings = () => {
    console.error('openSettings is not yet implemented.');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(ModalTypes.CREATE_FILE);
  };

  return (
    <div
      className={`navigator ${isCollapsed ? 'navigator--collapsed' : ''} ${isDragging ? 'navigator--dragging' : ''}`}
      style={{ width: isCollapsed ? '60px' : `${navWidth}px` }}
    >
      <div className="navigator__header">
        <HiLightningBolt
          className="navigator__header__icon"
          onClick={handleToggleCollapse}
        />
        <h1 className="navigator__header__title">MDNotes</h1>
        <button
          className="navigator__collapse-btn"
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? 'Expand navigator' : 'Collapse navigator'}
        >
          {isCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </div>
      <div className="navigator__body">
        {notebooks.length > 0 && (
          <Dropdown
            elements={notebooks}
            activeElement={activeNotebook}
            onSelect={(selected) => {
              setActiveNotebook(selected);
            }}
            label="Active Notebook: "
          />
        )}

        <div className="navigator__body__list-wrapper">
          <List
            elements={folders}
            activeElement={activeFolder}
            onSelect={(selected) => {
              setActiveFolder(selected);
            }}
            label="Folders"
            onContextMenu={handleContextMenu}
          />
          <List
            elements={files}
            activeElement={activeFile}
            onSelect={(selected) => {
              setActiveFile(selected);
            }}
            label="Files"
          />
        </div>
      </div>
      <div className="navigator__footer">
        {!isCollapsed && <span>{notebooks.length} notebooks</span>}
        <div className="navigator__footer__actions">
          <button
            className="navigator__footer__actions__button"
            aria-label="Add new notebook"
            onClick={openCreationModal}
          >
            <MdAdd />
          </button>
          <button
            className="navigator__footer__actions__button"
            aria-label="Settings"
            onClick={openSettings}
          >
            <MdSettings />
          </button>
        </div>
      </div>
      <div
        className="navigator__sizer"
        onMouseDown={(e) => handleMouseDown(e)}
      />
    </div>
  );
};

export default Navigator;

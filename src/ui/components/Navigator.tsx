import { useRef, useState, useEffect } from 'react';
import { HiLightningBolt } from 'react-icons/hi';
import {
  MdChevronLeft,
  MdChevronRight,
  MdAdd
} from 'react-icons/md';
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
    setActiveFile,
    dispatch
  } = useDirectoryContext();
  const { setModal } = useUIContext();
  const [navWidth, setNavWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: '', // 'folder' or 'file'
    targetItem: '' // the name of the folder or file
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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

  // const openSettings = () => {
  //   console.error('openSettings is not yet implemented.');
  // };

  const handleContextMenu = (e: React.MouseEvent, type: 'folder' | 'file', item: string) => {
    e.preventDefault();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type,
      targetItem: item
    });
  };

  const handleContextMenuAction = async (action: string) => {
    const { type, targetItem } = contextMenu;
    setContextMenu(prev => ({ ...prev, visible: false }));
    
    if (action === 'create-file') {
      setModal(ModalTypes.CREATE_FILE);
    } else if (action === 'create-folder') {
      setModal(ModalTypes.CREATE_FOLDER);
    } else if (action === 'delete') {
      const pathToDelete = type === 'file' 
        ? `${activeNotebook}/${activeFolder}/${targetItem}` 
        : `${activeNotebook}/${targetItem}`;
      
      const success = await window.electron.deleteElement(pathToDelete);
      
      if (success) {
        if (type === 'file') {
          const updatedFiles = files.filter(file => file !== targetItem);
          dispatch({ type: 'SET_FILES', payload: updatedFiles });
          
          if (activeFile === targetItem) {
            dispatch({ type: 'SET_ACTIVE_FILE', payload: updatedFiles.length > 0 ? updatedFiles[0] : '' });
          }
        } 
        else if (type === 'folder') {
          const updatedFolders = folders.filter(folder => folder !== targetItem);
          dispatch({ type: 'SET_FOLDERS', payload: updatedFolders });
          
          if (activeFolder === targetItem) {
            const newActiveFolder = updatedFolders.length > 0 ? updatedFolders[0] : '';
            dispatch({ type: 'SET_ACTIVE_FOLDER', payload: newActiveFolder });
            
            if (newActiveFolder) {
              const newFiles = await window.electron.listFiles(
                `${activeNotebook}/${newActiveFolder}`
              );
              dispatch({ type: 'SET_FILES', payload: newFiles });
              
              dispatch({ 
                type: 'SET_ACTIVE_FILE', 
                payload: newFiles.length > 0 ? newFiles[0] : '' 
              });
            } else {
              dispatch({ type: 'SET_FILES', payload: [] });
              dispatch({ type: 'SET_ACTIVE_FILE', payload: '' });
            }
          }
        }
      }
    }
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
            onContextMenu={(e, item) => handleContextMenu(e, 'folder', item)}
          />
          <List
            elements={files}
            activeElement={activeFile}
            onSelect={(selected) => {
              setActiveFile(selected);
            }}
            label="Files"
            onContextMenu={(e, item) => handleContextMenu(e, 'file', item)}
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
          {/* <button
            className="navigator__footer__actions__button"
            aria-label="Settings"
            onClick={openSettings}
          >
            <MdSettings />
          </button> */}
        </div>
      </div>
      <div
        className="navigator__sizer"
        onMouseDown={(e) => handleMouseDown(e)}
      />
      {contextMenu.visible && (
        <div 
          ref={contextMenuRef}
          className="context-menu context-menu--visible"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x
          }}
        >
          <ul className="context-menu__list">
            {contextMenu.type === 'folder' && (
              <li
                className="context-menu__item"
                onClick={() => handleContextMenuAction('create-file')}
              >
                Create file
              </li>
            )}
            <li
              className="context-menu__item context-menu__item--danger"
              onClick={() => handleContextMenuAction('delete')}
            >
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navigator;

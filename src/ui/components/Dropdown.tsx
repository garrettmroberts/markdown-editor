import { useState, FC, useRef, useEffect } from 'react';
import { LuNotebook, LuNotebookPen } from 'react-icons/lu';
import { useUIContext } from '../hooks/useUIContext';
import { ModalTypes } from '../contexts/UIContext';
import { useDirectoryContext } from '../hooks/useDirectoryContext';

interface DropdownProps {
  elements: string[];
  activeElement: string;
  onSelect: (element: string) => void;
  label: string;
}

const Dropdown: FC<DropdownProps> = ({
  elements,
  activeElement,
  onSelect,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetItem: ''
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const { setModal } = useUIContext();
  const { notebooks, dispatch } = useDirectoryContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node) &&
        contextMenu.visible
      ) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = (event: React.MouseEvent, notebook: string = activeElement) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetItem: notebook
    });
  };

  const handleContextMenuAction = async (action: string) => {
    setContextMenu(prev => ({ ...prev, visible: false }));
    if (action === 'create-folder') {
      setModal({
        type: ModalTypes.CREATE_FOLDER,
        data: {
          notebook: contextMenu.targetItem
        }
      });
    } else if (action === 'delete') {
      try {
        const notebookToDelete = contextMenu.targetItem;
        const isActiveNotebook = notebookToDelete === activeElement;
        
        const success = await window.electron.deleteElement(notebookToDelete);
        
        if (success) {
          // Remove the notebook from state
          const updatedNotebooks = notebooks.filter(notebook => notebook !== notebookToDelete);
          dispatch({ type: 'SET_NOTEBOOKS', payload: updatedNotebooks });
          
          // Check if we have notebooks left
          if (updatedNotebooks.length === 0) {
            // No notebooks left, clear everything
            dispatch({ type: 'SET_ACTIVE_NOTEBOOK', payload: '' });
            dispatch({ type: 'SET_FOLDERS', payload: [] });
            dispatch({ type: 'SET_ACTIVE_FOLDER', payload: '' });
            dispatch({ type: 'SET_FILES', payload: [] });
            dispatch({ type: 'SET_ACTIVE_FILE', payload: '' });
          } 
          // Only update active notebook if we deleted the active one
          else if (isActiveNotebook) {
            dispatch({ type: 'SET_ACTIVE_NOTEBOOK', payload: updatedNotebooks[0] });
            
            const folders = await window.electron.listDirectories(updatedNotebooks[0]);
            dispatch({ type: 'SET_FOLDERS', payload: folders });
          }
        }
      } catch (error) {
        console.error('Error deleting notebook:', error);
      }
    }
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        className="dropdown"
        data-testid="dropdown-button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="dropdown__header" onContextMenu={(e) => handleContextMenu(e)}>
          <p className="dropdown__header__label">{label}</p>
          <div className="dropdown__header__title">
            <LuNotebookPen aria-hidden="true" />
            <span data-testid="dropdown-active-element">{activeElement}</span>
          </div>
        </div>
        <div
          className={`dropdown__chevron ${isOpen ? 'dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </div>

      <div
        className={`dropdown__dropdown ${isOpen ? 'dropdown__dropdown--visible' : ''}`}
        role="listbox"
        aria-hidden={!isOpen}
        data-testid="dropdown-list"
      >
        {elements
          .filter((ele) => ele !== activeElement)
          .map((ele) => (
            <div
              className="dropdown__dropdown__ele"
              key={ele}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(ele);
                setIsOpen(false);
              }}
              role="option"
              tabIndex={isOpen ? 0 : -1}
              aria-selected={false}
              data-testid="dropdown-list-element"
              onContextMenu={(e) => handleContextMenu(e, ele)}
            >
              <LuNotebook aria-hidden="true" />
              <span>{ele}</span>
            </div>
          ))}
      </div>

      <div
        className={`context-menu ${contextMenu.visible ? 'context-menu--visible' : ''}`}
        style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x
        }}
        ref={contextMenuRef}
      >
        <ul className="context-menu__list">
          <li
            className="context-menu__item"
            onClick={() => handleContextMenuAction('create-folder')}
          >
            Create folder
          </li>
          <li
            className="context-menu__item context-menu__item--danger"
            onClick={() => handleContextMenuAction('delete')}
          >
            Delete
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;

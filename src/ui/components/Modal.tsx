import { MouseEvent, useEffect, useState, useRef } from 'react';
import { ModalTypes } from '../contexts/UIContext';
import { useUIContext } from '../hooks/useUIContext';
import { IoMdClose } from 'react-icons/io';
import { useDirectoryContext } from '../hooks/useDirectoryContext';

const Modal = () => {
  const { modal, setModal } = useUIContext();
  const { notebooks, createNotebook, createFolder, createFile, activeFolder } = useDirectoryContext();
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modal.type !== ModalTypes.NONE) {
      setIsVisible(true);
      
      if (modal.type === ModalTypes.CREATE_FOLDER && notebooks.length > 0) {
        setSelectedNotebook(notebooks[0]);
      }
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setIsVisible(false);
      setName('');
      setSelectedNotebook('');
    }
  }, [modal, notebooks]);

  const handleClose = (e: MouseEvent<Element>) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
      setTimeout(() => setModal({
        type: ModalTypes.NONE,
        data: undefined
      }), 300);
    }
  };

  const handleSubmit = () => {
    try {
      if (modal.type === ModalTypes.CREATE_NOTEBOOK) {
        createNotebook(name);
      } else if (modal.type === ModalTypes.CREATE_FOLDER) {
        createFolder(name, modal.data?.notebook || selectedNotebook);
      } else if (modal.type === ModalTypes.CREATE_FILE) {
        createFile(name, modal.data?.folder || activeFolder);
      }
      setIsVisible(false);
      setName('');
      setTimeout(() => setModal({
        type: ModalTypes.NONE,
        data: undefined
      }), 300);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`modal-container ${isVisible ? 'is-visible' : ''}`}
      onClick={handleClose}
    >
      <div className="modal">
        <span onClick={handleClose}>
          <IoMdClose
            className="modal__close-btn"
            onClick={() => setModal({
              type: ModalTypes.NONE,
              data: undefined
            })}
          />
        </span>
        <h2 className="modal__header">
          {modal.type === ModalTypes.CREATE_NOTEBOOK && 'Create New Notebook'}
          {modal.type === ModalTypes.CREATE_FOLDER && 'Create New Folder'}
          {modal.type === ModalTypes.CREATE_FILE && 'Create New File'}
        </h2>
        
        {modal.type === ModalTypes.CREATE_FOLDER && notebooks.length > 0 && (
          <>
            <label className="modal__label">Notebook:</label>
            <select
              className="modal__input"
              value={modal.data?.notebook || selectedNotebook}
              onChange={(e) => setModal({
                type: modal.type,
                data: {
                  ...modal.data,
                  notebook: e.target.value,
                }
              })}
            >
              {notebooks.map((notebook) => (
                <option key={notebook} value={notebook}>
                  {notebook}
                </option>
              ))}
            </select>
          </>
        )}
        
        <label className="modal__label">Name:</label>
        <input
          ref={inputRef}
          className="modal__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button className="modal__submit" type="button" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Modal;

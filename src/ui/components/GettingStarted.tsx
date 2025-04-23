import { ModalTypes } from '../contexts/UIContext';
import { useDirectoryContext } from '../hooks/useDirectoryContext';
import { useUIContext } from '../hooks/useUIContext';

const GettingStarted = () => {
  const { notebooks, folders, files } = useDirectoryContext();
  const { setModal } = useUIContext();

  const toggleCreateNotebookModal = () => {
    setModal({
      type: ModalTypes.CREATE_NOTEBOOK,
      data: {
        notebook: undefined
      }
    });
  };

  return (
    <div className="getting-started-container">
      <div className="getting-started">
        <p>============================================</p>
        <br />
        <br />
        {notebooks.length === 0 && (
          <>
            <h2>Welcome to the Notebook App!</h2>
            <br />
            <p>
              This is a simple notebook application that allows you to create,
              edit, and manage your notes.
            </p>
            <br />
            <p>
              To get started, let's create your first notebook. Click{' '}
              <span
                className="getting-started__text--bold"
                onClick={toggleCreateNotebookModal}
              >
                [here]
              </span>{' '}
              or on the '+' in the sidebar to generate one.
            </p>
            <br />
            <p>
              Once you have selected a file, you can start writing your notes in
              the editor.
            </p>
            <br />
            <p>
              You can use keyboard shortcuts to save your notes (Ctrl + S or Cmd
              + S) and navigate through your files.
            </p>
            <br />
            <p>
              If you have any questions or need help, feel free to reach out to
              me.
            </p>
            <br />
            <p>Happy note-taking!</p>
          </>
        )}
        {notebooks.length > 0 && folders.length === 0 && (
          <>
            <h2>Welcome to your new notebook!</h2>
            <br />
            <p>
              The notebook app is based on a structure of notebooks, folders,
              and files. Every folder needs a parent notebook and every file
              needs a parent folder.
            </p>
            <br />
            <p>
              Right click on your new notebook in the sidebar to create a new
              folder.
            </p>
          </>
        )}
        {notebooks.length > 0 && folders.length > 0 && files.length === 0 && (
          <>
            <h2>Welcome to your new folder!</h2>
            <br />
            <p>
              Right click on your new folder in the sidebar to create a new
              file.
            </p>
          </>
        )}
        <br />
        <br />
        <p>============================================</p>
      </div>
    </div>
  );
};

export default GettingStarted;

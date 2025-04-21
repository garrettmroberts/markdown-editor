import './styles/main.scss';
import Navigator from './components/Navigator';
import Editor from './components/Editor';
import { DirectoryProvider } from './contexts/DirectoryContext';
import { UIProvider } from './contexts/UIContext';
import Modal from './components/Modal';

function App() {
  return (
    <DirectoryProvider>
      <UIProvider>
        <main>
          <Modal />
          <Navigator />
          <Editor />
        </main>
      </UIProvider>
    </DirectoryProvider>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";
import NotesPage from "./pages/NotesPage";
import Toast from "./components/Toast";
import "./index.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const isFirstRender = useRef(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (!stored) return;
    try {
      setNotes(JSON.parse(stored));
    } catch {
      localStorage.removeItem("notes");
    }
  }, []);

  // Save to localStorage — skip the very first render to avoid
  // overwriting stored data with the initial empty [] state.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <NotesPage notes={notes} setNotes={setNotes} showToast={showToast} />

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onDone={() => removeToast(t.id)} />
        ))}
      </div>
    </>
  );
};

export default App;
import { useCallback, useState } from "react";
import NoteCard from "../components/NoteCard";
import SidePalette from "../components/SidePalette";
import EmptyState from "../components/EmptyState";
import { COLORS } from "../utils/constants";

const NotesPage = ({ notes, setNotes, showToast }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleUpdate = (id, payload) => {
    setNotes((prev) =>
      prev.map((n) => (n.$id === id ? { ...n, ...payload } : n))
    );
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.$id !== id));
    showToast("Note deleted");
  };

  const createNote = (color, count) => ({
    $id: Date.now().toString(),
    body: JSON.stringify(""),
    createdAt: Date.now(),
    pinned: false,
    colors: JSON.stringify({
      id: color.id,
      colorHeader: color.color,
      colorBody: color.color,
      colorText: "#18181A",
    }),
    position: JSON.stringify({
      x: 260 + (count % 6) * 22,
      y: 130 + (count % 6) * 22,
    }),
    size: JSON.stringify({
      width: 400,
      height: "auto",
    }),
  });

  const handleAddNote = useCallback(
    (color) => {
      const newNote = createNote(color, notes.length);
      setNotes((prev) => [newNote, ...prev]);
      showToast("Note created!");
    },
    [notes.length, setNotes, showToast]
  );

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sticky_notes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("Notes exported!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedNotes = JSON.parse(event.target.result);
        if (Array.isArray(importedNotes)) {
          setNotes(importedNotes);
          showToast("Notes imported!");
        }
      } catch (err) {
        showToast("Invalid file!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="app">
      <SidePalette
        colors={COLORS}
        selected={selectedColor}
        onSelect={setSelectedColor}
        onAdd={handleAddNote}
        onExport={handleExport}
        onImport={handleImport}
        noteCount={notes.length}
      />

      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note.$id}
            note={note}
            setNotes={setNotes}
            showToast={showToast}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default NotesPage;
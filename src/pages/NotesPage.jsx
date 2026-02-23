import { useCallback, useState } from "react";
import NoteCard from "../components/NoteCard";
import SidePalette from "../components/SidePalette";
import EmptyState from "../components/EmptyState";
import { COLORS } from "../utils/constants";

const NotesPage = ({ notes, setNotes, showToast }) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const createNote = (color, count) => ({
    $id: Date.now(),
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
  });

  const handleAddNote = useCallback(
    (color) => {
      setNotes((prev) => [...prev, createNote(color, prev.length)]);
    },
    [setNotes] // eslint-disable-line react-hooks/exhaustive-deps
  );


  return (
    <div id="app">
      <SidePalette
        colors={COLORS}
        selected={selectedColor}
        onSelect={setSelectedColor}
        onAdd={handleAddNote}
        noteCount={notes.length}
      />

      {notes.length === 0 && <EmptyState />}

      {notes.map((note) => (
        <NoteCard
          key={note.$id}
          note={note}
          setNotes={setNotes}
          showToast={showToast}
        />
      ))}
    </div>
  );
};

export default NotesPage;
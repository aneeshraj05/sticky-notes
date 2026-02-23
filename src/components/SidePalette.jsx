import { Plus } from "lucide-react";
import "./side.css";

const SidePalette = ({ colors, selected, onSelect, onAdd, noteCount }) => {
  return (
    <div className="side-palette">

      {/* Note count badge */}
      {noteCount > 0 && (
        <div className="note-count-badge" title={`${noteCount} note${noteCount !== 1 ? "s" : ""}`}>
          {noteCount}
        </div>
      )}

      {/* Add button */}
      <div
        className="palette-btn add"
        onClick={() => onAdd(selected)}
        title="Add note"
      >
        <Plus size={18} strokeWidth={2.5} />
      </div>

      {/* Color swatches */}
      {colors.map((c) => (
        <div
          key={c.id}
          className={`palette-btn ${selected.id === c.id ? "active" : ""}`}
          style={{ background: c.color }}
          onClick={() => onSelect(c)}
          title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
        />
      ))}

    </div>
  );
};

export default SidePalette;
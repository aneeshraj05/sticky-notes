import { Plus, Download, Upload } from "lucide-react";
import { useRef } from "react";
import "./side.css";

const SidePalette = ({ colors, selected, onSelect, onAdd, onExport, onImport, noteCount }) => {
  const fileInputRef = useRef(null);

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

      <div className="palette-divider" />

      {/* Export button */}
      <div
        className="palette-btn utility"
        onClick={onExport}
        title="Export Notes (JSON)"
      >
        <Download size={18} strokeWidth={2} />
      </div>

      {/* Import button */}
      <div
        className="palette-btn utility"
        onClick={() => fileInputRef.current.click()}
        title="Import Notes (JSON)"
      >
        <Upload size={18} strokeWidth={2} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json"
          onChange={onImport}
        />
      </div>

    </div>
  );
};

export default SidePalette;
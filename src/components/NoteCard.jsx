import { Trash2, Pin, PinOff, Minus, Plus, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setNewOffset, setZIndex, bodyParser, setNewSize } from "../utils/utils";

/* Returns a human-readable relative time string */
const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
};

const NoteCard = ({ note, setNotes, showToast, onUpdate, onDelete }) => {
  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const [size, setSize] = useState(note.size ? JSON.parse(note.size) : { width: 400, height: "auto" });
  const colors = JSON.parse(note.colors);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPinned, setIsPinned] = useState(note.pinned || false);
  const [isMinimized, setIsMinimized] = useState(false);

  const textRef = useRef(null);
  const cardRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    autoGrow();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const autoGrow = () => {
    const el = textRef.current;
    if (!el || isMinimized) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  /* ---------------- DRAG ---------------- */

  const mouseDown = (e) => {
    if (isPinned) return;
    if (e.target.closest(".card-controls")) return;
    if (e.target.closest(".resizer")) return;

    mouse.current = { x: e.clientX, y: e.clientY };
    setZIndex(cardRef.current);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  };

  const mouseMove = (e) => {
    const delta = { x: mouse.current.x - e.clientX, y: mouse.current.y - e.clientY };
    mouse.current = { x: e.clientX, y: e.clientY };
    const newPos = setNewOffset(cardRef.current, delta);
    setPosition(newPos);
    onUpdate?.(note.$id, { position: JSON.stringify(newPos) });
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  };

  /* ---------------- RESIZE ---------------- */

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    mouse.current = { x: e.clientX, y: e.clientY };
    setZIndex(cardRef.current);
    document.addEventListener("mousemove", onResizeMouseMove);
    document.addEventListener("mouseup", onResizeMouseUp);
  };

  const onResizeMouseMove = (e) => {
    const delta = { x: mouse.current.x - e.clientX, y: mouse.current.y - e.clientY };
    mouse.current = { x: e.clientX, y: e.clientY };
    const newSize = setNewSize(cardRef.current, delta);
    setSize(newSize);
    onUpdate?.(note.$id, { size: JSON.stringify(newSize) });
  };

  const onResizeMouseUp = () => {
    document.removeEventListener("mousemove", onResizeMouseMove);
    document.removeEventListener("mouseup", onResizeMouseUp);
  };

  /* ---------------- DELETE ---------------- */

  const handleTrashClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const confirmDeleteNote = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete?.(note.$id);
    }, 280);
  };

  /* ---------------- CONTENT ---------------- */

  const handleInput = (e) => {
    autoGrow();
    onUpdate?.(note.$id, { body: JSON.stringify(e.target.value) });
  };

  return (
    <div
      ref={cardRef}
      className={`card card-appear ${isDeleting ? "card-deleting" : ""} ${isMinimized ? "card-minimized" : ""}`}
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : (size.height === 'auto' ? 'auto' : `${size.height}px`),
        position: "absolute",
      }}
    >
      <div className="card-header" style={{ backgroundColor: colors.colorHeader, cursor: isPinned ? "default" : undefined }} onMouseDown={mouseDown} >
        <div className="card-controls">
          {confirmDelete ? (
            <div className="delete-confirm">
              <span className="delete-confirm-text">Delete?</span>
              <button className="delete-confirm-btn yes" onClick={(e) => { e.stopPropagation(); confirmDeleteNote(e); }}>Yes</button>
              <button className="delete-confirm-btn no" onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}>No</button>
            </div>
          ) : (
            <button className="card-action-btn danger" onClick={handleTrashClick} title="Delete note"><Trash2 size={14} strokeWidth={2} /></button>
          )}
        </div>
        {note.createdAt && <span className="card-timestamp">{timeAgo(note.createdAt)}</span>}
        <div className="card-controls card-actions">
          <button className={`card-action-btn ${isPinned ? "pinned" : ""}`} onClick={(e) => { e.stopPropagation(); onUpdate?.(note.$id, { pinned: !isPinned }); setIsPinned(!isPinned); }} title={isPinned ? "Unpin" : "Pin"}>
            {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} title={isMinimized ? "Expand" : "Minimize"}>
            {isMinimized ? <Plus size={14} /> : <Minus size={14} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="card-body">
          <textarea
            ref={textRef}
            defaultValue={body}
            style={{ color: colors.colorText }}
            onFocus={() => setZIndex(cardRef.current)}
            placeholder="Write a note..."
            onInput={handleInput}
          />
          <div className="resizer" onMouseDown={onResizeMouseDown}>
            <Maximize2 size={12} strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
import { Trash2, Pin, PinOff, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setNewOffset, setZIndex, bodyParser } from "../utils/utils";

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

const NoteCard = ({ note, setNotes, showToast }) => {
  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
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

  // Dismiss confirm-delete when clicking outside the card
  useEffect(() => {
    if (!confirmDelete) return;
    const handler = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setConfirmDelete(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [confirmDelete]);

  const autoGrow = () => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  /* ---------------- DRAG ---------------- */

  const mouseDown = (e) => {
    if (isPinned) return;
    if (e.target.closest(".card-controls")) return;
    mouse.current = { x: e.clientX, y: e.clientY };
    setZIndex(cardRef.current);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  };

  const mouseMove = (e) => {
    const delta = {
      x: mouse.current.x - e.clientX,
      y: mouse.current.y - e.clientY,
    };
    mouse.current = { x: e.clientX, y: e.clientY };
    const newPos = setNewOffset(cardRef.current, delta);
    setPosition(newPos);
    setNotes((prev) =>
      prev.map((n) =>
        n.$id === note.$id ? { ...n, position: JSON.stringify(newPos) } : n
      )
    );
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
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
      setNotes((prev) => prev.filter((n) => n.$id !== note.$id));
      showToast?.("Note deleted");
    }, 280);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  /* ---------------- PIN ---------------- */

  const togglePin = (e) => {
    e.stopPropagation();
    const next = !isPinned;
    setIsPinned(next);
    setNotes((prev) =>
      prev.map((n) => (n.$id === note.$id ? { ...n, pinned: next } : n))
    );
    showToast?.(next ? "Note pinned" : "Note unpinned");
  };

  /* ---------------- MINIMIZE ---------------- */

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  };

  /* ---------------- TEXT ---------------- */

  const updateText = (value) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.$id === note.$id ? { ...n, body: JSON.stringify(value) } : n
      )
    );
  };

  return (
    <div
      ref={cardRef}
      className={`card card-appear ${isDeleting ? "card-deleting" : ""} ${isMinimized ? "card-minimized" : ""
        }`}
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
      }}
    >
      {/* ── Header ── */}
      <div
        className="card-header"
        style={{
          backgroundColor: colors.colorHeader,
          cursor: isPinned ? "default" : undefined,
        }}
        onMouseDown={mouseDown}
      >
        {/* Left: delete */}
        <div className="card-controls">
          {confirmDelete ? (
            <div className="delete-confirm">
              <span className="delete-confirm-text">Delete?</span>
              <button className="delete-confirm-btn yes" onClick={confirmDeleteNote}>
                Yes
              </button>
              <button className="delete-confirm-btn no" onClick={cancelDelete}>
                No
              </button>
            </div>
          ) : (
            <button className="card-action-btn danger" onClick={handleTrashClick} title="Delete note">
              <Trash2 size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Center: timestamp */}
        {note.createdAt && (
          <span className="card-timestamp">{timeAgo(note.createdAt)}</span>
        )}

        {/* Right: pin + minimize */}
        <div className="card-controls card-actions">
          <button
            className={`card-action-btn ${isPinned ? "pinned" : ""}`}
            onClick={togglePin}
            title={isPinned ? "Unpin" : "Pin note"}
          >
            {isPinned
              ? <PinOff size={14} strokeWidth={2} />
              : <Pin size={14} strokeWidth={2} />
            }
          </button>
          <button
            className="card-action-btn"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized
              ? <Plus size={14} strokeWidth={2} />
              : <Minus size={14} strokeWidth={2} />
            }
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {!isMinimized && (
        <div className="card-body">
          <textarea
            ref={textRef}
            defaultValue={body}
            style={{ color: colors.colorText }}
            onFocus={() => setZIndex(cardRef.current)}
            placeholder="Type something..."
            onInput={(e) => {
              autoGrow();
              updateText(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NoteCard;
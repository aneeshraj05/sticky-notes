import React, { useEffect, useRef } from "react";
import Trash from "../icons/Trash";

const NoteCard = ({ note }) => {
  const body = JSON.parse(note.body);
  const position = JSON.parse(note.position);
  const colors = JSON.parse(note.colors);
  const textArearef = useRef(null);
  useEffect(() => {
    autogrow(textArearef);
  }, []);
  const autogrow = (textAreaRef) => {
    const { current } = textAreaRef;
    current.style.height = "auto";
    current.style.height = current.scrollHeight + "px";
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <Trash size="16" />
      </div>
      <div className="card-body">
        <textarea
          ref={textArearef}
          style={{ color: colors.colorText }}
          name=""
          id=""
          defaultValue={body}
          onInput={()=>{autogrow(textArearef)}}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;

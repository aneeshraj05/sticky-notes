import React, { useEffect, useRef, useState } from "react";
import Trash from "../icons/Trash";

const NoteCard = ({ note }) => {
  const body = JSON.parse(note.body);
  const[position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const textArearef = useRef(null);
  let mousePosition = { x: 0, y: 0 };
  const cardRef = useRef(null);
  
  useEffect(() => {
    autogrow(textArearef);
  }, []);
  const autogrow = (textAreaRef) => {
    const { current } = textAreaRef;
    current.style.height = "auto";
    current.style.height = current.scrollHeight + "px";
  };
const mouseDown=(e)=>{
  mousePosition.x=e.clientX;
  mousePosition.y=e.clientY;
  document.addEventListener("mousemove",mousemove);
    document.addEventListener("mouseup",mouseUp);


}
const mouseUp = () => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseUp);
};
const mousemove=(e)=>{
  const mouse={
    x:mousePosition.x-e.clientX,
    y:mousePosition.y-e.clientY
  }
  console.log(mouse)
  mousePosition.x=e.clientX;
  mousePosition.y=e.clientY;
  setPosition({
x:cardRef.current.offsetLeft-mouse.x,
y:cardRef.current.offsetTop-mouse.y
  })
  
}
  return (
    <div
    ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div onMouseDown={mouseDown}
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

import React from "react";

const NewCommentBox = (props) => {
  const handleClick = (e) => {
    e.stopPropagation(); // This stops the click event from propagating
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        left: props.x,
        top: props.y,
      }}
    >
      <textarea id="newComment" placeholder="Add a comment..." />
      <button
        onClick={() => props.addComment(document.getElementById("newComment").value)}
      >
        Submit
      </button>
    </div>
  );
};

export default NewCommentBox;

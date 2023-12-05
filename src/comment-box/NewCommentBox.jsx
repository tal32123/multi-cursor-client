import React from "react";

const NewCommentBox = (props) => {
  return (
    <div
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

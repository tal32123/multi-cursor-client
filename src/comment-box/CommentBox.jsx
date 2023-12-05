import React, { useState } from "react";
import axios from "axios";

const CommentBox = ({ comment, onReplyAdded }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState("");

  const submitReply = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comments/${comment.id}/replies`, {
        comment: reply,
      });
      onReplyAdded(comment.id, response.data);
      setReply("");
      setShowReplyBox(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: comment.x,
        top: comment.y,
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p>{comment.comment}</p>
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
        {showReplyBox && (
          <div style={{ marginTop: "10px" }}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              style={{ width: "100%", minHeight: "50px" }}
            />
            <button onClick={submitReply}>Submit Reply</button>
          </div>
        )}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          {comment.replies.map((reply) => (
            <CommentBox
              key={reply.id}
              comment={reply}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;

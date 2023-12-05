import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentBox from "./comment-box/CommentBox";
import CursorTracker from "./CursorTracker";
import NewCommentBox from "./comment-box/NewCommentBox";

const App = () => {
  const [comments, setComments] = useState([]);
  const [newCommentPosition, setNewCommentPosition] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3001/api/comments");
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNewCommentPosition({ x, y });
  };

  const addComment = async (commentText) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        {
          x: newCommentPosition.x,
          y: newCommentPosition.y,
          comment: commentText,
        }
      );
      setComments([...comments, response.data]);
      setNewCommentPosition(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addReply = (parentId, newReply) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        } else {
          return comment;
        }
      })
    );
  };

  return (
    <div
      onClick={handleCanvasClick}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#282c34",
      }}
    >
      <CursorTracker />

      {comments.map((comment) => (
        <CommentBox
          key={comment.id}
          comment={comment}
          onReplyAdded={addReply}
        />
      ))}
      {newCommentPosition && <NewCommentBox addComment={addComment} x={newCommentPosition.x} y={newCommentPosition.y}/>
      }
    </div> 
  );
};

export default App;

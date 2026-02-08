import React, { useState } from "react";
import { ArrowLeft, Star, Send } from "lucide-react";

/**
 * Reusable DetailedView Component
 * Props:
 * - item: The data object to display
 * - onBack: Function to call when back button is clicked
 * - breadcrumbs: Array of breadcrumb items [{label, path}]
 * - renderContent: Function to render the main content
 * - enableComments: Boolean to show/hide comments section
 * - enableRating: Boolean to show/hide rating section
 */
const DetailedView = ({
  item,
  onBack,
  breadcrumbs = [],
  renderContent,
  enableComments = true,
  enableRating = true,
  type = "project", // project, event, announcement, etc.
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      text: "Great initiative! Looking forward to seeing the results.",
      date: new Date("2024-01-15"),
      rating: 5,
    },
    {
      id: 2,
      author: "Jane Smith",
      text: "This is exactly what we needed. Thank you for the effort!",
      date: new Date("2024-01-14"),
      rating: 4,
    },
  ]);

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Current User", // Replace with actual user
        text: comment,
        date: new Date(),
        rating: rating,
      };
      setComments([newComment, ...comments]);
      setComment("");
      setRating(0);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#F9FAFB",
        zIndex: 1000,
        overflowY: "auto",
        padding: "24px",
      }}
    >
      {/* Header with Breadcrumb and Back Button */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "24px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            marginBottom: "16px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F3F4F6";
            e.currentTarget.style.borderColor = "#D1D5DB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <span
                style={{
                  color:
                    index === breadcrumbs.length - 1 ? "#111827" : "#6B7280",
                  fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                }}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Main Content Card */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Rendered Content */}
        <div style={{ padding: "32px" }}>{renderContent(item)}</div>

        {/* Rating Section */}
        {enableRating && (
          <div
            style={{
              padding: "24px 32px",
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Rate this {type}
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  style={{
                    cursor: "pointer",
                    fill:
                      (hoverRating || rating) >= star
                        ? "#FBBF24"
                        : "transparent",
                    color:
                      (hoverRating || rating) >= star ? "#FBBF24" : "#D1D5DB",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        {enableComments && (
          <div
            style={{
              padding: "32px",
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            <div
              style={{
                marginBottom: "32px",
                padding: "20px",
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
              }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginBottom: "12px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  {enableRating &&
                    rating > 0 &&
                    `Your rating: ${rating} star${rating > 1 ? "s" : ""}`}
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    backgroundColor: comment.trim() ? "#3B82F6" : "#E5E7EB",
                    color: comment.trim() ? "#FFFFFF" : "#9CA3AF",
                    border: "none",
                    borderRadius: "8px",
                    cursor: comment.trim() ? "pointer" : "not-allowed",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  <Send size={16} />
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "16px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>
                      {c.author}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>
                      {c.date.toLocaleDateString()}
                    </span>
                  </div>
                  {c.rating && (
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          style={{
                            fill: star <= c.rating ? "#FBBF24" : "transparent",
                            color: star <= c.rating ? "#FBBF24" : "#D1D5DB",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedView;

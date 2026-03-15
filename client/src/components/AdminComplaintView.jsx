import React, { useState,useEffect } from "react";
import { FaCheckCircle, FaHourglassHalf, FaArrowLeft, FaTimes } from "react-icons/fa";
import api from '../utils/api';

/* ── reusable styles ── */
const thStyle = {
  padding: "12px 14px",
  borderBottom: "2px solid #E5E7EB",
  fontWeight: 600,
  fontSize: "0.85rem",
  textAlign: "left",
  color: "#374151",
  background: "#F9FAFB",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #F3F4F6",
  fontSize: "0.88rem",
  verticalAlign: "middle",
  color: "#374151",
};

const getStatusStyle = (status) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "0.78rem",
  fontWeight: 600,
  background: status === "Resolved" ? "#D1FAE5" : "#FEF3C7",
  color: status === "Resolved" ? "#065F46" : "#92400E",
});

const detailCardStyle = {
  background: "#FFFFFF",
  borderRadius: "12px",
  padding: "20px 24px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  border: "1px solid #E5E7EB",
};

/* ════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════ */
const AdminComplaintView = ({ pending }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaints,setComplaints]=useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState(selected?.status);
const [adminResponse, setAdminResponse] = useState(selected?.adminResponse || '');


  useEffect(() => {
    const fetchComplaints = async () => {

      try {
        setLoading(true);
        const res = await api.get('/data/complaints'); // 👈 your admin endpoint
        setComplaints(res.data.complaints ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

 const handleUpdate = async () => {
  try {
    setUpdatingStatus(true);
    await api.put(`/complaints/${selected._id}`, { 
      status: statusValue,
      adminResponse 
    });
    setSelected((prev) => ({ ...prev, status: statusValue, adminResponse }));
    setComplaints((prev) =>
      prev.map((c) => (c._id === selected._id ? { ...c, status: statusValue, adminResponse } : c))
    );
  } catch (err) {
    console.error(err);
  } finally {
    setUpdatingStatus(false);
  }
};



  /* ── FULL-SCREEN DETAIL VIEW ── */
  if (selected) {
    const c = selected;
    return (
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#F9FAFB",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            zIndex: 10,
            padding: "14px 24px",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              <FaArrowLeft size={13} />
              Back
            </button>

            <button
              onClick={() => setSelected(null)}
              style={{
                padding: "8px",
                background: "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#6B7280",
              }}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>

          {/* Title + status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#0369A1" }}>
              {c.title}
            </h2>
            <span style={getStatusStyle(c.status)}>{c.status}</span>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Submitted by */}
            <div style={detailCardStyle}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Submitted By
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                {c.user?.fullName || "—"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#6B7280" }}>
                {c.user?.email || "—"}
              </p>
            </div>

            {/* Status */}
            <div style={detailCardStyle}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Status
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: c.status === "Resolved" ? "#065F46" : "#92400E" }}>
                {c.status}
              </p>
            </div>

            {/* Attachment */}
            <div style={detailCardStyle}>
              <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Attachment
              </p>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                {c.imageUrl ? "Yes" : "None"}
              </p>
            </div>
          </div>


            <div style={detailCardStyle}>
  <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    Update Complaint
  </p>

  {/* Status dropdown */}
  <select
    value={statusValue}
    onChange={(e) => setStatusValue(e.target.value)}
    style={{
      width: "100%",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #E5E7EB",
      fontSize: "0.9rem",
      fontWeight: 600,
      background: "#fff",
      color: "#111827",
      marginBottom: "12px",
    }}
  >
    <option value="Pending">Pending</option>
    <option value="In Review">In Review</option>
    <option value="Resolved">Resolved</option>
    <option value="Holding">Holding</option>
    <option value="Rejected">Rejected</option>
  </select>

  {/* Admin response textarea */}
  <textarea
    value={adminResponse}
    onChange={(e) => setAdminResponse(e.target.value)}
    placeholder="Write admin response..."
    rows={3}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #E5E7EB",
      fontSize: "0.88rem",
      resize: "vertical",
      marginBottom: "12px",
      boxSizing: "border-box",
    }}
  />

  {/* Submit button */}
  <button
    onClick={handleUpdate}
    disabled={updatingStatus}
    style={{
      padding: "9px 20px",
      backgroundColor: updatingStatus ? "#93C5FD" : "#0369A1",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: updatingStatus ? "not-allowed" : "pointer",
      fontSize: "0.88rem",
      fontWeight: 600,
    }}
  >
    {updatingStatus ? "Updating..." : "Update"}
  </button>
</div>

          {/* Description */}
          <div style={{ ...detailCardStyle, marginBottom: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Description
            </p>
            <p style={{ margin: 0, fontSize: "15px", color: "#374151", lineHeight: "1.75", whiteSpace: "pre-wrap" }}>
              {c.description}
            </p>
          </div>

          {/* Image (if any) */}
          {c.imageUrl && (
            <div style={detailCardStyle}>
              <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Attached Image
              </p>
              <img
                src={c.imageUrl}
                alt="Complaint attachment"
                style={{
                  maxWidth: "340px",
                  width: "100%",
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "1px solid #E5E7EB",
                }}
              />
            </div>
          )}

        </div>
      </div>
    );
  }

  /* ── TABLE VIEW ── */

  return (
    <div style={{ marginTop: "20px" }}>
      {complaints.length === 0 ? (
        <p style={{ color: "#999" }}>No complaints found.</p>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Submitted By</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, index) => (
                <tr
                  key={c._id}
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* # */}
                  <td style={{ ...tdStyle, color: "#9CA3AF", width: "40px" }}>
                    {index + 1}
                  </td>

                  {/* Title */}
                  <td style={{ ...tdStyle, fontWeight: 600, width: "18%" }}>
                    {c.title}
                  </td>

                  {/* User */}
                  <td style={{ ...tdStyle, width: "18%" }}>
                    <span style={{ fontWeight: 500 }}>{c.user?.fullName}</span>
                    <br />
                    <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{c.user?.email}</span>
                  </td>

                  {/* Description (clamped) */}
                  <td style={{ ...tdStyle, width: "30%" }}>
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "#6B7280",
                      }}
                    >
                      {c.description}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ ...tdStyle, width: "10%" }}>
                    <span style={getStatusStyle(c.status)}>{c.status}</span>
                  </td>

                  {/* Image thumbnail */}
                  <td style={{ ...tdStyle, width: "70px" }}>
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt="thumb"
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#D1D5DB", fontSize: "0.8rem" }}>—</span>
                    )}
                  </td>

                  {/* View More */}
                  <td style={{ ...tdStyle, width: "100px", textAlign: "center" }}>
                    <button
                      onClick={() => setSelected(c)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#0369A1",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintView;
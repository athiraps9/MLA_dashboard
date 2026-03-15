import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ViewMoreModal from "../components/ViewMoreModal";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronRight, ArrowLeft, X } from "lucide-react";

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showViewMore, setShowViewMore] = useState(false);

  // ✅ NEW STATE (attendance stats)
  const [attendanceStats, setAttendanceStats] = useState({
    totalRecords: 0,
    verifiedPresent: 0,
    percentage: 0,
  });

  const navigate = useNavigate();

  // ================= FETCH ALL ATTENDANCE =================
  const fetchAllAttendance = async () => {
    try {
      const res = await api.get("/data/public/dashboard");
      setAttendance(res.data.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ATTENDANCE STATS =================
  const fetchAttendanceStats = async () => {
    try {
      const res = await api.get("/data/public/attendance/percentage");
      console.log('attendance ***,res');
      setAttendanceStats(res.data);
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
    fetchAttendanceStats();
  }, []);

  // ================= CALCULATIONS =================
  const totalAbsent =
    attendanceStats.totalRecords - attendanceStats.verifiedPresent;

  // ================= HANDLERS =================
  const handleViewDetails = (attendance) => {
    setSelectedProject(attendance);
    setViewMode("detailed");
  };

  const handleBackToGrid = () => {
    navigate("/user");
  };

  if (loading) return <div>Loading...</div>;

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
      }}
    >
      {/* ================= HEADER (UNCHANGED) ================= */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          zIndex: 10,
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <button
              onClick={handleBackToGrid}
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
                marginBottom: "12px",
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

              </div>

          <button
            style={{
              padding: "8px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: 700,
              color: "#0369A1",
            }}
          >
            All Attendance 
          </h2>
        </div>

        {/* ================= STATS GRID ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {/* All Attendance */}
          <div style={cardStyle}>
            <h4 style={cardTitle}>All Attendance</h4>
            <h1 style={cardNumber}>
              {attendanceStats.totalRecords}
            </h1>
          </div>

          {/* Present */}
          <div style={cardStyle}>
            <h4 style={cardTitle}>Total Present</h4>
            <h1 style={cardNumber}>
              {attendanceStats.verifiedPresent}
            </h1>
          </div>

          {/* Absent */}
          <div style={cardStyle}>
            <h4 style={cardTitle}>Total Absent</h4>
            <h1 style={cardNumber}>{totalAbsent}</h1>
          </div>

          {/* Average */}
          <div style={cardStyle}>
            <h4 style={cardTitle}>Average Attendance</h4>
            <h1 style={cardNumber}>
              {attendanceStats.percentage}%
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= CARD STYLES =================
const cardStyle = {
  background: "#FFFFFF",
  padding: "24px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  transition: "0.2s",
};

const cardTitle = {
  marginBottom: "10px",
  color: "#6B7280",
  fontSize: "16px",
  fontWeight: 600,
};

const cardNumber = {
  margin: 0,
  fontSize: "34px",
  fontWeight: 700,
  color: "#111827",
};

export default AllAttendance;
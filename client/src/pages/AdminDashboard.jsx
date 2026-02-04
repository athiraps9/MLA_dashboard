import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminLandingCMS from "../components/AdminLandingCMS";
import PAManagement from "../components/PAManagement";
import AttendanceTree from "../components/AttendanceTree";
import SimpleCalendar from "../components/SimpleCalendar";
import ScheduleCard from "../components/ScheduleCard";
import Card from "../components/Card";
import Button from "../components/Button";
import { FaPlus } from "react-icons/fa";
import api from "../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("verification");
  const [pending, setPending] = useState({
    projects: [],
    attendance: [],
    complaints: [],
    schemes: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});

  // Attendance & Season State
  const [seasons, setSeasons] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [seasonForm, setSeasonForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [showSeasonForm, setShowSeasonForm] = useState(false);

  // Scheduling State
  const [schedules, setSchedules] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allContent, setAllContent] = useState({
    projects: [],
    schemes: [],
    events: [],
  });
  const [events, setEvents] = useState([]);

  const [showAllEvents, setShowAllEvents] = useState(false);
  const displayedEvents = showAllEvents
    ? allContent.events
    : allContent.events.slice(0, 2);

  // State for pending items

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/pending");
      const projectsRes = await api.get("/admin/projects/pending");
      const schemesRes = await api.get("/admin/schemes/pending");
      console.log(res.data, "im waiting ");
      const eventsRes = await api.get("/admin/events/pending");
      const pendingComplaints = await api.get("/complaints/all");
      setPending({
        projects: projectsRes.data,
        attendance: res.data.attendance,
        schemes: schemesRes.data,
        events: eventsRes.data,
        complaints: pendingComplaints.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagementData = async () => {
    try {
      const projectsRes = await api.get("/admin/projects");
      const schemesRes = await api.get("/admin/schemes");
      const eventsRes = await api.get("/admin/events");
      setAllContent({
        projects: projectsRes.data,
        schemes: schemesRes.data,
        events: eventsRes.data.data || eventsRes.data || [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectAction = async (id, status) => {
    try {
      const remarks = prompt(
        "Enter remarks (optional):",
        status === "approved" ? "Verified by Admin" : "Rejected",
      );
      if (remarks === null) return;
      await api.put(`/admin/project/${id}/verify`, { status, remarks });
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleDeleteProject = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to PERMANENTLY DELETE this project?",
      )
    )
      return;
    try {
      await api.delete(`/admin/project/${id}`);
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const startEdit = (project) => {
    setEditMode(project._id);
    setEditData({ ...project });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/project/${editMode}`, editData);
      setEditMode(null);
      fetchPending();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleSchemeAction = async (id, status) => {
    try {
      const remarks = prompt(
        "Enter remarks (optional):",
        status === "approved" ? "Verified" : "Rejected",
      );
      if (remarks === null) return;
      await api.put(`/admin/scheme/${id}/verify`, { status, remarks });
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleEventAction = async (id, status) => {
    try {
      const remarks = prompt(
        "Enter remarks (optional):",
        status === "approved" ? "Verified" : "Rejected",
      );
      if (remarks === null) return;
      await api.put(`/admin/event/${id}/verify`, { status, remarks });
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleDeleteScheme = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to PERMANENTLY DELETE this scheme?",
      )
    )
      return;
    try {
      await api.delete(`/admin/scheme/${id}`);
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (
      !window.confirm("Are you sure you want to PERMANENTLY DELETE this event?")
    )
      return;
    try {
      await api.delete(`/admin/event/${id}`);
      fetchPending();
      fetchManagementData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const startEditItem = (item, type) => {
    setEditMode({ id: item._id, type });
    setEditData({ ...item });
  };

  const saveEditItem = async () => {
    try {
      const { id, type } = editMode;
      await api.put(`/admin/${type}/${id}`, editData);
      setEditMode(null);
      setEditData({});
      fetchPending();
      fetchManagementData();
      alert("Update successful");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleAttendanceAction = async (id, isVerified) => {
    try {
      await api.put(`/admin/attendance/${id}`, {
        isVerified,
        remarks: isVerified ? "Verified" : "Rejected",
      });
      fetchPending();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const fetchSeasons = async () => {
    try {
      const res = await api.get("/admin/seasons");
      setSeasons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const res = await api.get("/admin/attendance/all");
      setAllAttendance(res.data);
      console.log("all attendance", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/admin/schedules");
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodaySchedules = async () => {
    try {
      const res = await api.get("/admin/schedules/today");
      setTodaySchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSeason = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/season", seasonForm);
      setSeasonForm({ name: "", startDate: "", endDate: "", description: "" });
      setShowSeasonForm(false);
      fetchSeasons();
      alert("Season created successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create season");
    }
  };

  const handleVerifyAttendance = async (id) => {
    try {
      await api.put(`/admin/attendance/${id}/verify`, {
        isVerified: true,
        remarks: "Verified by Admin",
      });
      fetchAllAttendance();
      fetchPending();
      alert("Attendance verified!");
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  const handleRejectAttendance = async (id) => {
    try {
      const remarks = prompt(
        "Enter rejection reason (optional):",
        "Invalid record",
      );
      if (remarks === null) return;
      await api.put(`/admin/attendance/${id}/verify`, {
        isVerified: false,
        remarks: remarks || "Rejected",
      });
      fetchAllAttendance();
      fetchPending();
      alert("Attendance rejected.");
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleApproveSchedule = async (id) => {
    try {
      await api.put(`/admin/schedule/${id}/approve`);
      fetchSchedules();
      fetchTodaySchedules();
      alert("Schedule approved!");
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  const handleCancelSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this schedule?"))
      return;
    try {
      await api.put(`/admin/schedule/${id}/cancel`);
      fetchSchedules();
      fetchTodaySchedules();
      alert("Schedule cancelled!");
    } catch (err) {
      console.error(err);
      alert("Cancellation failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Loading Admin Panel...
      </div>
    );

  const getTabTitle = () => {
    switch (activeTab) {
      case "verification":
        return "Verifications";
      // case 'cms': return 'Landing Page CMS';
      case "complaints":
        return "Complaints";
      case "pa_management":
        return "PA Management";
      case "content_management":
        return "Content Management";
      case "attendance":
        return "Attendance Management";
      case "scheduling":
        return "Schedule Management";
      default:
        return "Dashboard";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F8F9FD",
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
        color: "#131019",
        width: "100%",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "256px",
          height: "100vh",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E0E7FF",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "fixed",
        }}
      >
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#6366F1",
            }}
          ></div>
        </div>
        <nav style={{ flex: 1, marginTop: "16px" }}>
          <ul style={{ listStyle: "none", padding: "0 16px", margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => setActiveTab("verification")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color: activeTab === "verification" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "verification" ? "#EEF2FF" : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "verification" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "verification" ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  verified_user
                </span>
                <span>Verifications</span>
              </a>
            </li>
            {/* <li style={{ marginBottom: '8px' }}>
                            <a
                                onClick={() => setActiveTab('cms')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    color: activeTab === 'cms' ? '#6366F1' : '#64748B',
                                    backgroundColor: activeTab === 'cms' ? '#EEF2FF' : 'transparent',
                                    textDecoration: 'none',
                                    borderRadius: '12px',
                                    fontWeight: activeTab === 'cms' ? 700 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'cms' ? "'FILL' 1" : "'FILL' 0" }}>edit_note</span>
                                <span>Landing Page CMS</span>
                            </a>
                        </li> */}
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => setActiveTab("complaints")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color: activeTab === "complaints" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "complaints" ? "#EEF2FF" : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "complaints" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "complaints" ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  report
                </span>
                <span>Complaints</span>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => setActiveTab("pa_management")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color: activeTab === "pa_management" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "pa_management" ? "#EEF2FF" : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "pa_management" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "pa_management" ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  manage_accounts
                </span>
                <span>PA Management</span>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => {
                  setActiveTab("content_management");
                  fetchManagementData();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color:
                    activeTab === "content_management" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "content_management"
                      ? "#EEF2FF"
                      : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "content_management" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "content_management"
                        ? "'FILL' 1"
                        : "'FILL' 0",
                  }}
                >
                  inventory_2
                </span>
                <span>Manage Content</span>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => {
                  setActiveTab("attendance");
                  fetchSeasons();
                  fetchAllAttendance();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color: activeTab === "attendance" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "attendance" ? "#EEF2FF" : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "attendance" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "attendance" ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  how_to_reg
                </span>
                <span>Attendance</span>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                onClick={() => {
                  setActiveTab("scheduling");
                  fetchSchedules();
                  fetchTodaySchedules();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  color: activeTab === "scheduling" ? "#6366F1" : "#64748B",
                  backgroundColor:
                    activeTab === "scheduling" ? "#EEF2FF" : "transparent",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: activeTab === "scheduling" ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "scheduling" ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  calendar_month
                </span>
                <span>Scheduling</span>
              </a>
            </li>

          </ul>
        </nav>
        <div style={{ padding: "32px", borderTop: "1px solid #F1F5F9" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#64748B",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: 600,
              padding: "0 16px",
              width: "100%",
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: "256px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <header
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #E0E7FF",
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: "24px 40px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#1E1B4B",
                  margin: 0,
                }}
              >
                {getTabTitle()}
              </h1>
              <div
                style={{
                  display: "flex",
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94A3B8",
                }}
              >
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("verification")}
                >
                  Dashboard
                </span>
                <span style={{ margin: "0 8px" }}>/</span>
                <span style={{ color: "#6366F1" }}>{getTabTitle()}</span>
              </div>
            </div>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button style={{ padding: '10px', color: '#64748B', border: 'none', background: 'none', cursor: 'pointer', position: 'relative', borderRadius: '50%' }}>
                                 {/ *  <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span> * /}
                            </button>
                             <div style={{ height: '44px', width: '44px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)', textTransform: 'uppercase' }}>
                                AD
                            </div> 
                        </div> */}
          </div>
        </header>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
          {/* Tab Content */}
          {activeTab === "pa_management" && (
            <div>
              <PAManagement />
            </div>
          )}

          {/* {activeTab === 'cms' && <div><AdminLandingCMS /></div>} */}

          {activeTab === "complaints" && (
            <div>
              <div style={{ display: "grid", gap: "1rem", marginTop: "20px" }}>
                {pending.complaints?.length === 0 ? (
                  <p>No complaints found.</p>
                ) : (
                  pending.complaints?.map((c) => (
                    <div
                      key={c._id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4 style={{ margin: 0 }}>{c.title}</h4>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            background:
                              c.status === "Resolved" ? "#d4edda" : "#fff3cd",
                            color:
                              c.status === "Resolved" ? "#155724" : "#856404",
                          }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        By: {c.user?.fullName} ({c.user?.email})
                      </p>
                      {c.imageUrl && (
                        <img
                          src={`${SERVER_URL}${c.imageUrl}`}
                          alt="Complaint"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      <p>{c.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "verification" && (
            <>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                Pending Projects
              </h2>
              {pending.projects.length === 0 ? (
                <p>No pending projects.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(400px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {pending.projects.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h3>{p.title}</h3>
                      {p.imageUrl && (
                        <img
                          src={`${SERVER_URL}${p.imageUrl}`}
                          alt={p.title}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "15px",
                          }}
                        />
                      )}
                      <p>
                        <strong>MLA:</strong> {p.mla?.fullName}
                      </p>
                      <p>
                        <strong>Desc:</strong> {p.description}
                      </p>
                      <p>
                        <strong>Budget:</strong> ₹
                        {p.fundsAllocated?.toLocaleString()}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <button
                          onClick={() => handleProjectAction(p._id, "approved")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#22C55E",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProjectAction(p._id, "rejected")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => startEditItem(p, "project")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#6366F1",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#475569",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginTop: "40px",
                  marginBottom: "20px",
                }}
              >
                Pending Schemes
              </h2>
              {pending.schemes.length === 0 ? (
                <p>No pending schemes.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(400px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {pending.schemes.map((s) => (
                    <div
                      key={s._id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h3>{s.category}</h3>
                      {s.imageUrl && (
                        <img
                          src={`${SERVER_URL}${s.imageUrl}`}
                          alt={s.category}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "15px",
                          }}
                        />
                      )}
                      <p>
                        <strong>PA:</strong> {s.pa?.fullName}
                      </p>
                      <p>
                        <strong>Desc:</strong> {s.description}
                      </p>
                      <p>
                        <strong>Location:</strong> {s.location}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <button
                          onClick={() => handleSchemeAction(s._id, "approved")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#22C55E",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSchemeAction(s._id, "rejected")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => startEditItem(s, "scheme")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#6366F1",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteScheme(s._id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#475569",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginTop: "40px",
                  marginBottom: "20px",
                }}
              >
                Pending Events
              </h2>
              {pending.events.length === 0 ? (
                <p>No pending events.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(400px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {pending.events.map((ev) => (
                    <div
                      key={ev._id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h3>{ev.category}</h3>
                      {/* {ev.imageUrl && <img src={`${SERVER_URL}${ev.imageUrl}`} alt={ev.category} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />} */}
                      <p>
                        <strong>PA:</strong> {ev.pa?.fullName}
                      </p>
                      <p>
                        <strong>Desc:</strong> {ev.description}
                      </p>
                      <p>
                        <strong>Location:</strong> {ev.location}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >
                        <button
                          onClick={() => handleEventAction(ev._id, "approved")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#22C55E",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleEventAction(ev._id, "rejected")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#EF4444",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => startEditItem(ev, "event")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#6366F1",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev._id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#475569",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginTop: "40px",
                  marginBottom: "20px",
                }}
              >
                Pending Attendance
              </h2>
              <div>
                {pending.attendance.length === 0 ? (
                  <p>No pending attendance records.</p>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#6366F1",
                            color: "white",
                            textAlign: "left",
                          }}
                        >
                          <th style={{ padding: "16px" }}>Season</th>
                          <th style={{ padding: "16px" }}>Date</th>

                          <th style={{ padding: "16px" }}>Status</th>
                          <th style={{ padding: "16px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pending.attendance.map((a) => (
                          <tr
                            key={a._id}
                            style={{ borderBottom: "1px solid #F1F5F9" }}
                          >
                            <td style={{ padding: "16px" }}>
                              {a.season.name || "N/A"}
                            </td>
                            <td style={{ padding: "16px" }}>
                              {new Date(a.date).toLocaleDateString()}
                            </td>

                            <td style={{ padding: "16px" }}>
                              {a.present ? "Present" : "Absent"}
                            </td>
                            <td style={{ padding: "16px" }}>
                              <button
                                style={{
                                  marginRight: "8px",
                                  padding: "6px 12px",
                                  backgroundColor: "#22C55E",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              >
                                Verify
                              </button>
                              <button
                                style={{
                                  padding: "6px 12px",
                                  backgroundColor: "#EF4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div>
              {/* Season Management Section */}
              <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#1E1B4B",
                      margin: 0,
                    }}
                  >
                    Seasons
                  </h3>
                  <button
                    onClick={() => setShowSeasonForm(!showSeasonForm)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      backgroundColor: "#6366F1",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      add
                    </span>
                    {showSeasonForm ? "Cancel" : "Create Season"}
                  </button>
                </div>

                {showSeasonForm && (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      marginBottom: "24px",
                      maxWidth: "600px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 20px 0", fontWeight: 700 }}>
                      Create New Season
                    </h4>
                    <form
                      onSubmit={handleCreateSeason}
                      style={{
                        display: "grid",
                        gap: "15px",
                        maxWidth: "600px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          Season Name
                        </label>
                        <input
                          value={seasonForm.name}
                          onChange={(e) =>
                            setSeasonForm({
                              ...seasonForm,
                              name: e.target.value,
                            })
                          }
                          required
                          placeholder="e.g., Winter Session 2026"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "15px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={seasonForm.startDate}
                            onChange={(e) =>
                              setSeasonForm({
                                ...seasonForm,
                                startDate: e.target.value,
                              })
                            }
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #E2E8F0",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "5px",
                              fontWeight: 600,
                              color: "#475569",
                            }}
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            value={seasonForm.endDate}
                            onChange={(e) =>
                              setSeasonForm({
                                ...seasonForm,
                                endDate: e.target.value,
                              })
                            }
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #E2E8F0",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          Description
                        </label>
                        <textarea
                          value={seasonForm.description}
                          onChange={(e) =>
                            setSeasonForm({
                              ...seasonForm,
                              description: e.target.value,
                            })
                          }
                          rows="3"
                          placeholder="Optional description"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            resize: "vertical",
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: "12px 24px",
                          backgroundColor: "#6366F1",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Create Season
                      </button>
                    </form>
                  </div>
                )}

                {/* List of Seasons */}
                <div>
                  {seasons.length === 0 ? (
                    <p>No season records found.</p>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#6366F1",
                              color: "white",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "16px" }}>Season</th>
                            <th style={{ padding: "16px" }}>Start Date</th>
                            <th style={{ padding: "16px" }}>End Date</th>
                            <th style={{ padding: "16px" }}>Description</th>
                            <th style={{ padding: "16px" }}>Status</th>
                            <th style={{ padding: "16px" }}>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {seasons.map((season) => (
                            <tr
                              key={season._id}
                              style={{ borderBottom: "1px solid #F1F5F9" }}
                            >
                              <td style={{ padding: "16px", fontWeight: 600 }}>
                                {season.name}
                              </td>

                              <td style={{ padding: "16px" }}>
                                {new Date(
                                  season.startDate,
                                ).toLocaleDateString()}
                              </td>

                              <td style={{ padding: "16px" }}>
                                {new Date(season.endDate).toLocaleDateString()}
                              </td>

                              <td style={{ padding: "16px" }}>
                                {season.description || "-"}
                              </td>

                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    backgroundColor: season.isActive
                                      ? "#d4edda"
                                      : "#f8d7da",
                                    color: season.isActive
                                      ? "#155724"
                                      : "#721c24",
                                  }}
                                >
                                  {season.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>

                              <td style={{ padding: "16px" }}>
                                <button
                                  style={{
                                    marginRight: "8px",
                                    padding: "6px 12px",
                                    backgroundColor: "#22C55E",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#EF4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* All Attendance Records */}
              <h3
                style={{
                  marginTop: "40px",
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1E1B4B",
                }}
              >
                All Attendance Records
              </h3>
              <div>
                {allAttendance.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#64748B",
                      padding: "20px",
                    }}
                  >
                    No attendance records found.
                  </p>
                ) : (
                  <div>
                    {allAttendance.length === 0 ? (
                      <p>No season records found.</p>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "#4169E1",
                                color: "white",
                                textAlign: "left",
                              }}
                            >
                              <th style={{ padding: "16px" }}>Session</th>
                              <th style={{ padding: "16px" }}> Date</th>
                              <th style={{ padding: "16px" }}>Status</th>
                              <th style={{ padding: "16px" }}>Remarks</th>
                            </tr>
                          </thead>

                          <tbody>
                            {allAttendance.map((attendance) => (
                              <tr
                                key={attendance._id}
                                style={{ borderBottom: "2px solid #F1F5F9" }}
                              >
                                <td style={{ padding: "16px" }}>
                                  {attendance.season.name}
                                </td>
                                <td style={{ padding: "16px" }}>
                                  {new Date(
                                    attendance.date,
                                  ).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "16px" }}>
                                  {attendance.status}
                                </td>
                                <td style={{ padding: "16px" }}>
                                  {attendance.remarks}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scheduling Tab */}
          {activeTab === "scheduling" && (
            <div>
              {/* Today's Schedules */}
              <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#1E1B4B",
                      margin: 0,
                    }}
                  >
                    Today's Schedule
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#EEF2FF",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#4F46E5",
                    }}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {todaySchedules.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      padding: "60px 20px",
                      textAlign: "center",
                      border: "2px dashed #E2E8F0",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      📅
                    </div>
                    <p
                      style={{ color: "#64748B", fontSize: "16px", margin: 0 }}
                    >
                      No schedules for today.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(350px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {todaySchedules.map((schedule) => (
                      <div
                        key={schedule._id}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          border: "1px solid #E2E8F0",
                          transition: "all 0.2s",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Status indicator bar */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "4px",
                            height: "100%",
                            backgroundColor:
                              schedule.status === "completed"
                                ? "#10B981"
                                : schedule.status === "pending"
                                  ? "#F59E0B"
                                  : "#6366F1",
                          }}
                        />

                        <div style={{ marginLeft: "12px" }}>
                          {/* Time badge */}
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              backgroundColor: "#F1F5F9",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            <span
                              style={{ fontSize: "18px", marginRight: "8px" }}
                            >
                              🕐
                            </span>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#475569",
                              }}
                            >
                              {schedule.time || "10:00 AM"}
                            </span>
                          </div>

                          {/* Title */}
                          <h4
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#1E293B",
                              marginBottom: "8px",
                              marginTop: 0,
                            }}
                          >
                            {schedule.title || "Schedule Item"}
                          </h4>

                          {/* Description */}
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#64748B",
                              marginBottom: "16px",
                              lineHeight: "1.5",
                            }}
                          >
                            {schedule.description || "No description available"}
                          </p>

                          {/* Footer with status and action */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingTop: "16px",
                              borderTop: "1px solid #F1F5F9",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color:
                                  schedule.status === "completed"
                                    ? "#10B981"
                                    : schedule.status === "pending"
                                      ? "#F59E0B"
                                      : "#6366F1",
                                backgroundColor:
                                  schedule.status === "completed"
                                    ? "#D1FAE5"
                                    : schedule.status === "pending"
                                      ? "#FEF3C7"
                                      : "#E0E7FF",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                textTransform: "capitalize",
                              }}
                            >
                              {schedule.status || "scheduled"}
                            </span>

                            <button
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#6366F1",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px 8px",
                              }}
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weekly Schedule */}
              <div style={{ marginTop: "40px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#1E1B4B",
                    marginBottom: "20px",
                  }}
                >
                  This Week's Schedule
                </h3>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day, index) => (
                          <th
                            key={index}
                            style={{
                              backgroundColor: "#F8FAFC",
                              padding: "16px 12px",
                              textAlign: "left",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#475569",
                              borderBottom: "2px solid #E2E8F0",
                              minWidth: "140px",
                            }}
                          >
                            <div>{day}</div>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#94A3B8",
                                marginTop: "4px",
                              }}
                            >
                              {/* You can add dates here */}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day, index) => {
                          // Filter schedules for this day (you'll need to add day filtering logic)
                          const daySchedules = []; // Replace with actual filtered schedules

                          return (
                            <td
                              key={index}
                              style={{
                                padding: "12px",
                                verticalAlign: "top",
                                borderRight:
                                  index < 6 ? "1px solid #F1F5F9" : "none",
                                backgroundColor:
                                  index === new Date().getDay() - 1
                                    ? "#FEFCE8"
                                    : "transparent",
                              }}
                            >
                              {daySchedules.length === 0 ? (
                                <div
                                  style={{
                                    color: "#CBD5E1",
                                    fontSize: "13px",
                                    textAlign: "center",
                                    padding: "20px 8px",
                                  }}
                                >
                                  No events
                                </div>
                              ) : (
                                daySchedules.map((schedule, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      backgroundColor: "#F8FAFC",
                                      borderLeft: "3px solid #6366F1",
                                      padding: "10px",
                                      marginBottom: "8px",
                                      borderRadius: "6px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        color: "#1E293B",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {schedule.time}
                                    </div>
                                    <div style={{ color: "#64748B" }}>
                                      {schedule.title}
                                    </div>
                                  </div>
                                ))
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KPI Cards for Schedule Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #6366F1",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#64748B",
                      marginBottom: "8px",
                    }}
                  >
                    Total Schedules
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1E293B",
                    }}
                  >
                    {todaySchedules.length}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #10B981",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#64748B",
                      marginBottom: "8px",
                    }}
                  >
                    Completed
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1E293B",
                    }}
                  >
                    {
                      todaySchedules.filter((s) => s.status === "completed")
                        .length
                    }
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #F59E0B",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#64748B",
                      marginBottom: "8px",
                    }}
                  >
                    Pending
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1E293B",
                    }}
                  >
                    {
                      todaySchedules.filter((s) => s.status === "pending")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "content_management" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "24px",
                }}
              >
                All Projects
              </h2>
              {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                                {allContent.projects.map(p => (
                                    <div key={p._id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{p.title}</h3>
                                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: p.status === 'approved' ? '#DCFCE7' : p.status === 'pending' ? '#FEF9C3' : '#FEE2E2', color: p.status === 'approved' ? '#166534' : p.status === 'pending' ? '#854D0E' : '#991B1B' }}>
                                                {p.status}
                                            </span>
                                        </div>
                                        {p.imageUrl && <img src={`${SERVER_URL}${p.imageUrl}`} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />}
                                        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>{p.description}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEditItem(p, 'project')} style={{ flex: 1, padding: '10px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                            <button onClick={() => handleDeleteProject(p._id)} style={{ flex: 1, padding: '10px', backgroundColor: '#F1F5F9', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div> */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "16px",
                }}
              >
                {(allContent?.projects || []).length === 0 ? (
                  <div
                    style={{
                      background: "#fff",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    No projects found
                  </div>
                ) : (
                  [...allContent.projects]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    ) // recent first
                    .map((project) => (
                      <div
                        key={project._id}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {/* Title */}
                        <h4 style={{ margin: 0 }}>{project.title}</h4>

                        {/* Description */}
                        <p
                          style={{
                            margin: 0,
                            color: "#6B7280",
                            fontSize: "0.9rem",
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Allocated */}
                        <div style={{ fontWeight: 600 }}>
                          ₹{(project.fundsAllocated || 0).toLocaleString()}
                        </div>

                        {/* Status */}
                        <span
                          style={{
                            alignSelf: "flex-start",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            backgroundColor:
                              project.status === "approved"
                                ? "#DCFCE7"
                                : project.status === "pending"
                                  ? "#FEF3C7"
                                  : "#FEE2E2",
                            color:
                              project.status === "approved"
                                ? "#166534"
                                : project.status === "pending"
                                  ? "#92400E"
                                  : "#991B1B",
                          }}
                        >
                          {project.status}
                        </span>

                        {/* Dates */}
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#6B7280",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            Start:{" "}
                            {project.startDate
                              ? new Date(project.startDate).toLocaleDateString()
                              : "-"}
                          </span>

                          <span>
                            Created:{" "}
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "24px",
                }}
              >
                All Events
              </h2>
              {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                                {allContent.schemes.map(s => (
                                    <div key={s._id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{s.category}</h3>
                                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: s.status === 'approved' ? '#DCFCE7' : s.status === 'pending' ? '#FEF9C3' : '#FEE2E2', color: s.status === 'approved' ? '#166534' : s.status === 'pending' ? '#854D0E' : '#991B1B' }}>
                                                {s.status}
                                            </span>
                                        </div>
                                        {s.imageUrl && <img src={`${SERVER_URL}${s.imageUrl}`} alt={s.category} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />}
                                        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>{s.description}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEditItem(s, 'scheme')} style={{ flex: 1, padding: '10px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                            <button onClick={() => handleDeleteScheme(s._id)} style={{ flex: 1, padding: '10px', backgroundColor: '#F1F5F9', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                {displayedEvents.map((ev) => (
                  <div
                    key={ev._id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {/* Event Image */}
                    {ev.image && (
                      <div
                        style={{
                          width: "100%",
                          height: "200px",
                          overflow: "hidden",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        <img
                          src={ev.image}
                          alt={ev.category}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* Event Details */}
                    <div style={{ padding: "1rem" }}>
                      <h4
                        style={{
                          margin: "0 0 0.75rem 0",
                          fontSize: "1.25rem",
                          color: "#333",
                        }}
                      >
                        {ev.category}
                      </h4>

                      <p
                        style={{
                          margin: "0.5rem 0",
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        📅 {new Date(ev.date).toLocaleDateString()}
                      </p>

                      <p
                        style={{
                          margin: "0.5rem 0",
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        ⏰ {ev.time}
                      </p>

                      <p
                        style={{
                          margin: "0.5rem 0",
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        📍 {ev.location}
                      </p>

                      {ev.description && (
                        <p
                          style={{
                            margin: "0.75rem 0 0 0",
                            color: "#555",
                            fontSize: "0.85rem",
                            lineHeight: "1.4",
                          }}
                        >
                          {ev.description.length > 100
                            ? `${ev.description.substring(0, 100)}...`
                            : ev.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {editMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "500px",
              maxWidth: "90%",
            }}
          >
            <h2>Edit {editMode.type}</h2>
            {editMode.type === "project" ? (
              <div style={{ display: "grid", gap: "15px" }}>
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="Title"
                />
                <textarea
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Description"
                  rows="4"
                />
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  type="number"
                  value={editData.fundsAllocated}
                  onChange={(e) =>
                    setEditData({ ...editData, fundsAllocated: e.target.value })
                  }
                  placeholder="Budget"
                />
              </div>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                  placeholder="Category"
                />
                <textarea
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Description"
                  rows="4"
                />
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  placeholder="Location"
                />
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={saveEditItem}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#6366F1",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(null)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#eee",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

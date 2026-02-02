import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import api from "../utils/api";
import Card from "../components/Card";
import ScheduleCard from "../components/ScheduleCard";
import { Link } from "react-router-dom";
import {
  FaProjectDiagram,
  FaRupeeSign,
  FaUsers,
  FaClipboardList,
  FaArrowRight,
  FaBox,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";



ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

const PublicDashboard = () => {
  const [data, setData] = useState({ projects: [], attendance: [],events:[] });
  const [loading, setLoading] = useState(true);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);

const [showAllEvents, setShowAllEvents] = useState(false);


const displayedEvents = showAllEvents ? events : events.slice(0, 2);


  




  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/data/public/dashboard");
        setData(res.data);
        console.log(res.data, "fetching dashboard data");

        // Fetch attendance percentage
        const attendanceRes = await api.get(
          "/data/public/attendance/percentage",
        );
        setAttendancePercentage(attendanceRes.data.percentage);

        // Fetch approved schedules
        const schedulesRes = await api.get("/data/schedules");
        setSchedules(schedulesRes.data);

        //Fetch all events 
     
      const events = await api.get("data/events");
       setEvents(events.data);
       console.log("events data fetching purpose",events.data);

      } catch (err) {
        console.error("Error fetching public data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
  }, []);












  if (loading)
    return (
      <div className="text-center section-padding">Loading Dashboard...</div>
    );

  const totalFunds = data.projects.reduce(
    (acc, p) => acc + p.fundsAllocated,
    0,
  );
  const utilizedFunds = data.projects.reduce(
    (acc, p) => acc + p.fundsUtilized,
    0,
  );
  const utilizationPercentage =
    totalFunds > 0 ? ((utilizedFunds / totalFunds) * 100).toFixed(1) : 0;

  // Recent Items
  const recentProjects = [...data.projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Charts
  const pieData = {
    labels: ["Utilized", "Remaining"],
    datasets: [
      {
        data: [utilizedFunds, totalFunds - utilizedFunds],
        backgroundColor: ["#28a745", "#e9ecef"],
        borderColor: ["#28a745", "#dee2e6"],
        borderWidth: 1,
      },
    ],
  };

  // MLA Funds Bar Chart
  const mlaFunds = {};
  data.projects.forEach((p) => {
    const name = p.mla?.fullName || "Unknown";
    if (!mlaFunds[name]) mlaFunds[name] = 0;
    mlaFunds[name] += p.fundsAllocated;
  });

  const barData = {
    labels: Object.keys(mlaFunds),
    datasets: [
      {
        label: "Funds Allocated (INR)",
        data: Object.values(mlaFunds),
        backgroundColor: "#0056b3",
      },
    ],
  };

  const KPICard = ({ title, value, subtext, icon: Icon, color }) => (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1.5rem",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          marginRight: "1.5rem",
          padding: "15px",
          borderRadius: "50%",
          background: `${color}15`,
          color: color,
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            marginBottom: "5px",
            fontWeight: "500",
          }}
        >
          {title}
        </p>
        <h3
          style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-dark)" }}
        >
          {value}
        </h3>
        {subtext && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--success)",
              marginTop: "5px",
            }}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );

  const styles = {
    hero: {
      background: "linear-gradient(135deg, #023e8a 0%, #0077b6 100%)",
      color: "white",
      padding: "140px 0 120px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
    },
    heroTitle: {
      fontSize: "4rem",
      fontWeight: "900",
      marginBottom: "20px",
      lineHeight: "1.2",
      textShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    heroTagline: {
      fontSize: "1.6rem",
      fontWeight: "300",
      marginBottom: "50px",
      opacity: "0.95",
      maxWidth: "700px",
      margin: "0 auto 50px",
    },
    btnRound: {
      borderRadius: "50px",
      padding: "18px 45px",
      border: "none",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "700",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    },
    section: {
      padding: "100px 0",
      position: "relative",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "40px 30px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      textAlign: "center",
      height: "100%",
      transition: "transform 0.3s ease",
      border: "1px solid rgba(0,0,0,0.05)",
    },
    stepCircle: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0077b6, #00b4d8)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      margin: "0 auto 25px",
      fontWeight: "bold",
      boxShadow: "0 10px 20px rgba(0,180,216,0.3)",
    },
    statsRow: {
      display: "flex",
      justifyContent: "center",
      gap: "50px",
      marginTop: "-80px",
      position: "relative",
      zIndex: 10,
      flexWrap: "wrap",
    },
    statCard: {
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      textAlign: "center",
      minWidth: "200px",
    },
  };

  const thStyle = {
  padding: '12px',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#374151'
};

const tdStyle = {
  padding: '12px',
  fontSize: '0.85rem',
  color: '#111827'
};



  return (
    <div>
      {/* Hero Section */}

      <header style={styles.hero}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h1 style={styles.heroTitle}>Transforming Governance</h1>
          <p style={styles.heroTagline}>
            Experience the future of citizen-centric administration. <br />
            Professional. Transparent. Efficient.
          </p>
        </div>
      </header>

      {/* Stats Overlay */}
      {/* <div className="container" style={styles.statsRow}>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>{data?.stats?.averageAttendance || 0}%</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Attendance</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>₹{(data?.stats?.totalUtilized / 10000000).toFixed(1)}Cr+</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Funds Utilized</p>
                </div>
                <div style={styles.statCard}>
                    <h2 style={{ fontSize: '2.5rem', color: '#0077b6', margin: 0 }}>{data?.stats?.totalProjects || 0}+</h2>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>Projects Completed</p>
                </div>
            </div> */}

      <div style={{ margin: "2px 2px 2rem ", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>{t("Public Insight Dashboard")}</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Overview of MLA activities and development projects.
        </p>
      </div>

      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <KPICard
            title="Total Projects"
            value={data.projects.length}
            subtext={`${recentProjects.length} new this month`}
            icon={FaProjectDiagram}
            color="#007bff"
          />
          <KPICard
            title="Total Schemes"
            value={`0`}
            subtext={`${utilizationPercentage}% Utilization`}
            icon={FaBox}
            color="#28a745"
          />
          {/* <KPICard title="Total Schemes" value={`₹${(utilizedFunds / 100000).toFixed(1)}`} subtext={`${utilizationPercentage}% Utilization`} icon={FaRupeeSign} color="#28a745" /> */}

          <KPICard
            title="Events"
            value={Object.keys(mlaFunds).length}
            icon={FaUsers}
            color="#fd7e14"
          />
          <KPICard
            title="Avg. Sabha Attendance"
            value={`${attendancePercentage}%`}
            subtext="Verified Records"
            icon={FaClipboardList}
            color="#6f42c1"
          />
        </div>

        {/* Quick Links */}
        {/* <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Link to="/mla-directory" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>View All MLAs <FaArrowRight size={12} /></Link>
                <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>My Profile <FaArrowRight size={12} /></Link>
            </div> */}

        {/* Charts Section */}
        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Fund Utilization Status</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieData} />
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Allocation by MLA</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div> */}

        {/* Recent Projects */}
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          {t("Recent Projects")}
        </h2>
        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {recentProjects.map(project => (
                    <div className="card" key={project._id} title={project.title}>
                        <h4 style={{ marginBottom: '10px' }}>{project.title}</h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{project.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                            <span><strong>₹{project.fundsAllocated.toLocaleString()}</strong> allocated</span>
                            <span style={{ color: 'var(--success)' }}>Approved</span>
                        </div>
                         <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            MLA: {project.mla?.fullName}
                        </div> 
                    </div>
                ))}
            </div>  */}

        {/* <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#F5F7FF", textAlign: "left" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Allocated (₹)</th>
              <th style={thStyle}>Utilized (₹)</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Start Date</th>
              <th style={thStyle}>End Date</th>
              <th style={thStyle}>Created</th>
            </tr>
          </thead>

          <tbody>
            {(data?.projects || []).length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ padding: "1rem", textAlign: "center" }}
                >
                  No projects found
                </td>
              </tr>
            ) : (
              data.projects.map((project) => (
                <tr
                  key={project._id}
                  style={{ borderBottom: "1px solid #E5E7EB" }}
                >
                  <td style={tdStyle}>{project.title}</td>
                  <td style={tdStyle}>{project.description}</td>
                  <td style={tdStyle}>
                    ₹{(project.fundsAllocated || 0).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    ₹{(project.fundsUtilized || 0).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
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
                  </td>
                  <td style={tdStyle}>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={tdStyle}>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={tdStyle}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table> */}

        {/* PROJECT CARD VIEW */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "16px",
  }}
>
  {(data?.projects || []).length === 0 ? (
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
    [...data.projects]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // recent first
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
          <p style={{ margin: 0, color: "#6B7280", fontSize: "0.9rem" }}>
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


 <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Upcoming Events</h2>
    
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
      gap: "1.5rem",
      marginBottom: "1rem"
    }}>
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
            cursor: "pointer"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          {/* Event Image */}
          {ev.image && (
            <div style={{ 
              width: "100%", 
              height: "200px", 
              overflow: "hidden",
              backgroundColor: "#f0f0f0"
            }}>
              <img 
                src={ev.image} 
                alt={ev.category}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover"
                }}
              />
            </div>
          )}
          
          {/* Event Details */}
          <div style={{ padding: "1rem" }}>
            <h4 style={{ 
              margin: "0 0 0.75rem 0",
              fontSize: "1.25rem",
              color: "#333"
            }}>
              {ev.category}
            </h4>
            
            <p style={{ 
              margin: "0.5rem 0",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              📅 {new Date(ev.date).toLocaleDateString()}
            </p>
            
            <p style={{ 
              margin: "0.5rem 0",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              ⏰ {ev.time}
            </p>
            
            <p style={{ 
              margin: "0.5rem 0",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              📍 {ev.location}
            </p>
            
            {ev.description && (
              <p style={{ 
                margin: "0.75rem 0 0 0",
                color: "#555",
                fontSize: "0.85rem",
                lineHeight: "1.4"
              }}>
                {ev.description.length > 100 
                  ? `${ev.description.substring(0, 100)}...` 
                  : ev.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* View More Button */}
    {events.length > 1 && (
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={() => setShowAllEvents(!showAllEvents)}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          {showAllEvents ? "Show Less" : `View More`}
        </button>
      </div>
    )}






        {/* Approved Schedules */}
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          Approved Schedules
        </h2>
        {schedules.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "2rem",
            }}
          >
            No approved schedules available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {schedules.map((schedule) => (
              <ScheduleCard key={schedule._id} schedule={schedule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};





export default PublicDashboard;

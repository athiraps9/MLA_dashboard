import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ViewMoreModal from "../components/ViewMoreModal";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronRight } from "lucide-react";



const AllEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [selectedProject, setSelectedProject] = useState(null);
    const [showViewMore, setShowViewMore] = useState(false);
    const navigate = useNavigate();



  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/data/public/dashboard");
      
      // assuming events come inside res.data.events
      setEvents(res.data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);


   // Handlers
  const handleViewDetails = (events) => {
    setSelectedProject(events);
    setViewMode("detailed");
  };

  
const handleBackToGrid = () => {
  navigate("/user");
};

   const renderProjectCard = (event, showViewButton = true) => (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        transition: "all 0.2s",
        cursor: showViewButton ? "default" : "pointer",
        height: "520px", // Fixed height
        overflow: "hidden", // Hide overflow content
      }}
      onClick={() => !showViewButton && handleViewDetails(event)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Title */}

      <img src={event.imageUrl}/>
      
      <h4
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 600,
          color: "#111827",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: "1.4",
          height: "100px", // Fixed height for 4 lines (18px * 1.4 * 4 = ~100px)
        }}
      >
        {event.title}
      </h4>

      {/* Description */}
      <p
        style={{
          margin: 0,
          color: "#6B7280",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          height: "69px", // Fixed height for 3 lines (14.4px * 1.6 * 3 = ~69px)
        }}
      >
        {event.description}
      </p>
      {/* Allocated */}
      {/* <div style={{ fontWeight: 600, fontSize: "20px", color: "#111827" }}>
        ₹{(event.fundsAllocated || 0).toLocaleString()}
      </div> */}

      {/* Status */}
      {/* <span
        style={{
          alignSelf: "flex-start",
          padding: "4px 10px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: 500,
          backgroundColor:
            event.status === "approved"
              ? "#DCFCE7"
              : event.status === "pending"
                ? "#FEF3C7"
                : "#FEE2E2",
          color:
            event.status === "approved"
              ? "#166534"
              : event.status === "pending"
                ? "#92400E"
                : "#991B1B",
        }}
      >
        {event.status}
      </span> */}

      {/* Dates */}
     

      {/* View Details Button */}
      {showViewButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(event);
          }}
          style={{
            marginTop: "8px",
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3B82F6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Eye size={16} />
          View Details
        </button>
      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <ViewMoreModal
      items={events}
      isOpen={true}   // since this is a full page, keep it open
      title="All Events"
       renderCard={(event) => renderProjectCard(event, false)}
          onClose={handleBackToGrid}
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "All Events", path: "/events" },
      ]}
    />
  );
};

export default AllEvents;

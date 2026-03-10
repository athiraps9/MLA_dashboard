import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import ProjectCardSection from "../components/ProjectCardSection";
import ViewMoreModal2 from "../components/ViewMoreModal2";






const AllProjects = () => {

  const [projects, setProjects] = useState([]);
  const [d,setD]=useState([]);
  const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [selectedProject, setSelectedProject] = useState(null);
    const [showViewMore, setShowViewMore] = useState(false);
    const navigate = useNavigate();



  const fetchAllProjects = async () => {
    try {
      const res = await api.get("/data/public/dashboard");
      
      // assuming projects come inside res.data.projects
      setD(res.data);

      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);


   // Handlers
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setViewMode("detailed");
  };

  
const handleBackToGrid = () => {
  navigate("/user");
};

   const renderProjectCard = (project, showViewButton = true) => (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "all 0.2s",
        cursor: showViewButton ? "default" : "pointer",
        height: "320px", // Fixed height
        overflow: "hidden", // Hide overflow content
      }}
      onClick={() => !showViewButton && handleViewDetails(project)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
     
            

            
        <a href="/user/details"> Show More
        
         <div>
          <ProjectCardSection data={d} />
        </div>
        
        </a>
          
    </div>
  );

  if (loading) return <div>Loading...</div>;

  
  return (
    <>
    <ViewMoreModal2
      items={projects}
      isOpen={true}   // since this is a full page, keep it open
      title="All Projects"
       renderCard={() => <ProjectCardSection 
       data={d}/> }
          onClose={handleBackToGrid}
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "All Projects", path: "/projects" },
      ]}
    />
    
    </>
    
  );
};

export default AllProjects;

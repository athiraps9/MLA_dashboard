import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { SERVER_URL } from "../utils/api";
import { FaUserCircle, FaSave, FaEdit } from "react-icons/fa";
import AvatarUpload from "../components/AvatarUpload";
import { useLocation } from 'react-router-dom';
import Button from "../components/Button";
import Card from '../components/Card';
import '../styles/variables.css';
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {},
  );
  const [activeTab, setActiveTab] = useState("details");
  const [complaints, setComplaints] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [Schemes, setSchemes] = useState([]);
  const [Events, setEvents] = useState([]);
  const [editName, setEditName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [myComplaints, setMyComplaints] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (activeTab === "complaints") {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      setPreviewUrl(URL.createObjectURL(file));

      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = { ...user, ...res.data };
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...updatedUser,
        }),
      );
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    }
  };

  useEffect(() => {
    if (user) {
      setPreviewUrl(user.avatar ? `${SERVER_URL}${user.avatar}` : null);
      setEditName(user.fullName || "");
    }
  }, [user]);

  const handleSaveName = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", editName);
      const res = await api.put("/auth/profile", formData);

      const updatedUser = { ...user, ...res.data };
      console.log(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...updatedUser,
        }),
      );
      setUser(updatedUser);
      setIsEditing(false);
      alert("Name updated!");
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const [editData, setEditData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    constituency: '',
    address: '',
    education: []
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');

    if (section) {
      setActiveSection(section);
    }
  }, [location]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) {
      setUser(u);
      setPreviewUrl(u.avatar ? `${SERVER_URL}${u.avatar}` : null);
      setEditData({
        username: u.username || '',
        email: u.email || '',
        password: '',
        fullName: u.fullName || '',
        phoneNumber: u.phoneNumber || '',
        dateOfBirth: u.dateOfBirth || '',
        gender: u.gender || '',
        constituency: u.constituency || '',
        address: u.address || '',
        education: u.education || [{ qualification: '', institution: '', passingYear: '' }]
      });
    }
    fetchUserData();
    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/complaints/my');
      setMyComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await api.get('/data/public/dashboard');
      setProjects(res.data.projects);
      setSchemes(res.data.schemes || []);
      setEvents(res.data.events || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(complaintForm).forEach(key => {
        if (key === 'image' && complaintForm[key]) formData.append('image', complaintForm[key]);
        else if (complaintForm[key]) formData.append(key, complaintForm[key]);
      });

      await api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Complaint Submitted');
      setComplaintForm({ title: '', description: '', image: null });
      fetchUserData();
    } catch (err) {
      alert('Failed to submit');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEdu = [...editData.education];
    newEdu[index][name] = value;
    setEditData(prev => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, { qualification: '', institution: '', passingYear: '' }]
    }));
  };

  const removeEducation = (index) => {
    const newEdu = editData.education.filter((_, i) => i !== index);
    setEditData(prev => ({ ...prev, education: newEdu }));
  };

  const handleProfileSave = async () => {
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editData).forEach(key => {
        if (key === 'education') {
          formData.append(key, JSON.stringify(editData[key]));
        } else if (editData[key] !== undefined && editData[key] !== null) {
          formData.append(key, editData[key]);
        }
      });

      const res = await api.put('/auth/profile', formData);

      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { display: 'flex', minHeight: 'calc(100vh - 80px)' },
    sidebar: { width: '250px', background: '#f8f9fa', padding: '20px', borderRight: '1px solid #ddd' },
    content: { flex: 1, padding: '30px' },
    menuItem: active => ({ padding: '12px', cursor: 'pointer', borderRadius: '5px', background: active ? 'var(--primary-color)' : 'transparent', color: active ? 'white' : 'black', marginBottom: '5px' }),
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontWeight: 'bold', fontSize: '0.9rem', color: '#1a365d' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '1rem', width: '100%' },
    sidebarHeader: { position: 'relative', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', padding: '10px', borderRadius: '10px', transition: 'background 0.2s' },
    sidebarDropdown: { position: 'absolute', top: '100%', left: '0', right: '0', background: 'white', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', zIndex: 1000, marginTop: '5px' },
    dropdownItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.9rem', color: '#333', textAlign: 'left' },
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Profile View (Read-Only) - ATTRACTIVE DESIGN
  if (!isEditing) {
    return (
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto", 
        marginTop: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "calc(100vh - 100px)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header with Edit Button */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px" 
        }}>
          <h2 style={{ 
            color: "white", 
            fontSize: "2rem", 
            fontWeight: "700",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}>My Profile</h2>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: "white",
              color: "#667eea",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            }}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* Main Profile Card */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
        }}>
          {/* Profile Header */}
          <div style={{
            padding: "40px 40px 20px 40px",
            position: "relative",
            textAlign: "center"
          }}>
            <div style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              border: "6px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              overflow: "hidden",
              background: "white"
            }}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover" 
                  }} 
                />
              ) : (
                <FaUserCircle style={{ 
                  width: "100%", 
                  height: "100%", 
                  color: "#e2e8f0" 
                }} />
              )}
            </div>
            <h3 style={{ 
              margin: "0 0 8px 0", 
              fontSize: "2rem", 
              color: "white",
              fontWeight: "700",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>
              {user.fullName || "User"}
            </h3>
            <p style={{ 
              margin: 0, 
              color: "rgba(255,255,255,0.9)", 
              fontSize: "1.1rem",
              fontWeight: "500"
            }}>
              @{user.username}
            </p>
          </div>

          {/* Content Sections */}
          <div style={{ padding: "20px 40px 40px 40px" }}>
            {/* Account Details */}
            <div style={{ marginBottom: "35px" }}>
              <h4 style={{ 
                marginBottom: "20px", 
                color: "white",
                fontSize: "1.3rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{
                  width: "4px",
                  height: "24px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "2px"
                }}></span>
                Account Details
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Email Address
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.email || "Not provided"}
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Username
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.username || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: "35px" }}>
              <h4 style={{ 
                marginBottom: "20px", 
                color: "white",
                fontSize: "1.3rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{
                  width: "4px",
                  height: "24px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "2px"
                }}></span>
                Personal Information
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "20px"
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Phone Number
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.phoneNumber || "Not provided"}
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Date of Birth
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Gender
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.gender || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div style={{ marginBottom: "35px" }}>
              <h4 style={{ 
                marginBottom: "20px", 
                color: "white",
                fontSize: "1.3rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{
                  width: "4px",
                  height: "24px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "2px"
                }}></span>
                Location Details
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Constituency
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.constituency || "Not provided"}
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "white", 
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: "0.9"
                  }}>
                    Address
                  </div>
                  <div style={{ 
                    fontSize: "1.05rem", 
                    color: "white",
                    fontWeight: "600"
                  }}>
                    {user.address || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Education Details */}
            {user.education && user.education.length > 0 && (
              <div>
                <h4 style={{ 
                  marginBottom: "20px", 
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <span style={{
                    width: "4px",
                    height: "24px",
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "2px"
                  }}></span>
                  Education Details
                </h4>
                {user.education.map((edu, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: "rgba(255,255,255,0.15)",
                      padding: "25px",
                      borderRadius: "16px",
                      marginBottom: "15px",
                      border: "2px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1fr 1fr 1fr", 
                      gap: "20px" 
                    }}>
                      <div>
                        <span style={{ 
                          fontSize: "0.85rem", 
                          color: "white", 
                          fontWeight: "600",
                          display: "block",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          opacity: "0.9"
                        }}>
                          Qualification
                        </span>
                        <span style={{ 
                          fontSize: "1.05rem", 
                          color: "white",
                          fontWeight: "600"
                        }}>
                          {edu.qualification || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span style={{ 
                          fontSize: "0.85rem", 
                          color: "white", 
                          fontWeight: "600",
                          display: "block",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          opacity: "0.9"
                        }}>
                          Institution
                        </span>
                        <span style={{ 
                          fontSize: "1.05rem", 
                          color: "white",
                          fontWeight: "600"
                        }}>
                          {edu.institution || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span style={{ 
                          fontSize: "0.85rem", 
                          color: "white", 
                          fontWeight: "600",
                          display: "block",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          opacity: "0.9"
                        }}>
                          Passing Year
                        </span>
                        <span style={{ 
                          fontSize: "1.05rem", 
                          color: "white",
                          fontWeight: "600"
                        }}>
                          {edu.passingYear || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Edit Profile View (Existing Form)
  return (
    <div style={{ 
      maxWidth: "1000px", 
      margin: "0 auto", 
      marginTop: "20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "calc(100vh - 100px)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
    }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ 
          color: "white", 
          fontSize: "2rem", 
          fontWeight: "700",
          textShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}>Edit Profile</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleProfileSave}
            disabled={loading}
            style={{
              background: "white",
              color: "#667eea",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            }}
          >
            <FaSave /> Save
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: "white", 
          marginBottom: "15px", 
          padding: "15px", 
          background: "rgba(239,68,68,0.2)", 
          borderRadius: "12px",
          border: "2px solid rgba(239,68,68,0.3)",
          fontWeight: "500"
        }}>{error}</div>
      )}

      <div style={{
        background: "rgba(255,255,255,0.15)",
        padding: "30px",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ 
          color: "white", 
          marginBottom: "25px",
          fontSize: "1.3rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{
            width: "4px",
            height: "24px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "2px"
          }}></span>
          Account Details
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <AvatarUpload
            src={previewUrl}
            onFileSelect={handleFileSelect}
            editable={true}
          />
          <p style={{ fontSize: "0.9rem", color: "white", marginTop: "10px", opacity: "0.9" }}>
            Click photo to update
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Username</label>
            <input
              name="username"
              value={editData.username}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Email Address</label>
            <input
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Full Name</label>
            <input
              name="fullName"
              value={editData.fullName}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.15)",
        padding: "30px",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ 
          color: "white", 
          marginBottom: "25px",
          fontSize: "1.3rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{
            width: "4px",
            height: "24px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "2px"
          }}></span>
          Personal Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Phone Number</label>
            <input
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={editData.dateOfBirth?.split("T")[0]}
              onChange={handleEditChange}
              style={{
                ...styles.input,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
          <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
            <label style={{...styles.label, color: "white"}}>Gender</label>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Male", "Female", "Other"].map((g) => (
                <label
                  key={g}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "white",
                    fontWeight: "500"
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={editData.gender === g}
                    onChange={handleEditChange}
                  />{" "}
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.15)",
        padding: "30px",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h3 style={{ 
          color: "white", 
          marginBottom: "25px",
          fontSize: "1.3rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{
            width: "4px",
            height: "24px",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "2px"
          }}></span>
          Location Details
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Constituency</label>
            <div style={{ position: "relative" }}>
              <FaSearch
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                  zIndex: 1
                }}
              />
              <input
                type="text"
                name="constituency"
                value={editData.constituency}
                onChange={handleEditChange}
                style={{ 
                  ...styles.input, 
                  paddingLeft: "35px",
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  color: "#2d3748"
                }}
              />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: "white"}}>Address</label>
            <textarea
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              style={{ 
                ...styles.input, 
                height: "80px", 
                resize: "none",
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#2d3748"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.15)",
        padding: "30px",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h3 style={{ 
            color: "white", 
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{
              width: "4px",
              height: "24px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "2px"
            }}></span>
            Education Details
          </h3>
          <button
            onClick={addEducation}
            style={{
              background: "white",
              color: "#667eea",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            <FaPlus /> Add Education
          </button>
        </div>
        {editData.education?.map((edu, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 120px 40px",
              gap: "15px",
              marginBottom: "10px",
              background: "rgba(255,255,255,0.1)",
              padding: "15px",
              borderRadius: "12px",
              alignItems: "end",
              border: "2px solid rgba(255,255,255,0.2)"
            }}
          >
            <div style={styles.inputGroup}>
              <label style={{...styles.label, color: "white"}}>Qualification</label>
              <select
                name="qualification"
                value={edu.qualification}
                onChange={(e) => handleEducationChange(index, e)}
                style={{
                  ...styles.input,
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  color: "#2d3748"
                }}
              >
                <option value="">Select Degree</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="SSLC">SSLC</option>
                <option value="Plus Two">Plus Two</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={{...styles.label, color: "white"}}>Institution</label>
              <input
                name="institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, e)}
                style={{
                  ...styles.input,
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  color: "#2d3748"
                }}
                placeholder="College / School"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{...styles.label, color: "white"}}>Year</label>
              <input
                name="passingYear"
                value={edu.passingYear}
                onChange={(e) => handleEducationChange(index, e)}
                style={{
                  ...styles.input,
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  color: "#2d3748"
                }}
                placeholder="YYYY"
              />
            </div>
            <button
              onClick={() => removeEducation(index)}
              style={{
                padding: "10px",
                color: "white",
                border: "2px solid rgba(239,68,68,0.5)",
                background: "rgba(239,68,68,0.2)",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
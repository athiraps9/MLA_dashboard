import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { SERVER_URL } from "../utils/api";
import { FaUserCircle, FaSave } from "react-icons/fa";
import AvatarUpload from "../components/AvatarUpload";
import { useLocation } from 'react-router-dom';
import Button from "../components/Button";
import Card from '../components/Card';
import '../styles/variables.css';
const Profile = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {},


  );
  const [activeTab, setActiveTab] = useState("details");
  const [complaints, setComplaints] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

      const updatedUser = { ...user, ...res.data }; // spread operator to merge the user object with the response data
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

//  const [previewUrl, setPreviewUrl] = useState('');
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
    const [searchConstituency, setSearchConstituency] = useState('');
    const [showConstituencySuggestions, setShowConstituencySuggestions] = useState(false);
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
                gender: u.gender || 'Male',
                constituency: u.constituency || '',
                address: u.address || '',
                education: u.education || [{ qualification: '', institution: '', passingYear: '' }]
            });
            setSearchConstituency(u.constituency || '');
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

    // const handleFileSelect = async (file) => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('avatar', file);
    //         setPreviewUrl(URL.createObjectURL(file)); // Optimistic
    //         const res = await api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    //         const updatedUser = { ...user, ...res.data };
    //         localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...updatedUser }));
    //         setUser(updatedUser);
    //     } catch (err) { alert('Upload failed'); console.error(err); }
    // };

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
            setIsEditing(false); // Switch back to view mode
            alert('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };









    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Edit Profile</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button> */}
          <Button onClick={handleProfileSave} disabled={loading}>
            <FaSave style={{ marginRight: "8px" }} /> Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      <Card title="Account Details">
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
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "10px" }}>
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
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={editData.username}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="fullName"
              value={editData.fullName}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={editData.password}
              onChange={handleEditChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>
        </div>
      </Card>

      <Card title="Personal Information" style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={editData.dateOfBirth?.split("T")[0]}
              onChange={handleEditChange}
              style={styles.input}
            />
          </div>
          <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
            <label style={styles.label}>Gender</label>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Male", "Female", "Other"].map((g) => (
                <label
                  key={g}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
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
      </Card>

      <Card title="Location Details" style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={{ position: "relative" }}>
            <label style={styles.label}>Constituency</label>
            <div style={{ position: "relative" }}>
              <FaSearch
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                }}
              />
              <input
                placeholder="Search constituency..."
                value={searchConstituency || editData.constituency}
                onChange={(e) => {
                  setSearchConstituency(e.target.value);
                  setShowConstituencySuggestions(true);
                }}
                onFocus={() => setShowConstituencySuggestions(true)}
                style={{ ...styles.input, paddingLeft: "35px" }}
              />
              {showConstituencySuggestions && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    zIndex: 10,
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {KERALA_CONSTITUENCIES.filter((c) =>
                    c.toLowerCase().includes(searchConstituency.toLowerCase()),
                  ).map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        setEditData((p) => ({ ...p, constituency: c }));
                        setSearchConstituency(c);
                        setShowConstituencySuggestions(false);
                      }}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              style={{ ...styles.input, height: "80px", resize: "none" }}
            />
          </div>
        </div>
      </Card>

      <Card title="Education Details" style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button onClick={addEducation} size="sm">
            <FaPlus /> Add Education
          </Button>
        </div>
        {editData.education?.map((edu, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 120px 40px",
              gap: "15px",
              marginBottom: "10px",
              background: "#f8f9fa",
              padding: "10px",
              borderRadius: "4px",
              alignItems: "end",
            }}
          >
            <div style={styles.inputGroup}>
              <label style={styles.label}>Qualification</label>
              <select
                name="qualification"
                value={edu.qualification}
                onChange={(e) => handleEducationChange(index, e)}
                style={styles.input}
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
              <label style={styles.label}>Institution</label>
              <input
                name="institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, e)}
                style={styles.input}
                placeholder="College / School"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Year</label>
              <input
                name="passingYear"
                value={edu.passingYear}
                onChange={(e) => handleEducationChange(index, e)}
                style={styles.input}
                placeholder="YYYY"
              />
            </div>
            <button
              onClick={() => removeEducation(index)}
              style={{
                padding: "8px",
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Profile;

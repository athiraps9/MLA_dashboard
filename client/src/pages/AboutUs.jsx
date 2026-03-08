import { useState, useEffect } from "react";
import photo from "../assets/Najeeb_Kanthapuram_MLA_pic.jpg"
import Footer from "../components/Footer";

const stats = [
  { label: "Registered Voters", value: "2,18,114", icon: "🗳️" },
  { label: "Polling Stations", value: "182", icon: "🏛️" },
  { label: "Voter Turnout 2021", value: "76.15%", icon: "📊" },
  { label: "Assembly No.", value: "038", icon: "🔢" },
];

const localBodies = [
  "Perinthalmanna Municipality",
  "Karuvarakundu Grama Panchayat",
  "Vengara Grama Panchayat",
  "Kalpakanchery Grama Panchayat",
  "Munniyur Grama Panchayat",
  "Mankada Grama Panchayat",
];

const mlaHistory = [
  { year: "2021–Present", name: "Najeeb Kanthapuram", party: "IUML", votes: "76,530" },
  { year: "2016–2021", name: "Manjalamkuzhi Ali", party: "IUML", votes: "—" },
  { year: "2006–2011", name: "Sasi Kumar", party: "CPI(M)", votes: "76,059" },
  { year: "2001–2006", name: "Nalakath Soopy", party: "IUML", votes: "64,072" },
];

const features = [
  { icon: "📋", title: "Project Tracker", desc: "Real-time status of all development projects — roads, buildings, water supply, and infrastructure works across the constituency.", color: "#6366f1" },
  { icon: "🎯", title: "Government Schemes", desc: "Browse central and state welfare schemes, eligibility criteria, application status, and beneficiary lists.", color: "#0ea5e9" },
  { icon: "📅", title: "Events & Programmes", desc: "Public meetings, grievance days, cultural events, and official programmes organized by the MLA office.", color: "#8b5cf6" },
  { icon: "📢", title: "Announcements", desc: "Latest circulars, notifications, and important public messages from the MLA and government departments.", color: "#ec4899" },
  { icon: "💰", title: "Fund Utilization", desc: "Transparent breakdown of MLALAD funds, CSR allocations, and local body grants used in the constituency.", color: "#10b981" },
  { icon: "🤝", title: "Grievance Portal", desc: "Submit and track public grievances directly to the MLA office for prompt resolution.", color: "#f59e0b" },
];

function AnimatedNumber({ target }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) { setDisplay(target); return; }
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start.toLocaleString("en-IN"));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{display}</span>;
}

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("about");
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Animated mesh background ── */
        .bg-root {
          background: linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 40%, #ffffff 70%, #e0f2fe 100%);
          background-size: 400% 400%;
          animation: gradShift 12s ease infinite;
        }
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Floating blobs ── */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          pointer-events: none;
          animation: float 18s ease-in-out infinite;
        }
        .blob-1 { width: 520px; height: 520px; background: #a5c8ff; top: -120px; left: -100px; animation-delay: 0s; }
        .blob-2 { width: 400px; height: 400px; background: #d5b3ff; top: 30%; right: -80px; animation-delay: -5s; }
        .blob-3 { width: 350px; height: 350px; background: #93d5ea; bottom: 10%; left: 20%; animation-delay: -10s; }
        .blob-4 { width: 280px; height: 280px; background: #fbb6e8; bottom: -60px; right: 15%; animation-delay: -3s; }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
        }

        /* ── Glass card ── */
        .glass {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(99, 120, 200, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        .glass:hover {
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 16px 48px rgba(99, 120, 200, 0.2), inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-4px);
        }

        .glass-strong {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(99, 120, 200, 0.15), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .glass-tab-bar {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 2px 16px rgba(100,120,200,0.08);
        }

        /* ── Tabs ── */
        .tab-btn {
          padding: 9px 26px;
          border-radius: 30px;
          border: 1.5px solid rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(12px);
          color: #4a5c8a;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #4f7cff, #7c3aed);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 6px 20px rgba(79,124,255,0.4);
        }
        .tab-btn:hover:not(.active) {
          background: rgba(255,255,255,0.6);
          border-color: rgba(79,124,255,0.4);
          color: #4f7cff;
          box-shadow: 0 4px 16px rgba(79,124,255,0.15);
        }

        /* ── Stat cards ── */
        .stat-glass {
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 18px;
          padding: 24px 16px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(99,120,200,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .stat-glass:hover {
          background: rgba(255,255,255,0.65);
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px rgba(79,124,255,0.2);
        }

        /* ── Feature cards ── */
        .feature-glass {
          background: rgba(255,255,255,0.38);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 20px;
          padding: 28px 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(99,120,200,0.08);
          position: relative;
          overflow: hidden;
        }
        .feature-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .feature-glass:hover {
          background: rgba(255,255,255,0.58);
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(99,120,200,0.18);
        }
        .feature-glass:hover::before { opacity: 1; }

        /* ── Animations ── */
        .fade-in { opacity: 0; transform: translateY(28px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.08s; }
        .delay-2 { transition-delay: 0.18s; }
        .delay-3 { transition-delay: 0.28s; }
        .delay-4 { transition-delay: 0.38s; }
        .delay-5 { transition-delay: 0.48s; }
        .delay-6 { transition-delay: 0.58s; }

        /* ── Misc ── */
        .section-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6366f1;
          font-family: 'Inter', sans-serif;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,120,200,0.25), transparent);
          margin: 20px 0;
        }
        .badge {
          display: inline-block;
          padding: 3px 13px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        .badge-iuml { background: rgba(34,197,94,0.18); color: #15803d; border: 1px solid rgba(34,197,94,0.4); }
        .badge-cpim { background: rgba(239,68,68,0.15); color: #b91c1c; border: 1px solid rgba(239,68,68,0.3); }

        .history-row {
          display: grid;
          grid-template-columns: 160px 1fr 100px 110px;
          gap: 16px;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.4);
          align-items: center;
          transition: background 0.2s;
        }
        .history-row:hover { background: rgba(255,255,255,0.3); }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(99,120,200,0.1);
          font-family: 'Inter', sans-serif;
        }

        .pill-tag {
          padding: 6px 16px;
          border-radius: 30px;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.4);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .local-grid { grid-template-columns: 1fr 1fr !important; }
          .history-row { grid-template-columns: 1fr 1fr; font-size: 13px; }
          .hero-title { font-size: 40px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Background */}
      <div className="bg-root" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Tab Bar */}
        {/* <div className="glass-tab-bar" style={{ padding: "12px 28px", display: "flex", justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["about", "constituency", "history"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div> */}

        {/* Hero */}
        <div style={{ padding: "56px 28px 48px", maxWidth: 1140, margin: "0 auto" }}>

          {/* Two-column hero: text left, picture right */}
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center", marginBottom: 48 }}>

            {/* Left — text */}
            <div className={`fade-in ${visible ? "visible" : ""}`}>
              <div className="section-label" style={{ marginBottom: 14 }}>Kerala Legislative Assembly • Constituency 38</div>
              <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 58, fontWeight: 900, lineHeight: 1.08, color: "#1a2c6b", marginBottom: 16, letterSpacing: "-0.02em" }}>
                Perinthalmanna
                <br />
                <span style={{ background: "linear-gradient(135deg, #4f7cff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Constituency
                </span>
              </h1>
              <p style={{ fontSize: 15.5, color: "#3d5080", lineHeight: 1.85, marginBottom: 28, fontWeight: 400 }}>
                A public transparency portal to track development projects, government schemes, events, and welfare programmes for the people of Perinthalmanna.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[["📍", "Malappuram District", "#3b82f6"], ["🏛️", "Malappuram Lok Sabha", "#7c3aed"], ["🗳️", "2,18,114 Voters", "#10b981"]].map(([icon, label, color]) => (
                  <div key={label} className="pill-tag" style={{ color }}>
                    {icon} {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — MLA photo card */}
            <div className={`fade-in delay-2 ${visible ? "visible" : ""}`}>
              <div style={{ position: "relative" }}>
                {/* Glow ring behind card */}
                <div style={{ position: "absolute", inset: -16, borderRadius: 36, background: "linear-gradient(135deg, rgba(79,124,255,0.25), rgba(124,58,237,0.2))", filter: "blur(24px)", zIndex: 0 }} />

                {/* Glass photo card */}
                <div style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(28px) saturate(200%)", WebkitBackdropFilter: "blur(28px) saturate(200%)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 28, padding: 24, boxShadow: "0 16px 56px rgba(79,124,255,0.15), inset 0 1px 0 rgba(255,255,255,0.9)" }}>

                  {/* Photo frame */}
                  <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 20, aspectRatio: "4/3" }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Najeeb_Kanthapuram.jpg/320px-Najeeb_Kanthapuram.jpg"
                      alt="Najeeb Kanthapuram MLA"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback avatar */}
                    <div style={{ display: "none", width: "100%", height: "100%", background: "linear-gradient(135deg,#c7d9f7,#dce8fc)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                    <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>






                    {/* Gradient overlay at bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(20,30,80,0.55), transparent)", pointerEvents: "none" }} />
                    {/* Name overlay on photo */}
                    <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', serif", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>Najeeb Kanthapuram</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2, fontWeight: 500 }}>MLA • Perinthalmanna</div>
                    </div>
                  </div>

                  {/* Info strips */}
                  {/* <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[["Party", "IUML", "#16a34a"], ["Term", "2021–Present", "#4f7cff"], ["Votes", "76,530", "#7c3aed"], ["Margin", "38 Votes", "#ec4899"]].map(([k, v, c]) => (
                      <div key={k} style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.75)", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#8a9ec4", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div> */}

                  {/* Party badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.5)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.7)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 8px rgba(22,163,74,0.6)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: "#5a6e9a", letterSpacing: "0.04em" }}>Indian Union Muslim League</div>
                      <div style={{ fontSize: 10, color: "#8a9ec4", marginTop: 1 }}>UDF Alliance • Kerala</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`fade-in delay-3 ${visible ? "visible" : ""}`}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-glass">
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
                    <AnimatedNumber target={s.value} />
                  </div>
                  <div style={{ fontSize: 12, color: "#5a6e9a", fontWeight: 500, letterSpacing: "0.02em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px 60px" }}>

          {/* ABOUT */}
          {activeTab === "about" && (
            <div>
              <div className={`fade-in ${visible ? "visible" : ""}`} style={{ marginBottom: 48 }}>
                <div className="section-label" style={{ marginBottom: 16 }}>Current Representative</div>
                <div className="two-col" style={{ display: "grid", gap: 20 }}>

                  {/* MLA Card */}
                  {/* <div className="glass-strong" style={{ padding: "32px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #4f7cff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 6px 20px rgba(79,124,255,0.35)" }}>👤</div>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a2c6b" }}>Najeeb Kanthapuram</div>
                        <div style={{ fontSize: 13, color: "#5a6e9a", marginTop: 3 }}>MLA, Perinthalmanna (2021–Present)</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                      <span className="badge badge-iuml">IUML</span>
                      <span style={{ fontSize: 12.5, color: "#5a6e9a" }}>Indian Union Muslim League</span>
                    </div>
                    <div className="divider" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[["Votes Won", "76,530"], ["Win Margin", "38 Votes"], ["Vote Share", "46.21%"], ["Election", "2021"]].map(([k, v]) => (
                        <div key={k} style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.7)" }}>
                          <div style={{ fontSize: 10, color: "#8a9ec4", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, fontWeight: 600 }}>{k}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* About Dashboard */}
                  <div className="glass-strong" style={{ padding: "32px 28px",maxWidth: 1140}}>
                    <div className="section-label" style={{ marginBottom: 12 }}>About This Dashboard</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a2c6b", marginBottom: 14, lineHeight: 1.4 }}>Transparency for Every Citizen</h3>
                    <p style={{ fontSize: 14, color: "#3d5080", lineHeight: 1.85, marginBottom: 14 }}>
                      The Perinthalmanna MLA Dashboard is a public-facing portal designed to ensure complete transparency in governance. Citizens can track the progress of development projects funded through MLALAD funds and other allocations.
                    </p>
                    <p style={{ fontSize: 14, color: "#3d5080", lineHeight: 1.85 }}>
                      From welfare schemes and job fairs to road construction and health camps — every initiative is documented and accessible to the 2.18 lakh voters of Perinthalmanna.
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="section-label" style={{ marginBottom: 16 }}>Dashboard Features</div>
              <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                {features.map((f, i) => (
                  <div key={i} className={`feature-glass fade-in delay-${i + 1} ${visible ? "visible" : ""}`} style={{ "--accent": f.color }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14, border: `1px solid ${f.color}30` }}>{f.icon}</div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a2c6b", marginBottom: 8 }}>{f.title}</h4>
                    <p style={{ fontSize: 13, color: "#4a5e82", lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONSTITUENCY */}
          {activeTab === "constituency" && (
            <div>
              <div className="section-label" style={{ marginBottom: 14 }}>Geographic & Demographic Profile</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "#1a2c6b", marginBottom: 28 }}>About the Constituency</h2>

              <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
                <div className="glass" style={{ padding: 26 }}>
                  <div className="section-label" style={{ marginBottom: 14 }}>Location & Administration</div>
                  {[["State","Kerala"],["District","Malappuram"],["Lok Sabha","Malappuram"],["Assembly No.","038"],["Population (2011)","2,53,025"],["Urban Population","19.65%"],["Rural Population","80.35%"]].map(([k,v]) => (
                    <div key={k} className="info-row">
                      <span style={{ fontSize: 13, color: "#7a90b8" }}>{k}</span>
                      <span style={{ fontSize: 13, color: "#1a2c6b", fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="glass" style={{ padding: 26 }}>
                  <div className="section-label" style={{ marginBottom: 14 }}>Voter Statistics</div>
                  {[["Total Electorate (2024)","2,18,114"],["Male Voters","78,666"],["Female Voters","86,376"],["Polling Stations","182"],["Voter Turnout 2021","76.15%"],["Voter Turnout 2024 LS","71.64%"],["SC Population Ratio","11.05%"]].map(([k,v]) => (
                    <div key={k} className="info-row">
                      <span style={{ fontSize: 13, color: "#7a90b8" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-label" style={{ marginBottom: 14 }}>Local Self-Governed Bodies</div>
              <div className="local-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
                {localBodies.map((body, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#2a3e6b", fontWeight: 500, boxShadow: "0 2px 8px rgba(79,124,255,0.08)", transition: "all 0.25s ease" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#4f7cff,#7c3aed)", flexShrink: 0, boxShadow: "0 0 6px rgba(79,124,255,0.5)" }} />
                    {body}
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 18, padding: 26, boxShadow: "0 8px 32px rgba(79,124,255,0.1)" }}>
                <div className="section-label" style={{ marginBottom: 10 }}>Parliamentary Context</div>
                <p style={{ fontSize: 14, color: "#3d5080", lineHeight: 1.85 }}>
                  Perinthalmanna is one of <strong style={{ color: "#4f7cff" }}>seven assembly segments</strong> within the Malappuram Lok Sabha constituency. The current MP is <strong style={{ color: "#4f7cff" }}>E.T. Mohammed Basheer (IUML)</strong>. The region has historically been a stronghold of the Indian Union Muslim League, reflecting the demographic composition of Malappuram district.
                </p>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <div>
              <div className="section-label" style={{ marginBottom: 14 }}>Electoral Records</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "#1a2c6b", marginBottom: 28 }}>MLA History</h2>

              <div style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(22px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(79,124,255,0.12)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 100px 110px", gap: 16, padding: "14px 22px", background: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.6)" }}>
                  {["Term", "MLA Name", "Party", "Votes"].map(h => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{h}</div>
                  ))}
                </div>
                {mlaHistory.map((row, i) => (
                  <div key={i} className="history-row">
                    <div style={{ fontSize: 13, color: "#8a9ec4" }}>{row.year}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#1a2c6b", fontWeight: 600 }}>{row.name}</div>
                    <div><span className={`badge badge-${row.party === "IUML" ? "iuml" : "cpim"}`}>{row.party}</span></div>
                    <div style={{ fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{row.votes}</div>
                  </div>
                ))}
              </div>

              <div className="divider" style={{ margin: "32px 0" }} />

              <div style={{ background: "rgba(255,255,255,0.42)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 18, padding: 26, boxShadow: "0 8px 28px rgba(16,185,129,0.1)" }}>
                <div className="section-label" style={{ color: "#10b981", marginBottom: 10 }}>Historical Note</div>
                <p style={{ fontSize: 14, color: "#3d5080", lineHeight: 1.85 }}>
                  The constituency has been represented since 1957 as part of Kerala's democratic history. The seat has been a competitive battleground, with IUML dominating most terms and CPI(M) winning occasionally. The 2021 election was notable for its extremely narrow margin of just <strong style={{ color: "#10b981" }}>38 votes</strong>, one of the closest contests in Kerala's electoral history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
        <Footer/>
    </div>
  
    
  );
}
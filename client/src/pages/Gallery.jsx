import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "../components/Footer";

const categories = ["All", "Events", "Projects", "Schemes", "Community"];

const galleryItems = [
  { id: 1, category: "Events", title: "Constituency Meeting 2024", desc: "Annual public meeting with residents of Perinthalmanna", date: "Jan 2024", featured: true, color: "#6366f1", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop" },
  { id: 2, category: "Projects", title: "Road Development Work", desc: "NH expansion project connecting Perinthalmanna to Malappuram", date: "Mar 2024", featured: true, color: "#0ea5e9", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop" },
  { id: 3, category: "Schemes", title: "Housing Scheme Launch", desc: "Inauguration of affordable housing units for beneficiaries", date: "Feb 2024", featured: true, color: "#10b981", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" },
  { id: 4, category: "Community", title: "Health Camp", desc: "Free medical check-up camp for senior citizens", date: "Apr 2024", featured: false, color: "#f59e0b", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop" },
  { id: 5, category: "Events", title: "Youth Fest 2024", desc: "Cultural and sports programme for the youth of the constituency", date: "May 2024", featured: false, color: "#ec4899", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop" },
//   { id: 6, category: "Projects", title: "Water Supply Inauguration", desc: "New pipeline project ensuring clean water to 5000 households", date: "Jun 2024", featured: false, color: "#0ea5e9", img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777540?w=800&h=600&fit=crop" },
 // { id: 7, category: "Schemes", title: "Scholarship Distribution", desc: "Educational scholarships awarded to 200 deserving students", date: "Jul 2024", featured: false, color: "#8b5cf6", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop" },
  { id: 8, category: "Community", title: "Tree Plantation Drive", desc: "Mass plantation initiative — 10,000 saplings across the constituency", date: "Aug 2024", featured: false, color: "#10b981", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop" },
//   { id: 9, category: "Events", title: "Independence Day Parade", desc: "Celebrating 78th Independence Day at Town Square", date: "Aug 2024", featured: false, color: "#f97316", img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&h=600&fit=crop" },
  { id: 10, category: "Projects", title: "School Renovation", desc: "Complete renovation of Govt. High School Perinthalmanna", date: "Sep 2024", featured: false, color: "#6366f1", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop" },
  { id: 11, category: "Schemes", title: "Pension Distribution", desc: "Monthly welfare pension handed to 1200 elderly citizens", date: "Oct 2024", featured: false, color: "#f59e0b", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop" },
  { id: 12, category: "Community", title: "Women Empowerment Meet", desc: "Kudumbashree meet celebrating women entrepreneurs", date: "Nov 2024", featured: false, color: "#ec4899", img: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=800&h=600&fit=crop" },
];

const featured = galleryItems.filter(i => i.featured);

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const goToSlide = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideIndex((idx + featured.length) % featured.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    intervalRef.current = setInterval(() => goToSlide(slideIndex + 1), 4500);
    return () => clearInterval(intervalRef.current);
  }, [slideIndex, goToSlide]);

  const filtered = activeCategory === "All" ? galleryItems : galleryItems.filter(i => i.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .bg-gallery {
          background: linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 40%, #ffffff 70%, #e0f2fe 100%);
          background-size: 400% 400%;
          animation: gradShift 14s ease infinite;
        }
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .blob { position: fixed; border-radius: 50%; filter: blur(90px); opacity: 0.4; pointer-events: none; animation: floatBlob 20s ease-in-out infinite; }
        .b1 { width: 600px; height: 600px; background: #a5c8ff; top: -150px; left: -120px; animation-delay: 0s; }
        .b2 { width: 450px; height: 450px; background: #d5b3ff; top: 25%; right: -100px; animation-delay: -6s; }
        .b3 { width: 380px; height: 380px; background: #93d5ea; bottom: 5%; left: 15%; animation-delay: -12s; }
        .b4 { width: 300px; height: 300px; background: #fbb6e8; bottom: -80px; right: 10%; animation-delay: -4s; }
        @keyframes floatBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-50px) scale(1.06); }
          66%      { transform: translate(-25px,25px) scale(0.96); }
        }

        /* Glass */
        .glass { background: rgba(255,255,255,0.42); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.72); }
        .glass-deep { background: rgba(255,255,255,0.52); backdrop-filter: blur(28px) saturate(200%); -webkit-backdrop-filter: blur(28px) saturate(200%); border: 1px solid rgba(255,255,255,0.8); }

        /* Slider */
        .slide-track { position: relative; border-radius: 28px; overflow: hidden; box-shadow: 0 24px 80px rgba(60,80,180,0.2); }
        .slide-img { width: 100%; height: 480px; object-fit: cover; display: block; transition: transform 0.6s ease; }
        .slide-track:hover .slide-img { transform: scale(1.03); }
        .slide-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,20,60,0.75) 0%, rgba(10,20,60,0.15) 50%, transparent 100%); }
        .slide-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 36px 40px; }
        .slide-dots { display: flex; gap: 8px; justify-content: center; margin-top: 18px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.6); cursor: pointer; transition: all 0.3s; }
        .dot.active { width: 28px; border-radius: 4px; background: #4f7cff; border-color: #4f7cff; box-shadow: 0 0 10px rgba(79,124,255,0.6); }
        .slide-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.25); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.6); color: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s; z-index: 10; }
        .slide-btn:hover { background: rgba(255,255,255,0.45); transform: translateY(-50%) scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .slide-btn.prev { left: 16px; }
        .slide-btn.next { right: 16px; }

        /* Filter tabs */
        .filter-tab { padding: 8px 22px; border-radius: 30px; border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.35); backdrop-filter: blur(12px); color: #4a5c8a; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; transition: all 0.25s; }
        .filter-tab.active { background: linear-gradient(135deg,#4f7cff,#7c3aed); border-color: transparent; color: #fff; box-shadow: 0 5px 18px rgba(79,124,255,0.38); }
        .filter-tab:hover:not(.active) { background: rgba(255,255,255,0.6); color: #4f7cff; border-color: rgba(79,124,255,0.4); }

        /* Grid cards */
        .grid-card { position: relative; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.35s ease; box-shadow: 0 4px 20px rgba(60,80,180,0.1); }
        .grid-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 56px rgba(60,80,180,0.22); }
        .grid-card img { width: 100%; height: 220px; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .grid-card:hover img { transform: scale(1.08); }
        .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,20,60,0.82) 0%, rgba(10,20,60,0.1) 55%, transparent 100%); opacity: 0; transition: opacity 0.3s ease; }
        .grid-card:hover .card-overlay { opacity: 1; }
        .card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; transform: translateY(8px); opacity: 0; transition: all 0.3s ease; }
        .grid-card:hover .card-info { transform: translateY(0); opacity: 1; }
        .card-glass-bottom { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px; background: rgba(255,255,255,0.42); backdrop-filter: blur(14px); border-top: 1px solid rgba(255,255,255,0.65); }

        /* Category chip */
        .chip { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }

        /* Lightbox */
        .lightbox-bg { position: fixed; inset: 0; background: rgba(8,12,40,0.88); backdrop-filter: blur(16px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; animation: lbIn 0.25s ease; }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-card { background: rgba(255,255,255,0.12); backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.25); border-radius: 28px; overflow: hidden; max-width: 860px; width: 100%; box-shadow: 0 32px 100px rgba(0,0,0,0.4); animation: lbSlide 0.3s ease; }
        @keyframes lbSlide { from { transform: scale(0.92) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .lb-close { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10; }
        .lb-close:hover { background: rgba(255,255,255,0.28); transform: scale(1.1) rotate(90deg); }

        /* Fade in */
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:0.05s} .d2{transition-delay:0.12s} .d3{transition-delay:0.19s}
        .d4{transition-delay:0.26s} .d5{transition-delay:0.33s} .d6{transition-delay:0.40s}
        .d7{transition-delay:0.47s} .d8{transition-delay:0.54s} .d9{transition-delay:0.61s}
        .d10{transition-delay:0.68s} .d11{transition-delay:0.75s} .d12{transition-delay:0.82s}

        .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #6366f1; }

        @media(max-width:768px) {
          .grid-3 { grid-template-columns: repeat(2,1fr) !important; }
          .slide-img { height: 280px !important; }
          .slide-content { padding: 20px 22px !important; }
        }
        @media(max-width:480px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Background */}
      <div className="bg-gallery" style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" /><div className="blob b4" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "52px 28px 72px" }}>

        {/* Header */}
        <div className={`fade-in ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Perinthalmanna MLA Dashboard</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: "#1a2c6b", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>
            Photo{" "}
            <span style={{ background: "linear-gradient(135deg,#4f7cff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Gallery
            </span>
          </h1>
          <p style={{ fontSize: 15, color: "#4a5c8a", maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
            A visual chronicle of events, projects, and community programmes across Perinthalmanna constituency.
          </p>
        </div>

        {/* ── FEATURED SLIDER ── */}
        <div className={`fade-in d2 ${visible ? "visible" : ""}`} style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 4 }}>Featured</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a2c6b" }}>Highlights</div>
            </div>
            <div style={{ fontSize: 13, color: "#7a8fba", fontWeight: 500 }}>{slideIndex + 1} / {featured.length}</div>
          </div>

          <div className="slide-track" style={{ position: "relative" }}>
            <img className="slide-img" src={featured[slideIndex].img} alt={featured[slideIndex].title} />
            <div className="slide-overlay" />
            <div className="slide-content">
              <div className="chip" style={{ background: `${featured[slideIndex].color}30`, color: featured[slideIndex].color, border: `1px solid ${featured[slideIndex].color}60`, marginBottom: 10 }}>
                {featured[slideIndex].category}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                {featured[slideIndex].title}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>{featured[slideIndex].desc}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>📅 {featured[slideIndex].date}</div>
            </div>

            <button className="slide-btn prev" onClick={() => { clearInterval(intervalRef.current); goToSlide(slideIndex - 1); }}>‹</button>
            <button className="slide-btn next" onClick={() => { clearInterval(intervalRef.current); goToSlide(slideIndex + 1); }}>›</button>
          </div>

          <div className="slide-dots">
            {featured.map((_, i) => (
              <div key={i} className={`dot ${i === slideIndex ? "active" : ""}`} onClick={() => goToSlide(i)} />
            ))}
          </div>
        </div>

        {/* ── GRID SECTION ── */}
        <div className={`fade-in d3 ${visible ? "visible" : ""}`} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 4 }}>Browse</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a2c6b" }}>All Photos</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} className={`filter-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div style={{ fontSize: 13, color: "#7a8fba", marginBottom: 20, fontWeight: 500 }}>
            Showing <strong style={{ color: "#4f7cff" }}>{filtered.length}</strong> photos
            {activeCategory !== "All" && <span> in <strong style={{ color: "#7c3aed" }}>{activeCategory}</strong></span>}
          </div>

          {/* Grid */}
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`grid-card fade-in d${(i % 12) + 1} ${visible ? "visible" : ""}`}
                onClick={() => setLightbox(item)}
              >
                <img src={item.img} alt={item.title} />
                <div className="card-overlay" />
                <div className="card-info">
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>📅 {item.date}</div>
                </div>
                <div className="card-glass-bottom">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: "#1a2c6b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{item.title}</div>
                    <span className="chip" style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44`, flexShrink: 0 }}>{item.category}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6a80aa", marginTop: 4 }}>📅 {item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lightbox-bg" onClick={() => setLightbox(null)}>
          <div className="lightbox-card" onClick={e => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.img} alt={lightbox.title} style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "28px 32px", background: "rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span className="chip" style={{ background: `${lightbox.color}30`, color: lightbox.color, border: `1px solid ${lightbox.color}55`, padding: "5px 14px", fontSize: 11 }}>{lightbox.category}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>📅 {lightbox.date}</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{lightbox.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>{lightbox.desc}</div>
            </div>
          </div>
        </div>
      )}
        <Footer/>
    </div>
  );
}
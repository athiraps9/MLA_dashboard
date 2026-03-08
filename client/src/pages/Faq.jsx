import { useState } from "react";

const faqs = [
  { q: "What is the Perinthalmanna MLA Dashboard?", a: "It is a public transparency portal where citizens can track development projects, government schemes, events, and welfare programmes of the Perinthalmanna constituency." },
  { q: "Who is the current MLA of Perinthalmanna?", a: "Najeeb Kanthapuram is the current MLA of Perinthalmanna, elected in 2021 under the IUML party with 76,530 votes." },
  { q: "How can I track the status of a project?", a: "Navigate to the Projects section on the dashboard. Each project shows its current status, allocated budget, completion percentage, and expected deadline." },
  { q: "How do I apply for government schemes?", a: "Visit the Schemes section, browse available schemes, check eligibility criteria, and click Apply. You can also track your application status from the same page." },
  { q: "How can I submit a grievance?", a: "Go to the Grievance Portal, fill in your details and describe your issue. You will receive a reference number to track the status of your complaint." },
  { q: "Where is Perinthalmanna constituency located?", a: "Perinthalmanna is Assembly Constituency 038 in Malappuram District, Kerala. It falls under the Malappuram Lok Sabha constituency." },
  { q: "How often is the dashboard updated?", a: "The dashboard is updated regularly by the MLA office. Project statuses are updated monthly and announcements are posted as and when they occur." },
  { q: "Is this portal free to use?", a: "Yes, this is a completely free public portal. No login or registration is required to view projects, schemes, events, or announcements." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{ padding: "72px 28px", background: "linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 40%, #ffffff 70%, #e0f2fe 100%)" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0ea5e9", marginBottom: 12 }}>
            Help & Support
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: "#0c2d5e", lineHeight: 1.1, marginBottom: 12 }}>
            Frequently Asked{" "}
            <span style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Questions
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "#4a7aa5", lineHeight: 1.8 }}>
            Everything you need to know about the Perinthalmanna MLA Dashboard.
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${open === i ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.85)"}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: open === i ? "0 8px 32px rgba(56,189,248,0.15)" : "0 2px 12px rgba(186,224,255,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#0c2d5e", lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: open === i ? "linear-gradient(135deg,#38bdf8,#0ea5e9)" : "rgba(224,242,254,0.8)",
                  border: "1px solid rgba(186,224,255,0.8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: open === i ? "#fff" : "#0ea5e9",
                  transition: "all 0.3s ease",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}>
                  +
                </div>
              </button>

              {/* Answer — smooth slide using grid-template-rows trick */}
              <div style={{
                display: "grid",
                gridTemplateRows: open === i ? "1fr" : "0fr",
                transition: "grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{
                    padding: "16px 24px 20px",
                    borderTop: "1px solid rgba(186,224,255,0.35)",
                    opacity: open === i ? 1 : 0,
                    transform: open === i ? "translateY(0)" : "translateY(-10px)",
                    transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
                  }}>
                    <p style={{ fontSize: 14, color: "#4a7aa5", lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
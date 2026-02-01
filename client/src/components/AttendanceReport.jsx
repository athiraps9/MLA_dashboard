import React, { useEffect, useState } from "react";

/* ---------------- HELPERS ---------------- */

const getLatestSeason = (seasons) => {
  return [...seasons].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  )[0];
};

const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);

  while (current <= new Date(end)) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const mapAttendanceByDate = (list) => {
  const map = {};
  list.forEach((i) => {
    const key = new Date(i.date).toISOString().split("T")[0];
    map[key] = i.status === "Present" ? "P" : "A";
  });
  return map;
};

const getMonthHeader = (dates) => {
  if (!dates.length) return "";
  return dates[0].toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

/* ---------------- STYLES ---------------- */

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #E5E7EB",
  backgroundColor: "#F8FAFC",
  fontSize: "14px",
  fontWeight: 600,
  textAlign: "center",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #E5E7EB",
  textAlign: "center",
  fontSize: "14px",
};

/* ---------------- COMPONENT ---------------- */

export default function AttendanceReport({ seasons, allAttendance }) {
  const [attendanceForm, setAttendanceForm] = useState({
    seasonId: "",
    fromDate: "",
    toDate: "",
  });

  /* AUTO LOAD LATEST SEASON */
  useEffect(() => {
    if (seasons?.length) {
      const latest = getLatestSeason(seasons);

      setAttendanceForm({
        seasonId: latest._id,
        fromDate: latest.startDate.split("T")[0],
        toDate: latest.endDate.split("T")[0],
      });
    }
  }, [seasons]);

  const canShowReport =
    attendanceForm.fromDate && attendanceForm.toDate;

  /* ---------------- UI ---------------- */

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        padding: "32px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* FILTERS */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label>From</label>
          <input
            type="date"
            value={attendanceForm.fromDate}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                fromDate: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>To</label>
          <input
            type="date"
            value={attendanceForm.toDate}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                toDate: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* REPORT */}
      {canShowReport ? (
        (() => {
          const dates = getDateRange(
            attendanceForm.fromDate,
            attendanceForm.toDate
          );

          const attendanceMap = mapAttendanceByDate(allAttendance);
          const monthHeader = getMonthHeader(dates);

          let totalPresent = 0;

          return (
            <div style={{ overflowX: "auto" }}>
              {/* MONTH HEADER */}
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                {monthHeader}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Date</th>
                    {dates.map((d) => (
                      <th key={d.toISOString()} style={thStyle}>
                        {d.getDate()}
                      </th>
                    ))}
                    <th style={thStyle}>Total Present</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td style={tdStyle}>Attendance</td>

                    {dates.map((d) => {
                      const key = d.toISOString().split("T")[0];
                      const status = attendanceMap[key] || "-";

                      if (status === "P") totalPresent++;

                      return (
                        <td
                          key={key}
                          style={{
                            ...tdStyle,
                            fontWeight: 600,
                            color:
                              status === "P"
                                ? "#16A34A"
                                : status === "A"
                                ? "#DC2626"
                                : "#94A3B8",
                          }}
                        >
                          {status}
                        </td>
                      );
                    })}

                    <td style={tdStyle}>{totalPresent}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })()
      ) : (
        <p style={{ textAlign: "center", color: "#94A3B8" }}>
          Select From & To date to view attendance report
        </p>
      )}
    </div>
  );
}
 
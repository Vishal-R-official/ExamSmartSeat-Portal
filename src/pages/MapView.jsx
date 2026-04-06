import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Zap, AlertTriangle, ShieldCheck, Download, Printer, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import './MapView.css';

// ── Subject color palette ─────────────────────────────────────────────
const SUBJECT_COLORS = [
  { bg: '#1d4ed8', glow: '#3b82f6', text: '#fff' },
  { bg: '#047857', glow: '#10b981', text: '#fff' },
  { bg: '#7c3aed', glow: '#a78bfa', text: '#fff' },
  { bg: '#c2410c', glow: '#f97316', text: '#fff' },
  { bg: '#0e7490', glow: '#22d3ee', text: '#fff' },
  { bg: '#be185d', glow: '#ec4899', text: '#fff' },
  { bg: '#92400e', glow: '#fbbf24', text: '#fff' },
];

const getSubjectStyle = (subjectCode) => {
  if (!subjectCode) return null;
  const hash = subjectCode.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
};

// ── Build a readable subject legend from the active hall ─────────────
const buildLegend = (hallData) => {
  if (!hallData) return [];
  const map = {};
  for (const row of hallData.grid) {
    for (const table of row) {
      for (const seat of table.seats) {
        if (seat.student && !map[seat.student.subjectCode]) {
          map[seat.student.subjectCode] = getSubjectStyle(seat.student.subjectCode);
        }
      }
    }
  }
  return Object.entries(map).map(([code, style]) => ({ code, style }));
};

// ── Risk scanner for the active hall ─────────────────────────────────
const scanRisks = (hallData) => {
  if (!hallData) return [];
  const risks = [];
  const seen = new Set();
  const grid = hallData.grid;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const table = grid[r][c];
      // same-table adjacency
      for (let s = 0; s < table.seats.length - 1; s++) {
        const a = table.seats[s], b = table.seats[s + 1];
        if (a.student && b.student && a.student.subjectCode === b.student.subjectCode) {
          const key = [a.seatNumber, b.seatNumber].sort().join('|');
          if (!seen.has(key)) {
            seen.add(key);
            risks.push({ type: 'Same Table', subject: a.student.subjectCode, msg: `Table ${table.tableId}: adjacent same subject` });
          }
        }
      }
      // front-back
      if (r > 0) {
        const prev = grid[r - 1][c];
        for (let s = 0; s < table.seats.length; s++) {
          const a = table.seats[s], b = prev?.seats[s];
          if (a?.student && b?.student && a.student.subjectCode === b.student.subjectCode) {
            const key = [a.seatNumber, b.seatNumber].sort().join('|');
            if (!seen.has(key)) {
              seen.add(key);
              risks.push({ type: 'Front/Back', subject: a.student.subjectCode, msg: `Tables ${prev.tableId}↔${table.tableId}: same subject` });
            }
          }
        }
      }
    }
  }
  return risks;
};

const MapView = () => {
  const { seatingPlan, setSeatingPlan } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeHallIndex, setActiveHallIndex] = useState(0);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    setActiveHallIndex(0);
  }, [seatingPlan]);

  useEffect(() => {
    if (seatingPlan) {
      setRisks(scanRisks(seatingPlan.halls[activeHallIndex]));
    }
  }, [seatingPlan, activeHallIndex]);

  // ── Empty State ──────────────────────────────────────────────────────
  if (!seatingPlan) {
    return (
      <div className="mv-empty">
        <div className="mv-empty-icon"><Zap size={56} /></div>
        <h2>No Active Seating Plan</h2>
        <p>Generate a seating plan first from the Seating Generator to view the interactive classroom map.</p>
        <button className="btn-primary" onClick={() => navigate('/admin/seating-generator')}>
          Go to Generator
        </button>
      </div>
    );
  }

  const halls = seatingPlan.halls;
  const hall = halls[activeHallIndex];
  const legend = buildLegend(hall);

  const goLeft  = () => setActiveHallIndex(i => Math.max(0, i - 1));
  const goRight = () => setActiveHallIndex(i => Math.min(halls.length - 1, i + 1));

  const totalSeats = hall.hallInfo.capacity;
  const filledSeats = hall.studentsCount;
  const fillPct = Math.round((filledSeats / totalSeats) * 100);

  return (
    <div className="mv-page animate-fade-in">

      {/* ── Top Header ── */}
      <div className="mv-header glass-panel">
        <div className="mv-header-left">
          <h2 className="mv-plan-id">Plan #{seatingPlan.planId?.slice(-8)}</h2>
          <div className="mv-meta">
            <span className="mv-badge">{seatingPlan.date}</span>
            <span className="mv-badge">{seatingPlan.session === 'FN' ? 'Forenoon · 9:30 AM' : 'Afternoon · 1:30 PM'}</span>
            <span className="mv-badge mv-badge-accent">
              <Users size={12} /> {seatingPlan.totalStudentsAssigned} Students
            </span>
          </div>
        </div>
        <div className="mv-header-actions">
          <button className="btn-secondary" onClick={() => window.print()}><Printer size={16} /> Print</button>
          <button className="btn-secondary"><Download size={16} /> Export CSV</button>
        </div>
      </div>

      {/* ── Hall Tabs ── */}
      <div className="mv-hall-nav">
        <button className="mv-nav-arrow" onClick={goLeft} disabled={activeHallIndex === 0}>
          <ChevronLeft size={18} />
        </button>
        <div className="mv-hall-tabs">
          {halls.map((h, idx) => (
            <button
              key={h.hallInfo.hallNumber}
              className={`mv-hall-tab ${activeHallIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveHallIndex(idx)}
            >
              <span className="mv-hall-name">{h.hallInfo.hallNumber}</span>
              <span className="mv-hall-count">{h.studentsCount}/{h.hallInfo.capacity}</span>
            </button>
          ))}
        </div>
        <button className="mv-nav-arrow" onClick={goRight} disabled={activeHallIndex === halls.length - 1}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="mv-content">

        {/* ── Classroom Grid ── */}
        <div className="mv-classroom glass-panel">
          <div className="mv-board">
            <span>CHALKBOARD · FRONT OF CLASS</span>
          </div>

          <div className="mv-grid-scroll">
            <div className="mv-grid">
              {hall.grid.map((rowArr, rIdx) => (
                <div key={`row-${rIdx}`} className="mv-row">
                  <div className="mv-row-label">R{rIdx + 1}</div>
                  <div className="mv-desks">
                    {rowArr.map(table => (
                      <div key={table.tableId} className="mv-desk">
                        <div className="mv-desk-id">{table.tableId}</div>
                        <div className="mv-seats">
                          {table.seats.map(seat => {
                            const style = seat.student ? getSubjectStyle(seat.student.subjectCode) : null;
                            const isHovered = hoveredSeat === seat;
                            return (
                              <div
                                key={seat.seatNumber}
                                className={`mv-seat ${seat.student ? 'occupied' : 'empty'} ${isHovered ? 'hovered' : ''}`}
                                style={style ? {
                                  background: `linear-gradient(135deg, ${style.bg}, ${style.glow})`,
                                  boxShadow: isHovered ? `0 0 14px ${style.glow}88` : `0 2px 6px ${style.bg}55`,
                                  color: style.text,
                                } : {}}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                              >
                                {seat.student ? (
                                  <>
                                    <span className="mv-reg">{seat.student.registerNumber.slice(-4)}</span>
                                    <span className="mv-subj">{seat.student.subjectCode}</span>
                                  </>
                                ) : (
                                  <span className="mv-empty-label">—</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Hover Tooltip ── */}
          {hoveredSeat?.student && (
            <div className="mv-tooltip animate-fade-in">
              <div className="mv-tooltip-header">
                <div className="mv-tooltip-avatar"
                  style={{ background: `linear-gradient(135deg, ${getSubjectStyle(hoveredSeat.student.subjectCode).bg}, ${getSubjectStyle(hoveredSeat.student.subjectCode).glow})` }}>
                  {hoveredSeat.student.name.charAt(0)}
                </div>
                <div>
                  <p className="mv-tooltip-name">{hoveredSeat.student.name}</p>
                  <p className="mv-tooltip-reg">{hoveredSeat.student.registerNumber}</p>
                </div>
              </div>
              <div className="mv-tooltip-rows">
                <div className="mv-tooltip-row"><span>Subject</span><strong>{hoveredSeat.student.subjectCode}</strong></div>
                <div className="mv-tooltip-row"><span>Dept</span><strong>{hoveredSeat.student.department}</strong></div>
                <div className="mv-tooltip-row"><span>Year</span><strong>Year {hoveredSeat.student.year}</strong></div>
                <div className="mv-tooltip-row"><span>Seat</span><strong>{hoveredSeat.seatNumber}</strong></div>
              </div>
            </div>
          )}

          {/* ── Legend ── */}
          <div className="mv-legend">
            {legend.map(({ code, style }) => (
              <div key={code} className="mv-legend-item">
                <span className="mv-legend-dot" style={{ background: style.glow }} />
                <span>{code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Side Panel ── */}
        <div className="mv-side">

          {/* Hall Stats */}
          <div className="mv-panel glass-panel">
            <h3 className="mv-panel-title"><BookOpen size={16} /> Hall Stats</h3>
            <div className="mv-panel-stat">
              <span>Hall</span><strong>{hall.hallInfo.hallNumber}</strong>
            </div>
            <div className="mv-panel-stat">
              <span>Block</span><strong>{hall.hallInfo.blockName || '—'}</strong>
            </div>
            <div className="mv-panel-stat">
              <span>Capacity</span><strong>{totalSeats}</strong>
            </div>
            <div className="mv-panel-stat">
              <span>Seated</span><strong>{filledSeats}</strong>
            </div>
            <div className="mv-panel-stat">
              <span>Empty</span><strong>{totalSeats - filledSeats}</strong>
            </div>
            <div className="mv-fill-bar-wrap">
              <div className="mv-fill-bar"><div className="mv-fill-fill" style={{ width: `${fillPct}%` }} /></div>
              <span className="mv-fill-pct">{fillPct}% filled</span>
            </div>
          </div>

          {/* AI Risk Scanner */}
          <div className="mv-panel glass-panel">
            <h3 className="mv-panel-title">
              <ShieldCheck size={16} className={risks.length === 0 ? 'icon-green' : 'icon-warn'} />
              AI Risk Scanner
            </h3>
            {risks.length === 0 ? (
              <div className="mv-risk-clean">
                <div className="mv-pulse-ring"><ShieldCheck size={28} className="icon-green" /></div>
                <p className="mv-risk-ok">Seating Optimal</p>
                <p className="mv-risk-sub">No subject conflicts detected.</p>
              </div>
            ) : (
              <div className="mv-risks">
                <div className="mv-risk-header">
                  <AlertTriangle size={20} className="icon-warn" />
                  <div>
                    <p className="mv-risk-count">{risks.length} risks found</p>
                    <p className="mv-risk-sub">Same subject proximity</p>
                  </div>
                </div>
                <div className="mv-risk-list">
                  {risks.slice(0, 4).map((r, i) => (
                    <div key={i} className="mv-risk-item">
                      <span className="mv-risk-type">{r.type}</span>
                      <p className="mv-risk-msg">{r.msg}</p>
                    </div>
                  ))}
                  {risks.length > 4 && (
                    <p className="mv-risk-more">+{risks.length - 4} more conflicts…</p>
                  )}
                </div>
                <button className="btn-primary mv-fix-btn" onClick={() => setRisks([])}>
                  <Zap size={15} /> Auto-Fix
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MapView;

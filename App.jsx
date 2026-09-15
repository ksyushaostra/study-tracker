import React, { useState, useEffect } from 'react';

export default function StudyTracker() {
  const [tab, setTab] = useState('dashboard');
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('studyData');
    if (saved) {
      const data = JSON.parse(saved);
      setAssignments(data.assignments || []);
      setNotes(data.notes || []);
      setTimetable(data.timetable || []);
      setGrades(data.grades || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyData', JSON.stringify({ assignments, notes, timetable, grades }));
  }, [assignments, notes, timetable, grades]);

  const addAssignment = (e) => {
    e.preventDefault();
    setAssignments([...assignments, {
      id: Date.now(),
      module: e.target.module.value,
      title: e.target.title.value,
      deadline: e.target.deadline.value,
      progress: parseInt(e.target.progress.value) || 0
    }]);
    e.target.reset();
  };

  const updateAssignmentProgress = (id, progress) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, progress } : a));
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const addNote = (e) => {
    e.preventDefault();
    setNotes([...notes, {
      id: Date.now(),
      module: e.target.module.value,
      title: e.target.title.value,
      content: e.target.content.value,
      date: new Date().toLocaleDateString()
    }]);
    e.target.reset();
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const addTimetableEntry = (e) => {
    e.preventDefault();
    setTimetable([...timetable, {
      id: Date.now(),
      module: e.target.module.value,
      day: e.target.day.value,
      time: e.target.time.value,
      location: e.target.location.value
    }]);
    e.target.reset();
  };

  const deleteTimetableEntry = (id) => {
    setTimetable(timetable.filter(t => t.id !== id));
  };

  const addGrade = (e) => {
    e.preventDefault();
    setGrades([...grades, {
      id: Date.now(),
      module: e.target.module.value,
      assessment: e.target.assessment.value,
      grade: parseInt(e.target.grade.value),
      date: e.target.date.value
    }]);
    e.target.reset();
  };

  const deleteGrade = (id) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  const urgentAssignments = assignments.filter(a => daysUntil(a.deadline) <= 7 && daysUntil(a.deadline) > 0).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const avgGrade = grades.length ? Math.round(grades.reduce((s, g) => s + g.grade, 0) / grades.length) : 0;

  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        {['dashboard', 'assignments', 'timetable', 'notes', 'grades'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.75rem 1.5rem', background: tab === t ? '#0066cc' : 'transparent', color: tab === t ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: tab === t ? '600' : '400' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          <h2>Dashboard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
              <div style={{ color: '#999', marginBottom: '0.5rem' }}>Active assignments</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{assignments.length}</div>
            </div>
            <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
              <div style={{ color: '#999', marginBottom: '0.5rem' }}>Average grade</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{avgGrade}%</div>
            </div>
            <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
              <div style={{ color: '#999', marginBottom: '0.5rem' }}>Study notes</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{notes.length}</div>
            </div>
          </div>
          {urgentAssignments.length > 0 && (
            <div>
              <h3>Deadlines this week</h3>
              {urgentAssignments.map(a => (
                <div key={a.id} style={{ background: '#fff', padding: '1rem', borderLeft: '3px solid #d32f2f', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>{a.title}</div>
                  <div style={{ fontSize: '14px', color: '#999' }}>{a.module} - Due in {daysUntil(a.deadline)} days</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'assignments' && (
        <div>
          <h2>Assignments</h2>
          <form onSubmit={addAssignment} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <input name="module" placeholder="Module" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input name="title" placeholder="Title" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input name="deadline" type="date" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input name="progress" type="number" min="0" max="100" placeholder="Progress %" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <button type="submit" style={{ padding: '0.75rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
          </form>
          {assignments.map(a => (
            <div key={a.id} style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div><div style={{ fontWeight: '600' }}>{a.title}</div><div style={{ fontSize: '14px', color: '#999' }}>{a.module} - Due {a.deadline}</div></div>
                <button onClick={() => deleteAssignment(a.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>Delete</button>
              </div>
              <input type="range" min="0" max="100" value={a.progress} onChange={(e) => updateAssignmentProgress(a.id, parseInt(e.target.value))} style={{ width: '100%' }} />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '0.5rem' }}>{a.progress}% complete</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div>
          <h2>Notes</h2>
          <form onSubmit={addNote} style={{ marginBottom: '2rem' }}>
            <input name="module" placeholder="Module" required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input name="title" placeholder="Note title" required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <textarea name="content" placeholder="Your notes..." required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '150px', fontFamily: 'inherit' }} />
            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save note</button>
          </form>
          {notes.map(n => (
            <div key={n.id} style={{ background: '#f5f5f5', padding: '1.5rem', marginBottom: '1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div><div style={{ fontWeight: '600' }}>{n.title}</div><div style={{ fontSize: '14px', color: '#999' }}>{n.module} - {n.date}</div></div>
                <button onClick={() => deleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>Delete</button>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{n.content}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'timetable' && (
        <div>
          <h2>Timetable</h2>
          <form onSubmit={addTimetableEntry} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <input name="module" placeholder="Module" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <select name="day" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}>
              <option value="">Select day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input name="time" type="time" required style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <input name="location" placeholder="Location" style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            <button type="submit" style={{ padding: '0.75rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
          </form>
          {timetable.map(t => (
            <div key={t.id} style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontWeight: '600' }}>{t.module}</div><div style={{ fontSize: '14px', color: '#999'

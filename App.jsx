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
    localStorage.setItem('studyData', JSON.stringify({
      assignments,
      notes,
      timetable,
      grades
    }));
  }, [assignments, notes, timetable, grades]);

  const addAssignment = (e) => {
    e.preventDefault();
    const form = e.target;
    const newAssignment = {
      id: Date.now(),
      module: form.module.value,
      title: form.title.value,
      deadline: form.deadline.value,
      progress: parseInt(form.progress.value) || 0,
      status: 'in-progress'
    };
    setAssignments([...assignments, newAssignment]);
    form.reset();
  };

  const updateAssignmentProgress = (id, progress) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, progress: Math.min(100, progress) } : a
    ));
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const addNote = (e) => {
    e.preventDefault();
    const form = e.target;
    const newNote = {
      id: Date.now(),
      module: form.module.value,
      title: form.title.value,
      content: form.content.value,
      date: new Date().toLocaleDateString()
    };
    setNotes([...notes, newNote]);
    form.reset();
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const addTimetableEntry = (e) => {
    e.preventDefault();
    const form = e.target;
    const newEntry = {
      id: Date.now(),
      module: form.module.value,
      day: form.day.value,
      time: form.time.value,
      location: form.location.value
    };
    setTimetable([...timetable, newEntry]);
    form.reset();
  };

  const deleteTimetableEntry = (id) => {
    setTimetable(timetable.filter(t => t.id !== id));
  };

  const addGrade = (e) => {
    e.preventDefault();
    const form = e.target;
    const newGrade = {
      id: Date.now(),
      module: form.module.value,
      assessment: form.assessment.value,
      grade: parseInt(form.grade.value),
      date: form.date.value
    };
    setGrades([...grades, newGrade]);
    form.reset();
  };

  const deleteGrade = (id) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const daysUntil = (dateStr) => {
    const deadline = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const urgentAssignments = assignments
    .filter(a => daysUntil(a.deadline) <= 7 && daysUntil(a.deadline) > 0)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const avgGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length)
    : 0;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const styles = {
    container: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333',
      padding: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    },
    nav: {
      display: 'flex',
      gap: '1rem',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    navButton: (active) => ({
      padding: '0.75rem 1.5rem',
      border: 'none',
      background: active ? '#0066cc' : 'transparent',
      color: active ? 'white' : '#666',
      cursor: 'pointer',
      borderRadius: '6px',
      fontWeight: active ? '600' : '400',
      fontSize: '14px'
    }),
    card: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      marginBottom: '1rem'
    },
    heading: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#222'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      width: '100%',
      boxSizing: 'border-box'
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '14px'
    },
    buttonDanger: {
      padding: '0.5rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#d32f2f',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <div style={styles.nav}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'assignments', label: '📝 Assignments' },
          { id: 'timetable', label: '📅 Timetable' },
          { id: 'notes', label: '📖 Notes' },
          { id: 'grades', label: '⭐ Grades' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={styles.navButton(tab === item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div>
          <h2 style={styles.heading}>Your progress</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '0.5rem' }}>Active assignments</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{assignments.length}</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '0.5rem' }}>Average grade</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{avgGrade}%</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '0.5rem' }}>Study notes</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{notes.length}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Deadlines this week</h3>
            {urgentAssignments.length === 0 ? (
              <div style={{ color: '#999', fontSize: '14px' }}>No urgent deadlines</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {urgentAssignments.map(a => (
                  <div key={a.id} style={{...styles.card, borderLeft: '3px solid #d32f2f', paddingLeft: '1.2rem'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{a.title}</div>
                        <div style={{ fontSize: '13px', color: '#999' }}>{a.module} • Due in {daysUntil(a.deadline)} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{...styles.card, background: '#fffbf0', borderColor: '#ffd699'}}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.75rem', color: '#b8860b' }}>💡 Study tips</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
              <li>Break assignments into smaller chunks with mid-deadlines</li>
              <li>Review lecture notes within 24 hours (better retention)</li>
              <li>Study hardest subjects when you're most alert</li>
              <li>Take notes by hand—better for memory than typing</li>
              <li>Use active recall: test yourself, don't just re-read</li>
            </ul>
          </div>
        </div>
      )}

      {/* Assignments */}
      {tab === 'assignments' && (
        <div>
          <h2 style={styles.heading}>Assignments</h2>
          
          <form onSubmit={addAssignment} style={{...styles.card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <input name="module" placeholder="Module" required style={styles.input} />
            <input name="title" placeholder="Assignment title" required style={styles.input} />
            <input name="deadline" type="date" required style={styles.input} />
            <input name="progress" type="number" min="0" max="100" placeholder="Progress %" style={styles.input} />
            <button type="submit" style={styles.button}>Add assignment</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assignments.length === 0 ? (
              <div style={{ color: '#999', fontSize: '14px' }}>No assignments yet</div>
            ) : (
              assignments.map(a => (
                <div key={a.id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '0.25rem' }}>{a.title}</div>
                      <div style={{ fontSize: '13px', color: '#999' }}>{a.module} • Due {a.deadline} ({daysUntil(a.deadline)} days)</div>
                    </div>
                    <button onClick={() => deleteAssignment(a.id)} style={styles.buttonDanger}>🗑️</button>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.5rem' }}>
                      <span>Progress</span>
                      <span>{a.progress}%</span>
                    </div>
                    <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div style={{
                        background: '#4caf50',
                        height: '100%',
                        width: `${a.progress}%`,
                        transition: 'width 0.2s'
                      }}></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={a.progress}
                      onChange={(e) => updateAssignmentProgress(a.id, parseInt(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Timetable */}
      {tab === 'timetable' && (
        <div>
          <h2 style={styles.heading}>Timetable</h2>
          
          <form onSubmit={addTimetableEntry} style={{...styles.card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <input name="module" placeholder="Module" required style={styles.input} />
            <select name="day" required style={styles.input}>
              <option value="">Select day</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input name="time" type="time" required style={styles.input} />
            <input name="location" placeholder="Location" style={styles.input} />
            <button type="submit" style={styles.button}>Add class</button>
          </form>

          {timetable.length === 0 ? (
            <div style={{ color: '#999', fontSize: '14px' }}>No classes added yet</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {days.map(day => {
                const dayClasses = timetable.filter(t => t.day === day);
                return (
                  <div key={day} style={styles.card}>
                    <div style={{ fontWeight: '500', marginBottom: '1rem', fontSize: '15px' }}>{day}</div>
                    {dayClasses.length === 0 ? (
                      <div style={{ fontSize: '13px', color: '#999' }}>No classes</div>
                    ) : (
                      dayClasses.map(c => (
                        <div key={c.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                          <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '0.25rem' }}>{c.module}</div>
                          <div style={{ fontSize: '13px', color: '#999', marginBottom: '0.5rem' }}>{c.time} {c.location && `• ${c.location}`}</div>
                          <button
                            onClick={() => deleteTimetableEntry(c.id)}
                            style={{ fontSize: '12px', padding: '0.25rem 0.75rem', background: 'white', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {tab === 'notes' && (
        <div>
          <h2 style={styles.heading}>Study notes</h2>
          
          <form onSubmit={addNote} style={{...styles.card, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <input name="module" placeholder="Module" required style={styles.input} />
              <input name="title" placeholder="Note title" required style={styles.input} />
            </div>
            <textarea name="content" placeholder="Your notes..." required style={{...styles.input, minHeight: '120px', fontFamily: 'inherit', resize: 'vertical'}}></textarea>
            <button type="submit" style={{...styles.button, alignSelf: 'start'}}>Save note</button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {notes.length === 0 ? (
              <div style={{ color: '#999', fontSize: '14px' }}>No notes yet</div>
            ) : (
              notes.map(n => (
                <div key={n.id} style={{...styles.card, display: 'flex', flexDirection: 'column'}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '0.25rem' }}>{n.title}</div>
                      <div style={{ fontSize: '13px', color: '#999' }}>{n.module}</div>
                    </div>
                    <button onClick={() => deleteNote(n.id)} style={styles.buttonDanger}>🗑️</button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#999', marginBottom: '0.75rem' }}>{n.date}</div>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{n.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Grades */}
      {tab === 'grades' && (
        <div>
          <h2 style={styles.heading}>Grade tracker</h2>
          
          <form onSubmit={addGrade} style={{...styles.card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <input name="module" placeholder="Module" required style={styles.input} />
            <input name="assessment" placeholder="Assessment type" required style={styles.input} />
            <input name="grade" type="number" min="0" max="100" placeholder="Grade %" required style={styles.input} />
            <input name="date" type="date" required style={styles.input} />
            <button type="submit" style={styles.button}>Log grade</button>
          </form>

          {grades.length === 0 ? (
            <div style={{ color: '#999', fontSize: '14px' }}>No grades logged yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {grades.map(g => (
                <div key={g.id} style={{...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '0.25rem' }}>{g.module}</div>
                    <div style={{ fontSize: '13px', color: '#999' }}>{g.assessment} • {g.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: g.grade >= 70 ? '#4caf50' : g.grade >= 60 ? '#ff9800' : '#d32f2f'
                    }}>
                      {g.grade}%
                    </div>
                    <button onClick={() => deleteGrade(g.id)} style={styles.buttonDanger}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

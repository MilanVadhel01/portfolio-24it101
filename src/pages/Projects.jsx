import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { getTasks, createTask, updateTask, deleteTask, generateTaskDescription } from '../api';

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // 'Creating task...', 'Updating task...', 'Deleting task...'
  const [toastMsg, setToastMsg] = useState('');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // AI state (Practical 13)
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiNotice, setAiNotice] = useState(null); // { type: 'success' | 'fallback', text }

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Practical 13 — ask the backend for an AI description suggestion.
  // The generated text only fills the textarea; the user must still
  // review it and submit the form before anything is saved.
  const handleGenerateDescription = async () => {
    const title = newTitle.trim();
    if (!title || aiLoading) return; // button is disabled in this case

    setAiLoading(true);
    setAiNotice(null);
    try {
      const result = await generateTaskDescription(title);
      if (result.description) {
        setNewDesc(result.description);
        setAiGenerated(true);
        setAiNotice({ type: 'success', text: 'Description generated. Review and edit it before saving.' });
      } else {
        setAiNotice({
          type: 'fallback',
          text: result.message || 'AI suggestions are temporarily unavailable. Please enter your task description manually.'
        });
      }
    } catch (err) {
      console.error(err);
      setAiNotice({
        type: 'fallback',
        text: 'AI suggestions are temporarily unavailable. Please enter your task description manually.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setActionLoading('Creating task...');
    setError(null);
    try {
      const newTask = await createTask({ title: newTitle, description: newDesc });
      setTasks([...tasks, newTask]);
      setNewTitle('');
      setNewDesc('');
      setAiGenerated(false);
      setAiNotice(null);
      showToast('Task created successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to create task.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    setActionLoading('Updating task...');
    setError(null);
    try {
      const updatedTask = await updateTask(id, updatedData);
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      showToast('Task updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTask = async (id) => {
    setActionLoading('Deleting task...');
    setError(null);
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      showToast('Task deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <p className="page-subtitle">Manage your practical tasks using Express & MongoDB.</p>
      </div>

      <div className="repo-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add New Task</h2>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text"
            className="search-input" 
            style={{ padding: '0.75rem', paddingLeft: '1rem' }}
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            className="search-input" 
            style={{ padding: '0.75rem', paddingLeft: '1rem', minHeight: '80px', borderRadius: '0.5rem' }}
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          {/* Practical 13 — AI description suggestion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerateDescription}
              disabled={!newTitle.trim() || aiLoading}
              style={{
                opacity: (!newTitle.trim() || aiLoading) ? 0.6 : 1,
                cursor: (!newTitle.trim() || aiLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {aiLoading ? 'Generating...' : 'Generate Description'}
            </button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {aiLoading ? 'Contacting the AI service...' : 'Uses the task title to suggest a description.'}
            </span>
          </div>

          {aiNotice && (
            <p
              role="status"
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: aiNotice.type === 'success' ? 'var(--primary-color)' : '#b45309'
              }}
            >
              {aiNotice.text}
            </p>
          )}

          {aiGenerated && (
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              AI-generated suggestion. Please review and edit before saving.
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={!!actionLoading}>
            Add Task
          </button>
        </form>
      </div>

      {actionLoading && (
        <div style={{ backgroundColor: '#eff6ff', color: '#1e40af', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          {actionLoading}
        </div>
      )}

      {error && !loading && (
        <div className="state-container" style={{ padding: '2rem' }}>
          <svg className="state-icon" style={{ color: '#ef4444' }} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="state-text" style={{ color: '#ef4444' }}>{error}</p>
          <button className="btn-primary" onClick={fetchTasks}>Retry Fetching Tasks</button>
        </div>
      )}

      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p className="state-text">Loading tasks...</p>
        </div>
      )}

      {!loading && tasks.length === 0 && !error && (
        <div className="state-container">
          <p className="state-text">No tasks found. Create one above!</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="repo-list">
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onUpdate={handleUpdateTask} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      )}

      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981', // Tailwind emerald-500
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 1000,
          fontWeight: 500,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default Projects;
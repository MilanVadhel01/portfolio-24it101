import { useState } from 'react';

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const handleUpdate = () => {
    onUpdate(task._id, {
      title: editTitle,
      description: editDesc,
      completed: isCompleted
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    onUpdate(task._id, {
      ...task,
      completed: newStatus
    });
  };

  if (isEditing) {
    return (
      <div className="repo-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          className="search-input" 
          style={{ padding: '0.75rem', paddingLeft: '1rem' }}
          value={editTitle} 
          onChange={e => setEditTitle(e.target.value)} 
          placeholder="Task Title"
        />
        <textarea 
          className="search-input" 
          style={{ padding: '0.75rem', paddingLeft: '1rem', minHeight: '80px', borderRadius: '0.5rem' }}
          value={editDesc} 
          onChange={e => setEditDesc(e.target.value)} 
          placeholder="Task Description"
        />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={isCompleted} onChange={e => setIsCompleted(e.target.checked)} />
            Completed
          </label>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleUpdate}>Save</button>
          <button className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="repo-card" style={{ opacity: task.completed ? 0.7 : 1 }}>
      <div className="repo-header">
        <h3 className="repo-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ef4444' }} onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
      <p className="repo-desc" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.description || 'No description provided.'}
      </p>
      <div className="repo-meta">
        <label className="meta-item" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={task.completed} onChange={handleToggleComplete} />
          {task.completed ? 'Completed' : 'Pending'}
        </label>
        <span className="meta-item">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;

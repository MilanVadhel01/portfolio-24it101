const BASE_URL = "http://localhost:5000";

export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return response.json();
};

export const updateTask = async (id, taskData) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
};

// Practical 13 — ask OUR backend for an AI description.
// The browser never talks to OpenRouter and never sees the API key.
export const generateTaskDescription = async (title) => {
    const response = await fetch(`${BASE_URL}/api/ai/generate-description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    // The backend always answers with JSON, including fallbacks
    const data = await response.json().catch(() => ({}));

    if (!response.ok && !data.fallback) {
        throw new Error(data.error || 'Failed to generate description');
    }

    return {
        description: data.description || '',
        fallback: Boolean(data.fallback),
        message: data.message || ''
    };
};

const API_URL = '/api';

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        console.log('Fetched todos:', todos);
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        showError('Failed to load todos');
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="${todo.completed ? 'completed' : ''}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo('${todo._id}', this.checked)">
                <span>${todo.text}</span>
            </div>
            <div>
                <button onclick="editTodo('${todo._id}', '${todo.text}')">Edit</button>
                <button onclick="deleteTodo('${todo._id}')">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) {
        showError('Please enter a todo item');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add todo');
        }
        
        const data = await response.json();
        console.log('Added todo:', data);
        input.value = '';
        fetchTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
        showError(error.message);
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            throw new Error('Failed to update todo');
        }

        fetchTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
        showError('Failed to update todo');
    }
}

async function editTodo(id, currentText) {
    const newText = prompt('Edit todo:', currentText);
    if (!newText || newText === currentText) return;
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newText })
        });

        if (!response.ok) {
            throw new Error('Failed to update todo');
        }

        fetchTodos();
    } catch (error) {
        console.error('Error editing todo:', error);
        showError('Failed to update todo');
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }

        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
        showError('Failed to delete todo');
    }
}

// Initial load
fetchTodos();

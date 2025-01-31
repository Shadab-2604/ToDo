const API_URL = '/api';

// Fetch all todos
async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Display todos in the list
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

// Add new todo
async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (response.ok) {
            input.value = '';
            fetchTodos();
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

// Toggle todo completion status
async function toggleTodo(id, completed) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        fetchTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

// Edit todo
async function editTodo(id, currentText) {
    const newText = prompt('Edit todo:', currentText);
    if (!newText || newText === currentText) return;
    
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newText })
        });
        fetchTodos();
    } catch (error) {
        console.error('Error editing todo:', error);
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Initial load
fetchTodos();
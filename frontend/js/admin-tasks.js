const baseURL = 'http://localhost:3000';

// Create a new task
document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    deadline: document.getElementById('deadline').value
  };

  const res = await fetch(`${baseURL}/tasks/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });

  const data = await res.json();
  alert(`Task Created with ID: ${data.taskId}`);
  loadTasks();
});

// Assign task to interns
document.getElementById('assignForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task_id = document.getElementById('task_id').value;
  const intern_ids = document.getElementById('intern_ids').value.split(',').map(id => parseInt(id));

  const res = await fetch(`${baseURL}/tasks/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id, intern_ids })
  });

  const data = await res.json();
  alert(data.message);
});

// Load all tasks
async function loadTasks() {
  const res = await fetch(`${baseURL}/tasks/admin`);
  const tasks = await res.json();

  const taskList = document.getElementById('taskList');
  taskList.innerHTML = tasks.map(task => `
    <div>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Deadline: ${task.deadline}</p>
      <p>ID: ${task.id}</p>
    </div>
  `).join('');
}

loadTasks();

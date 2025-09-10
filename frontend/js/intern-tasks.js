const baseURL = 'http://localhost:3000';

async function loadInternTasks() {
  const internId = document.getElementById('internId').value;
  const res = await fetch(`${baseURL}/tasks/intern/${internId}`);
  const tasks = await res.json();

  const container = document.getElementById('internTaskList');
  container.innerHTML = '';

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Deadline: ${task.deadline}</p>
      <p>Status: ${task.status}</p>
      <p>Feedback: ${task.feedback || 'N/A'}</p>
      <form onsubmit="submitTask(event, ${task.id}, ${internId})" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <button type="submit">Upload Submission</button>
      </form>
    `;
    container.appendChild(div);
  });
}

async function submitTask(e, taskId, internId) {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.append('intern_id', internId);

  const res = await fetch(`${baseURL}/tasks/submit/${taskId}`, {
    method: 'POST',
    body: formData
  });

  const result = await res.json();
  alert(result.message);
  loadInternTasks(); // refresh
}

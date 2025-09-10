const baseURL = 'http://localhost:3000'; // Update if using deployed backend

// Add Intern
document.getElementById('addInternForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    department: document.getElementById('department').value,
    start_date: document.getElementById('start_date').value,
    end_date: document.getElementById('end_date').value
  };

  const res = await fetch(`${baseURL}/interns/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  fetchInterns();
});

// Fetch Interns (All or Search)
async function fetchInterns() {
  const query = document.getElementById('searchQuery').value;
  const status = document.getElementById('statusFilter').value;

  const res = await fetch(`${baseURL}/interns/search?q=${query}&status=${status}`);
  const interns = await res.json();

  const table = document.getElementById('internTableBody');
  table.innerHTML = '';

  interns.forEach(intern => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${intern.name}</td>
      <td>${intern.email}</td>
      <td>${intern.department}</td>
      <td>${intern.start_date?.split('T')[0]}</td>
      <td>${intern.end_date?.split('T')[0]}</td>
      <td>${intern.status}</td>
      <td>
        <button onclick="toggleStatus(${intern.id}, '${intern.status}')">
          ${intern.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Toggle Intern Status
async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

  await fetch(`${baseURL}/interns/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });

  fetchInterns();
}

// Initial load
fetchInterns();

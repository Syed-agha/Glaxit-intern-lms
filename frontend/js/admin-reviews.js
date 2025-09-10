const API_BASE = "http://localhost:3000";

// Protect page for admin only
protectPage("admin");

async function loadSubmissions() {
  const res = await fetch(`${API_BASE}/admin/submissions`);
  const subs = await res.json();

  const list = document.getElementById("submissionsList");
  list.innerHTML = subs.map(s => `
    <div style="border:1px solid #ccc; margin:10px; padding:10px;">
      <strong>${s.intern_name}</strong> - ${s.task_title} <br>
      Submitted: ${new Date(s.submission_date).toLocaleString()} <br>
      File: <a href="${API_BASE}/uploads/${s.file_path}" target="_blank">Download</a><br>
      Status: ${s.status}
      <textarea id="feedback-${s.id}" placeholder="Enter feedback here...">${s.feedback || ''}</textarea>
      <button onclick="markReviewed(${s.id})">Mark Reviewed</button>
      <button onclick="awardBadge(${s.intern_id}, 'High-Quality Submission')">Award Badge</button>
    </div>
  `).join('');
}

async function markReviewed(submissionId) {
  const feedback = document.getElementById(`feedback-${submissionId}`).value;
  await fetch(`${API_BASE}/admin/submissions/${submissionId}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedback })
  });
  loadSubmissions();
}

async function awardBadge(internId, badgeType) {
  await fetch(`${API_BASE}/badges/award`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ internId, badgeType })
  });
  alert(`Badge "${badgeType}" awarded!`);
}

loadSubmissions();

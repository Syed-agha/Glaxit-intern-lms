const internId = 1; // Replace with actual

async function loadProgress() {
  const res = await fetch(`http://localhost:3000/progress/${internId}`);
  const data = await res.json();

  new Chart(document.getElementById("progressRadar"), {
    type: 'radar',
    data: {
      labels: ["Timeliness", "Quality", "Completion"],
      datasets: [{
        label: "Performance",
        data: [
          data.timeliness_score,
          data.quality_score,
          data.completion_rate
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      }]
    }
  });
}

async function loadBadges() {
  const res = await fetch(`http://localhost:3000/badges/${internId}`);
  const badges = await res.json();

  const list = document.getElementById('badgeList');
  list.innerHTML = badges.map(b => `
    <div style="border: 1px solid #ccc; margin: 10px; padding: 5px;">
      🏅 <b>${b.badge_type}</b> — ${new Date(b.awarded_at).toLocaleDateString()}
    </div>
  `).join('');
}

loadProgress();
loadBadges();

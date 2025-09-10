async function loadProgressChart(internId) {
    try {
        const res = await fetch(`/api/progress/${internId}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load progress");

        const data = await res.json();

        const ctx = document.getElementById("progressRadar").getContext("2d");
        new Chart(ctx, {
            type: "radar",
            data: {
                labels: ["Timeliness", "Task Quality", "Completion Rate"],
                datasets: [{
                    label: "Performance",
                    data: [data.timeliness, data.quality, data.completionRate],
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    pointBackgroundColor: "rgba(54, 162, 235, 1)"
                }]
            },
            options: {
                scale: {
                    ticks: { beginAtZero: true, max: 100 }
                }
            }
        });

    } catch (err) {
        console.error(err);
    }
}

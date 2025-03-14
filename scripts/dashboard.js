
const ctx = document.getElementById("salesChart").getContext("2d");

new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "Sales ($)",
            data: [120, 150, 180, 200, 170, 210, 300],
            backgroundColor: "#1877f2",
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

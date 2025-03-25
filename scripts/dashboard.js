
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
        console.log("Navbar loaded");
    })
    .catch(error => console.error("Error loading navbar:", error));

const API_BASE_URL = "http://localhost:5004";

async function loadDashboardStats() {
    try {
        // Fetch total products
        const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
        if (!productsResponse.ok) {
            const errorText = await productsResponse.text();
            throw new Error(`Failed to fetch products: ${productsResponse.status} - ${errorText}`);
        }
        const products = await productsResponse.json();
        document.getElementById("total-products").textContent = products.length || 0;

        // Fetch total suppliers
        const suppliersResponse = await fetch(`${API_BASE_URL}/api/suppliers`);
        if (!suppliersResponse.ok) {
            const errorText = await suppliersResponse.text();
            throw new Error(`Failed to fetch suppliers: ${suppliersResponse.status} - ${errorText}`);
        }
        const suppliers = await suppliersResponse.json();
        document.getElementById("total-suppliers").textContent = suppliers.length || 0;

        // Fetch total sales (last 7 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7); // Last 7 days
        const salesResponse = await fetch(
            `${API_BASE_URL}/api/sales/report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        if (!salesResponse.ok) {
            const errorText = await salesResponse.text();
            throw new Error(`Failed to fetch sales report: ${salesResponse.status} - ${errorText}`);
        }
        const salesData = await salesResponse.json();
        document.getElementById("total-sales").textContent = salesData.totalSales 
            ? `$${parseFloat(salesData.totalSales).toFixed(2)}` 
            : "$0.00";

        // Update the chart with sales data
        updateSalesChart(salesData);
    } catch (error) {
        console.error("Error loading dashboard stats:", error.message);
        // Optionally display an error message on the UI
        document.getElementById("total-products").textContent = "Error";
        document.getElementById("total-suppliers").textContent = "Error";
        document.getElementById("total-sales").textContent = "Error";
    }
}

// Function to update the sales chart
function updateSalesChart(salesData) {
    const ctx = document.getElementById("salesChart").getContext("2d");

    // Prepare chart data from sales report
    const productBreakdown = salesData.productBreakdown || [];
    const labels = productBreakdown.map(item => item.productName) || ["No Data"];
    const data = productBreakdown.map(item => parseFloat(item.totalAmount)) || [0];

    // Destroy any existing chart instance to avoid overlap
    if (window.salesChart && typeof window.salesChart.destroy === "function") {
        window.salesChart.destroy();
    }

    // Create new chart
    window.salesChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: "Sales ($)",
                data: data.length ? data : [0],
                backgroundColor: "#1877f2",
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Sales Amount ($)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Products"
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top"
                }
            }
        }
    });
}

// Load the dashboard stats when the page loads
window.addEventListener("DOMContentLoaded", loadDashboardStats);
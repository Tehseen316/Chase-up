fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            console.log("Navbar loaded");
        })
        .catch(error => console.error("Error loading navbar:", error));

        document.addEventListener("DOMContentLoaded", async () => {
            const stockList = document.getElementById("stock-list");
            const API_BASE_URL = "http://localhost:5004/api/products"; // Adjust if needed
        
            // Fetch products from API
            const fetchLowStockProducts = async () => {
                try {
                    const response = await fetch(API_BASE_URL);
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
                    const products = await response.json();
        
                    // Filter products where quantityInStock is less than minStockLevel
                    const lowStockProducts = products.filter(product => product.quantityInStock < product.minStockLevel);
        
                    // Display low stock products
                    displayLowStockProducts(lowStockProducts);
                } catch (error) {
                    console.error("Error fetching stock data:", error);
                }
            };
        
            // Populate table with low stock products
            const displayLowStockProducts = (products) => {
                stockList.innerHTML = ""; // Clear table before adding new data
        
                if (products.length === 0) {
                    stockList.innerHTML = `<tr><td colspan="3">All stocks are sufficient ✅</td></tr>`;
                    return;
                }
        
                products.forEach(product => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.quantityInStock}</td>
                        <td><a href="products.html" class="btn-reorder">Reorder</a></td>
                    `;
                    stockList.appendChild(row);
                });
            };
        
            // Fetch and display low stock products on page load
            fetchLowStockProducts();
        });
        
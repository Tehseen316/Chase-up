fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            console.log("Navbar loaded");
        })
        .catch(error => console.error("Error loading navbar:", error));
        
        const API_BASE_URL = "http://localhost:5004/api/products"; // Corrected API URL

        document.addEventListener("DOMContentLoaded", () => {
            const API_BASE_URL = "http://localhost:5004/api/products";
            const productList = document.getElementById("product-list");
            const productForm = document.getElementById("product-form");
        
            // Fetch products from backend
            const fetchProducts = async () => {
                try {
                    const response = await fetch(API_BASE_URL);
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
                    const products = await response.json();
                    productList.innerHTML = ""; // Clear previous list
                    console.log(products);
        
                    products.forEach(product => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${product.name}</td>
                            <td>$${product.price}</td>
                            <td>${Number(product.quantityInStock) || "N/A"}</td> 
                            <td>${product.category}</td>
                            <td>
                                <button class="delete-btn" data-id="${product.id}">🗑 Delete</button>
                            </td>
                        `;
                        productList.appendChild(row);
                    });
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
        
            // Add new product
            productForm.addEventListener("submit", async (e) => {
                e.preventDefault();
        
                const name = document.getElementById("name").value;
                const price = parseFloat(document.getElementById("price").value);
                const quantityInStock = parseInt(document.getElementById("stock").value);
                const category = document.getElementById("category").value;
        
                const newProduct = { name, price, quantityInStock, category };
        
                try {
                    const response = await fetch(API_BASE_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newProduct),
                    });
        
                    if (!response.ok) {
                        const data = await response.json();
                        alert(data.error || "Failed to add product");
                        return;
                    }
        
                    fetchProducts(); // Refresh product list
                    productForm.reset();
                } catch (error) {
                    console.error("Error adding product:", error);
                }
            });
        
            // Delete product
            productList.addEventListener("click", async (e) => {
                if (e.target.classList.contains("delete-btn")) {
                    const id = e.target.getAttribute("data-id");
        
                    try {
                        const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
                        if (!response.ok) {
                            alert("Failed to delete product");
                            return;
                        }
        
                        fetchProducts(); // Refresh product list
                    } catch (error) {
                        console.error("Error deleting product:", error);
                    }
                }
            });
        
            fetchProducts(); // Load products initially
        });


        
        
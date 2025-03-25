

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const productList = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");
    const productIdInput = document.getElementById("product-id");
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const stockInput = document.getElementById("stock");
    const categoryInput = document.getElementById("category");
    const searchInput = document.getElementById("search-product");
    const cancelEditBtn = document.getElementById("cancel-edit");

    // API Configuration
    const API_BASE_URL = "http://localhost:5004/api/products";

    
    fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
        console.log("Navbar loaded");
    })
    .catch(error => console.error("Error loading navbar:", error));

    // Fetch all products
    const fetchProducts = async () => {
        try {
            productList.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            productList.innerHTML = "<tr><td colspan='5'>Error loading products</td></tr>";
        }
    };

    // Render products to the table
    const renderProducts = (products) => {
        productList.innerHTML = "";
        
        if (products.length === 0) {
            productList.innerHTML = "<tr><td colspan='5'>No products found</td></tr>";
            return;
        }

        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${Number(product.quantityInStock)}</td>
                <td>${product.category}</td>
                <td>
                    <button class="delete-btn" data-id="${product.id}">🗑 Delete</button>
                </td>
            `;
            productList.appendChild(row);
        });
    };

    // Handle form submission (add/edit)
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = productIdInput.value;
        const product = {
            name: nameInput.value,
            price: parseFloat(priceInput.value),
            quantityInStock: parseInt(stockInput.value),
            category: categoryInput.value
        };

        if (product.price < 0 || product.quantityInStock < 0) {
            alert("Price and stock cannot be negative");
            return;
        }

        try {
            const response = await fetch(id ? `${API_BASE_URL}/${id}` : API_BASE_URL, {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `Failed to ${id ? "update" : "add"} product`);
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error(`Error ${id ? "updating" : "adding"} product:`, error);
            alert(error.message || "An error occurred. Please try again.");
        }
    });

    // Reset form to add new product
    const resetForm = () => {
        productForm.reset();
        productIdInput.value = "";
        cancelEditBtn.style.display = "none";
        productForm.querySelector('button[type="submit"]').textContent = "Save Product";
    };

    // Cancel edit mode
    cancelEditBtn.addEventListener("click", resetForm);

    // Handle edit button click
    productList.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        
        if (e.target.classList.contains("edit-btn") && id) {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const product = await response.json();
                
                // Fill form with product data
                productIdInput.value = product.id;
                nameInput.value = product.name;
                priceInput.value = product.price;
                stockInput.value = product.quantityInStock;
                categoryInput.value = product.category;
                
                // Change UI to edit mode
                cancelEditBtn.style.display = "inline-block";
                productForm.querySelector('button[type="submit"]').textContent = "Update Product";
                
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Failed to load product data");
            }
        }
        
        if (e.target.classList.contains("delete-btn") && id) {
            if (confirm("Are you sure you want to delete this product?")) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${id}`, {
                        method: "DELETE"
                    });
                    
                    if (!response.ok) throw new Error("Delete failed");
                    
                    fetchProducts();
                } catch (error) {
                    console.error("Error deleting product:", error);
                    alert("Failed to delete product");
                }
            }
        }
    });

    // Search functionality
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = productList.getElementsByTagName("tr");

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName("td");
            const shouldShow = Array.from(cells).some(cell => 
                cell.textContent.toLowerCase().includes(searchTerm)
            );
            row.style.display = shouldShow ? "" : "none";
        });
    });

    // Initialize
    fetchProducts();
});

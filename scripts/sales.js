// Load Navbar
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
        console.log("Navbar loaded");
    })
    .catch(error => console.error("Error loading navbar:", error));

document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('product-name');
    const quantityInput = document.getElementById('quantity');
    const totalPriceInput = document.getElementById('total-price');
    const stockInfoDiv = document.getElementById('stock-info');
    const addSaleBtn = document.getElementById('add-sale-btn');
    const salesForm = document.getElementById('sales-form');
    const reportDetailsContainer = document.getElementById('report-details');

    let currentProducts = [];

    // Fetch and populate products
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5004/api/products'); // Ensure this URL is correct
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            currentProducts = await response.json();
    
            // Clear existing options
            productSelect.innerHTML = '<option value="">Select Product</option>';
    
            // Populate product dropdown
            currentProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.dataset.price = product.price;
                option.dataset.stock = product.quantityInStock;
                option.textContent = `${product.name} - $${product.price} (${product.quantityInStock} in stock)`;
                productSelect.appendChild(option);
            });
    
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please refresh the page.');
        }
    }
    

    // Calculate total price and validate stock
    function calculateTotalPrice() {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        
        if (!selectedOption || selectedOption.value === '') {
            totalPriceInput.value = '';
            stockInfoDiv.textContent = '';
            addSaleBtn.disabled = true;
            return;
        }

        const price = parseFloat(selectedOption.dataset.price);
        const stockQuantity = parseInt(selectedOption.dataset.stock);
        const quantity = parseInt(quantityInput.value) || 0;
        const totalPrice = price * quantity;
        
        totalPriceInput.value = totalPrice.toFixed(2);

        // Stock validation
        if (quantity > stockQuantity) {
            stockInfoDiv.textContent = `Insufficient stock! Only ${stockQuantity} available.`;
            stockInfoDiv.style.color = 'red';
            addSaleBtn.disabled = true;
        } else if (quantity > 0) {
            stockInfoDiv.textContent = `Available stock: ${stockQuantity}`;
            stockInfoDiv.style.color = 'green';
            addSaleBtn.disabled = false;
        } else {
            stockInfoDiv.textContent = '';
            addSaleBtn.disabled = true;
        }
    }

    // Event listeners
    productSelect.addEventListener('change', calculateTotalPrice);
    quantityInput.addEventListener('input', calculateTotalPrice);

    // Sales Form Submission
    // Sales Form Submission
salesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedOption = productSelect.options[productSelect.selectedIndex];
    
    if (!selectedOption || selectedOption.value === '') {
        alert('Please select a product');
        return;
    }

    const saleData = {
        productId: selectedOption.value,
        productName: selectedOption.textContent.split(' - ')[0],
        quantity: parseInt(quantityInput.value),
        unitPrice: parseFloat(selectedOption.dataset.price),
        totalAmount: parseFloat(totalPriceInput.value),
        saleDate: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:5004/api/sales', {  // Ensure the URL is correct
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saleData)
        });

        if (!response.ok) {  // Properly check if response is valid
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.message}`);
        }

        alert('Sale recorded successfully!');
        salesForm.reset();
        calculateTotalPrice();
        fetchProducts(); // Refresh product list to update stock

    } catch (error) {
        console.error('Error recording sale:', error);
        alert('Failed to record sale. Please try again.');
    }
});


    // Generate Sales Report
    const generateReportBtn = document.getElementById('generate-report');
    generateReportBtn.addEventListener('click', async () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
    
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5004/api/sales/report?startDate=${startDate}&endDate=${endDate}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }
    
            const reportData = await response.json();
            displaySalesReport(reportData);
            
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        }
    });
    

    // Display Sales Report
    function displaySalesReport(reportData) {
        if (!reportData || !reportData.totalSales) {
            reportDetailsContainer.innerHTML = '<p>No sales found for the selected period.</p>';
            return;
        }

        const reportHTML = `
            <p><strong>Total Sales Period:</strong> ${reportData.startDate} to ${reportData.endDate}</p>
            <p><strong>Total Sales:</strong> $${reportData.totalSales.toFixed(2)}</p>
            <p><strong>Total Items Sold:</strong> ${reportData.totalItemsSold}</p>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.productBreakdown.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.totalAmount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        reportDetailsContainer.innerHTML = reportHTML;
    }

    // Initial product fetch
    fetchProducts();
});
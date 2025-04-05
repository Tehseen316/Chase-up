document.addEventListener('DOMContentLoaded', () => {
    const supplierForm = document.getElementById('supplier-form');
    const supplierList = document.getElementById('supplier-list');
    const searchInput = document.getElementById('search-supplier');

    // Fetch and load suppliers
    const loadSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:5004/api/suppliers/');
            const suppliers = await response.json();
            
            // Clear existing rows
            supplierList.innerHTML = '';
            
            // Populate table with suppliers
            suppliers.forEach(supplier => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${supplier.name}</td>
                    <td>${supplier.contact}</td>
                    <td>${supplier.productsSupplied}</td>
                    <td>
                        <button class="edit-btn" data-id="${supplier.id}">Edit</button>
                        <button class="delete-btn" data-id="${supplier.id}">Delete</button>
                    </td>
                `;
                supplierList.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', handleDelete);
            });
        } catch (error) {
            console.error('Error loading suppliers:', error);
        }
    };

    // Add new supplier
    supplierForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('supplier-name').value;
        const contact = document.getElementById('supplier-contact').value;
        const productsSupplied = document.getElementById('supplier-products').value;

        try {
            const response = await fetch('http://localhost:5004/api/suppliers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, contact, productsSupplied })
            });

            if (response.ok) {
                // Reset form
                supplierForm.reset();
                // Reload suppliers
                loadSuppliers();
            } else {
                const errorData = await response.json();
                alert(`Error adding supplier: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = supplierList.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            const shouldShow = Array.from(cells).some(cell => 
                cell.textContent.toLowerCase().includes(searchTerm)
            );
            row.style.display = shouldShow ? '' : 'none';
        });
    });

    // Edit supplier
    const handleEdit = async (e) => {
        const supplierId = e.target.dataset.id;
        const row = e.target.closest('tr');
        
        // Get current values
        const [nameCell, contactCell, productsCell] = row.getElementsByTagName('td');

        // Create input fields
        nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
        contactCell.innerHTML = `<input type="text" value="${contactCell.textContent}">`;
        productsCell.innerHTML = `<input type="text" value="${productsCell.textContent}">`;

        // Replace edit button with save button
        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="save-btn" data-id="${supplierId}">Save</button>
            <button class="cancel-btn">Cancel</button>
        `;

        // Add save event listener
        row.querySelector('.save-btn').addEventListener('click', async () => {
            const newName = nameCell.querySelector('input').value;
            const newContact = contactCell.querySelector('input').value;
            const newProducts = productsCell.querySelector('input').value;

            try {
                const response = await fetch(`http://localhost:5004/api/suppliers/${supplierId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: newName, 
                        contact: newContact, 
                        productsSupplied: newProducts 
                    })
                });

                if (response.ok) {
                    loadSuppliers();
                } else {
                    const errorData = await response.json();
                    alert(`Error updating supplier: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error updating supplier:', error);
            }
        });

        // Add cancel event listener
        row.querySelector('.cancel-btn').addEventListener('click', loadSuppliers);
    };

    // Delete supplier
    const handleDelete = async (e) => {
        const supplierId = e.target.dataset.id;
        
        if (!confirm('Are you sure you want to delete this supplier?')) return;

        try {
            const response = await fetch(`http://localhost:5004/api/suppliers/${supplierId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadSuppliers();
            } else {
                const errorData = await response.json();
                alert(`Error deleting supplier: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    // Load suppliers on page load
    loadSuppliers();

    // Navbar loading (keeping the existing code)
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            console.log("Navbar loaded");
        })
        .catch(error => console.error("Error loading navbar:", error));
});
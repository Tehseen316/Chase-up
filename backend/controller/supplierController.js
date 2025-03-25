const Supplier = require('../models/Supplier'); // Note the direct import

// 🔹 Get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        console.log('Fetching all suppliers');
        const suppliers = await Supplier.findAll();
        console.log('Suppliers found:', suppliers.length);
        res.json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ 
            error: 'Unable to fetch suppliers',
            details: error.message 
        });
    }
};

// 🔹 Add a new supplier
exports.addSupplier = async (req, res) => {
    console.log('Received add supplier request');
    console.log('Request body:', req.body);

    try {
        // Validate input
        const { name, contact, productsSupplied } = req.body;
        
        if (!name || !contact || !productsSupplied) {
            console.warn('Missing required fields', req.body);
            return res.status(400).json({ 
                error: 'Missing required fields',
                receivedBody: req.body
            });
        }

        const supplier = await Supplier.create({
            name, 
            contact, 
            productsSupplied
        });

        console.log('Supplier created successfully:', supplier.toJSON());
        res.status(201).json(supplier);
    } catch (error) {
        console.error('Error in addSupplier:', error);
        res.status(500).json({ 
            error: 'Unable to create supplier',
            details: error.message,
            fullError: error.toString()
        });
    }
};

// 🔹 Update a supplier
exports.updateSupplier = async (req, res) => {
    try {
        const [updated] = await Supplier.update(req.body, { 
            where: { id: req.params.id } 
        });

        if (updated) {
            const updatedSupplier = await Supplier.findByPk(req.params.id);
            return res.json(updatedSupplier);
        }

        throw new Error('Supplier not found');
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ 
            error: 'Unable to update supplier',
            details: error.message 
        });
    }
};

// 🔹 Delete a supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.destroy({ 
            where: { id: req.params.id } 
        });

        if (deleted) {
            return res.status(204).end();
        }

        throw new Error('Supplier not found');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ 
            error: 'Unable to delete supplier',
            details: error.message 
        });
    }
};
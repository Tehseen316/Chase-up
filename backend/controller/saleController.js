const { Op } = require('sequelize');
const Sale = require('../models/Sale'); // Direct import from Sale.js
console.log('Sale model in controller:', Sale);

const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            order: [['saleDate', 'DESC']]
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch sales',
            message: error.message
        });
    }
};

const createSale = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { productName, quantity, unitPrice, totalAmount, saleDate } = req.body;

        if (!productName || !quantity || !unitPrice || !totalAmount) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'productName, quantity, unitPrice, and totalAmount are required'
            });
        }

        if (isNaN(quantity) || isNaN(unitPrice) || isNaN(totalAmount)) {
            return res.status(400).json({
                error: 'Invalid numeric values',
                message: 'quantity, unitPrice, and totalAmount must be numbers'
            });
        }

        const sale = await Sale.create({
            saleDate: saleDate ? new Date(saleDate) : new Date(),
            productName,
            quantity: parseInt(quantity),
            unitPrice: parseFloat(unitPrice),
            totalAmount: parseFloat(totalAmount)
        });

        res.status(201).json(sale);
    } catch (error) {
        console.error('Create sale error:', error);
        res.status(500).json({
            error: 'Failed to create sale',
            message: error.message
        });
    }
};

const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('Received query parameters:', req.query);

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const sales = await Sale.findAll({
            where: {
                saleDate: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            }
        });

        if (!sales.length) {
            return res.status(404).json({ message: 'No sales found in the selected period' });
        }

        let totalSales = 0;
        let totalItemsSold = 0;
        let productBreakdown = {};

        sales.forEach(sale => {
            totalSales += parseFloat(sale.totalAmount) || 0;
            totalItemsSold += parseInt(sale.quantity) || 0;

            if (!productBreakdown[sale.productName]) {
                productBreakdown[sale.productName] = {
                    productName: sale.productName,
                    quantity: 0,
                    totalAmount: 0
                };
            }

            productBreakdown[sale.productName].quantity += parseInt(sale.quantity) || 0;
            productBreakdown[sale.productName].totalAmount += parseFloat(sale.totalAmount) || 0;
        });

        // Ensure totalSales is a valid number
        totalSales = parseFloat(totalSales) || 0;

        res.json({
            startDate,
            endDate,
            totalSales,
            totalItemsSold,
            productBreakdown: Object.values(productBreakdown)
        });

    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ message: 'Server error while generating report' });
    }
};


module.exports = {
    getAllSales,
    createSale,
    getSalesReport,
};

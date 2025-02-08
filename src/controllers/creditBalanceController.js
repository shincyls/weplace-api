const CreditBalance = require('../models/creditBalanceModel');

// Create a new credit balance
exports.createCreditBalance = async (req, res) => {
    try {
        const creditBalance = new CreditBalance(req.body);
        await creditBalance.save();
        res.status(201).json(creditBalance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all credit balances
exports.getCreditBalances = async (req, res) => {
    try {
        const creditBalances = await CreditBalance.find();
        res.status(200).json(creditBalances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single credit balance by ID
exports.getCreditBalanceById = async (req, res) => {
    try {
        const creditBalance = await CreditBalance.findById(req.params.id);
        if (!creditBalance) {
            return res.status(404).json({ message: 'Credit balance not found' });
        }
        res.status(200).json(creditBalance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a credit balance by ID
exports.updateCreditBalance = async (req, res) => {
    try {
        const creditBalance = await CreditBalance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!creditBalance) {
            return res.status(404).json({ message: 'Credit balance not found' });
        }
        res.status(200).json(creditBalance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a credit balance by ID
exports.deleteCreditBalance = async (req, res) => {
    try {
        const creditBalance = await CreditBalance.findByIdAndDelete(req.params.id);
        if (!creditBalance) {
            return res.status(404).json({ message: 'Credit balance not found' });
        }
        res.status(200).json({ message: 'Credit balance deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
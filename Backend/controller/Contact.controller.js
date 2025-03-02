const Contact = require("../models/Contact.model");

// Create a new contact
exports.createContact = async (req, res) => {
    try {
        const data = req.body;
        const newContact = new Contact(data);
        await newContact.save();
        res.status(201).json({ message: "Contact created successfully", contact: newContact });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again later.", error: error.message });
    }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({
            message: "Contacts fetched successfully",
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch contacts. Please try again later.", error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        res.status(200).json({ contact });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve contact details. Please try again later.", error: error.message });
    }
};

// Update a contact by ID
exports.updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const updateData = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        res.status(200).json({ message: "Contact updated successfully", contact: updatedContact });
    } catch (error) {
        res.status(500).json({ message: "Unable to update contact. Please try again later.", error: error.message });
    }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found." });
        }
        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete contact. Please try again later.", error: error.message });
    }
};

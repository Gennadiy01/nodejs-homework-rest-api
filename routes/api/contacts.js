const express = require("express");
const router = express.Router();
const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

// ================ валідація =====================================V
const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email().min(3).max(30),
  phone: Joi.string()
    .min(7)
    .max(30)
    .pattern(/^\+|\d[0-9()]*\d$/, "numbers"),
});
// ================================================================^
router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  return res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return res.status(404).json({
      message: `Contact with id=${req.params.contactId} is not found!`,
    });
  }

  return res.json(contact);
});

router.post("/", async (req, res, next) => {
  // =============== валідація=================================V

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // ==========================================================^

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Mssing required name field" });
  }

  const newContact = await addContact(name, email, phone);

  return res.status(201).json(newContact);
});

/// ============================================================================
router.delete("/:contactId", async (req, res, next) => {
  const contact = await removeContact(req.params.contactId);

  if (contact)
    return res.json({
      message: `Contact with id=${req.params.contactId} is deleted`,
    });

  res
    .status(404)
    .json({ message: `Contact with id=${req.params.contactId} not found!` });
  // ============================================================================
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, phone } = req.body;

  if (!name && !email && !phone)
    return res.status(400).json({ message: "Missing fields" });
  const response = await updateContact(req.params.contactId, req.body);

  if (response) return res.json(response);
  return res
    .status(404)
    .json({ message: `Contact with id=${req.params.contactId} not found!` });
});

module.exports = router;

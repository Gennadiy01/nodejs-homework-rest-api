const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const { HttpError } = require("../helpers/errors");

async function getContacts(req, res, next) {
  const contacts = await listContacts();
  return res.json(contacts);
}

async function getContact(req, res, next) {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return next(
      HttpError(404, `Contact with id=${req.params.contactId} is not found!`)
    );
  }

  return res.json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = await addContact(name, email, phone);
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const contact = await removeContact(req.params.contactId);

  if (contact)
    return res.json({
      message: `Contact with id=${req.params.contactId} is deleted`,
    });

  return next(
    HttpError(404, `Contact with id=${req.params.contactId} is not found!`)
  );
}

async function changeContact(req, res, next) {
  const response = await updateContact(req.params.contactId, req.body);

  if (response) return res.json(response);
  return next(
    HttpError(404, `Contact with id=${req.params.contactId} is not found!`)
  );
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
};

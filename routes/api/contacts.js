const express = require("express");
const router = express.Router();

const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
} = require("../../controllers/contacts.controller");

const {
  postContactValidation,
  putContactValidation,
} = require("../../middlewares/validation");

const { tryCatchWrapper } = require("../../helpers/errors");

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post("/", postContactValidation, tryCatchWrapper(createContact));

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put("/:contactId", putContactValidation, tryCatchWrapper(changeContact));

module.exports = router;

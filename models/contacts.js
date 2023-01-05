const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve(__dirname, "./contacts.json");
const { v4: uuidv4 } = require("uuid");

// ====   окрема функція зчитування файлів   =======================
async function readDb() {
  const data = await fs.readFile(contactsPath, "utf8");
  const db = JSON.parse(data);

  return db;
}

// =========== окрема функція запису в файл ====================================================================

const writeDb = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

// ====   функція зчитування контактів   =======================
async function listContacts() {
  try {
    const data = await readDb();
    // console.table(data);

    return data;
  } catch (error) {
    console.error(error);
  }
}

// ======== функція пошуку контактів ============================
async function getContactById(contactId) {
  try {
    const contacts = await readDb();

    const contact = contacts.find((contact) => contact.id === contactId);

    // if (contact) {
    //   console.log(`Contact with such id = ${contactId} was found!`.green);
    //   console.table(contact);
    // } else {
    //   console.log(`Contact with such id = ${contactId} was not found!`.red);
    // }
    return contact;
  } catch (error) {
    console.error(error);
  }
}

// ==========================  функція додавання контакту   =========================
async function addContact(name, email, phone) {
  try {
    const contacts = await readDb();
    // ========= Перевірка полів контакту на повторюваність ===============v

    const contactByName = contacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    const contactByMail = contacts.find((contact) => contact.email === email);
    const contactByPhone = contacts.find((contact) => contact.phone === phone);

    if (contactByName) throw new Error("This name already exists!");

    if (contactByMail) throw new Error("This email already exists!");

    if (contactByPhone) throw new Error("This phone already exists!");

    // ==================================================================^

    const id = uuidv4();

    const newContact = { id, name, email, phone };
    contacts.push(newContact);

    writeDb(contacts);
    return newContact;
  } catch (error) {
    console.error(error);
  }
}

// ===========функція видалення контактів  ==========================
async function removeContact(contactId) {
  try {
    const contacts = await readDb();

    const idContact = contacts.findIndex((contact) => contact.id === contactId);
    if (idContact === -1) {
      // return console.log(`Contact with id=${contactId} not found!!!`.red);
      return null;
    }

    const contactDelete = contacts.splice(idContact, 1);

    writeDb(contacts);
    // console.log(`Contact with id=${contactId} is removed`.green);
    // console.table(contactDelete);

    return contactDelete;
  } catch (error) {
    console.error(error);
  }
}

// ==========================  функція оновлення контакту   =========================
async function updateContact(contactId, body) {
  try {
    const contacts = await readDb();
    const oldContact = await contacts.find(
      (contact) => contact.id === contactId
    );
    if (oldContact) {
      const updatedContact = { ...oldContact, ...body };
      const index = contacts.indexOf(oldContact);
      contacts.splice(index, 1, updatedContact);

      writeDb(contacts);

      return updatedContact;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

// ===================================================================================
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

const fs = require('fs')

// make data folder if not exist
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath)
}

// make contacts.json if not exist
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// load all data in contact.json
const loadContact = () => {
  const bufferFile = fs.readFileSync(dataPath, 'utf-8')
  const contacts = JSON.parse(bufferFile)
  return contacts
}

// find contact by name
const findContact = (name) => {
  const contacts = loadContact()

  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  )
  return contact
}

// rewrite contacts.json with new data
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// add new contact
const addContact = (contact) => {
  const contacts = loadContact()
  contacts.push(contact)
  saveContacts(contacts)
}

const checkDuplicate = (name) => {
  const contacts = loadContact()
  return contacts.find((contact) => contact.name === name)
}

module.exports = { loadContact, findContact, addContact, checkDuplicate }

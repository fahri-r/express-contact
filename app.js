const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact } = require('./utils/contacts')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Home - Contact App'
  })
})

app.get('/contact', (req, res) => {
  const contacts = loadContact()

  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Contact - Contact App',
    contacts
  })
})

app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name)

  res.render('detail', {
    layout: 'layouts/main-layouts',
    title: 'Detail - Contact App',
    contact
  })
})

app.listen(port, () => {
  console.log(`Contact app listening at http://localhost:${port}/`)
})

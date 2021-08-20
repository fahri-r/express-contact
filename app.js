const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact, addContact, checkDuplicate } = require('./utils/contacts')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// flash configuration
app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

app.get('/', (req, res) => {
  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Home - Contact App'
  })
})

app.post('/contact', [
  body('name').custom((value) => {
    const duplicate = checkDuplicate(value)
    if (duplicate) {
      throw new Error('Name already registered')
    }
    return true
  }),
  check('email', 'Email doesn\'t valid').isEmail(),
  check('phone', 'Phone number doesn\'t valid').isMobilePhone('id-ID')
],
(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      layout: 'layouts/main-layouts',
      title: 'Add Contact Form - Contact App',
      errors: errors.array()
    })
  } else {
    addContact(req.body)
    req.flash('msg', 'Contact successfully added')
    res.redirect('/contact')
  }
})

app.get('/contact', (req, res) => {
  const contacts = loadContact()

  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Contact - Contact App',
    contacts,
    msg: req.flash('msg')
  })
})

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layouts',
    title: 'Add Contact Form - Contact App'
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

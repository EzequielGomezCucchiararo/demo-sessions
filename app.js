const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const FileStore = require('session-file-store')(session);

const app = express()

const PORT = process.env.PORT || 4000

app.use( bodyParser.urlencoded({ extended: false }) )
app.use( bodyParser.json() )

app.set( 'view engine', 'pug' )

app.use(session({
  name: 'jm-server-session-cookie-id',
  secret: '4u6mVaJtJrrhZb2iHx2ugBof',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

app.use( (req, res, next) => {
  const cart = req.session.cart = req.session.cart || {}
  if ( cart._locals ) delete cart._locals
  console.log('req.session => ', req.session);
  next();
});

app.route('/cart')
  .get( ({ session: { cart }},res) => res.render('index', { cart }) )
  .post( (req,res) => {
    const cart = addToCart(req)
    res.render('index', { cart })
  })

app.route('/api/cart')
  .get( (req,res) => res.json(req.session.cart) )
  .post( (req,res) => {
    const cart = addToCart(req)
    res.json(cart)
  })

function addToCart(req) {
  let { product, quantity } = req.body
  quantity = +quantity

  let cart = req.session.cart

  if (cart[product]) cart[product] += quantity
  else cart[product] = quantity

  return cart
}


app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`) )
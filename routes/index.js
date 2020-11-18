var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var Cart = require("../models/cart");
// var hbs = require("hbs");

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find({}, function (err, allProducts) {
    if (err) {
      console.log(err);
      return res.sendStatus(400);
    }
    res.render("shop/index.hbs", {
      products: allProducts
    });
  });

});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  })
});


router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
})


router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
})

router.get("/shopping-cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", { products: cart.generateArray(), totalPrice: cart.totalPrice });
})

router.get("/checkout", function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/checkout", { total: cart.totalPrice });
});


module.exports = router;




// Product.find(function (err, docs) {
//   res.render('shop/index', { title: 'Shopping cart', products: docs });
// });
var Product = require("../models/product");

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/shop");
// , { useNewUrlParser: true }
var products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/ru/5/5c/Halo-_Reach_box_art.png',
    title: "Halo Reach",
    description: "Funny game",
    price: 10
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/ru/5/5c/Halo-_Reach_box_art.png',
    title: "Halo Reach",
    description: "Funny game",
    price: 10
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/ru/5/5c/Halo-_Reach_box_art.png',
    title: "Halo Reach",
    description: "Funny game",
    price: 10
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/ru/5/5c/Halo-_Reach_box_art.png',
    title: "Halo Reach",
    description: "Funny game",
    price: 10
  }),
]

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function (err, result) {
    done++
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
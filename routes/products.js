const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');

const { Product } = require('../models');
const v = new Validator();

router.get('/', async (req, res) => {
   const products = await Product.findAll();
   return res.json(products);
});

router.get('/:id', async (req, res) => {
   const id = req.params.id;
   const product = await Product.findByPk(id);
   return res.json(product || {});
});

router.post('/', async (req, res) => {
  const schema = {
    name: 'string',
    brand: 'string',
    description: { type: 'string', optional: true }
  }

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

//   res.send('Selamat data yang anda masukan benar');

const product = await Product.create(req.body);
res.json(product);
});

router.put('/:id', async (req, res) => {
   const id = req.params.id;
   let product = await Product.findByPk(id);

   if (!product) {
      return res.json({ message: 'Produk yang anda masukan tidak ada'});
   }

   const schema = {
      name: 'string',
      brand: 'string',
      description: { type: 'string', optional: true }
   }
   const validate = v.validate(req.body, schema);

   if (validate.length) {
     return res.status(400).json(validate);
   }

   // res.send('ok !!!')
 

   product = await product.update(req.body);
   res.json(product);

});

router.delete('/:id', async (req, res) => {
   const id = req.params.id;
   const product = await Product.findByPk(id);

   if (!product) {
      return res.json({ message: 'Produk yang anda masukan tidak ada'});
   }

   await product.destroy();
   res.json({
      message: 'Product sudah di delete'
   });

});


module.exports = router;

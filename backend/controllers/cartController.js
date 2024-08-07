const { Cart, Product, Customer } = require('../models');

// --- CREATE cart item
exports.createCartItem = async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    try {
      const cart = await Cart.create({ customer_id, product_id, quantity });

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'createCart failed' });
    }
};


// --- CREATE new cart item or update existing item for customer_id
exports.addToCart = async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    try {
        // check valid input
        if (!customer_id || !product_id || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const existingCartItem = await Cart.findOne({ where: { customer_id, product_id } });

        if (existingCartItem) {
            // update quantity if the item already exists
            await existingCartItem.update({ quantity: existingCartItem.quantity + quantity });
            res.json(existingCartItem);
        } else {
            // create a new cart item
            const newCartItem = await Cart.create({ customer_id, product_id, quantity });
            res.status(201).json(newCartItem);
        }
    } catch (error) {
        console.error("Error adding to cart: ", error);
        res.status(500).json({ error: 'addToCart failed' });
    }
};


// --- GET cart items for customer_id
exports.getCartItems = async (req, res) => {
    const customerId = req.params.customer_id;
    try {
        const cartItems = await Cart.findAll({
            where: { customer_id: customerId }
        });
        res.json(cartItems);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: 'getCartItems failed' });
    }
};

// --- GET cart items info for Product
exports.getCartItemsInfo = async (req, res) => {
    const customerId = req.params.customer_id;
    try {
        const cartItems = await Cart.findAll({
            where: { customer_id: customerId }
        });
        let cartItemsInfo =[]
        for (let item of cartItems){
            const product = await Product.findOne({where : {id : item.product_id}})
            cartItemsInfo.push({...item.dataValues, name:product.name, category:product.category, price:product.price, image_url:product.image_url})
        }
        res.json(cartItemsInfo);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: 'getCartItemsInfo failed' });
    }
};

// --- UPDATE cart item
exports.updateCartItem = async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    try {
      const cart_item = await Cart.findOne({ where: { customer_id, product_id } });
      if (!cart_item) {
        return res.status(404).json({ error: 'cart item not found' });
    }

        // updates quantity
        await Cart.update({ quantity }, { where: { customer_id, product_id } });

        res.json({ message: 'cart item updated' });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ error: 'updateCartItem failed' });
    }
}


// --- DELETE cart item for customer_id
exports.deleteCartItem = async (req, res) => {
   const { customer_id, product_id } = req.body;
    try {
        const cart_item = await Cart.findAll({ where: { customer_id, product_id } });
        if (!cart_item) {
            return res.status(404).json({ error: 'cart item not found' });
        }
        await Cart.destroy({ where: { customer_id, product_id } })


      res.json(cart_item);
  } catch (error) {
      console.error("Error deleting cart items:", error);
      res.status(500).json({ error: 'deleteCartItem failed' });
  }
};

// --- DELETE all cart items for customer_id
exports.emptyCart = async (req, res) => {
    const { customer_id } = req.body;
  try {
      const cart_item = await Cart.findAll({ where: { customer_id } });
      if (!cart_item) {
          return res.status(404).json({ error: 'customer cart not found' });
      }
      await Cart.destroy({ where: { customer_id } })

      res.json(cart_item);
  } catch (error) {
      console.error("Error emptying cart:", error);
      res.status(500).json({ error: 'emptyCart failed' });
  }
};


// --- GET all cart items
exports.getCart = async (req, res) => {
  try {
      const carts = await Cart.findAll();
      res.json(carts);
  } catch (error) {
      res.status(500).json({ error: 'getCart failed' });
  }
};

// --- DELETE all cart items
exports.deleteAll = async (req, res) => {
  try {
    await Cart.destroy({ where: {} })
      res.json({ message: "All carts deleted" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}


const { Telegraf, Markup, Scenes, session } = require('telegraf');


const bot = new Telegraf("6141908433:AAH44pcDhKSYKk853mKl2RgL7jmG3aSfRoc");

// Create product list
const products = [
  { name: 'Product 1', price: 10, image: 'image1.jpg' },
  { name: 'Product 2', price: 20, image: 'image2.jpg' },
  { name: 'Product 3', price: 30, image: 'image3.jpg' }
];

// Create cart
let cart = [];

// Create product selection keyboard
const productKeyboard = Markup.inlineKeyboard(
  products.map(product => Markup.button.callback(product.name, `add_${product.name}`))
);

// Handle start command
bot.start(ctx => {
  ctx.reply(
    'Welcome to our e-commerce store! What would you like to do?',
    Markup.keyboard(['View Products', 'View Cart', 'Checkout']).resize()
  );
});

// Handle view products
bot.hears('View Products', ctx => {
  ctx.reply('Here are our available products:', productKeyboard);
});

// Handle add to cart
bot.action(/add_(.+)/, ctx => {
  const productName = ctx.match[1];
  const product = products.find(p => p.name === productName);
  cart.push(product);
  ctx.answerCbQuery(`Added ${productName} to cart`);
});

// Handle view cart
bot.hears('View Cart', ctx => {
  if (cart.length === 0) {
    ctx.reply('Your cart is empty');
    return;
  }

  let message = 'Your cart contains:\n';
  cart.forEach(product => {
    message += `${product.name} - $${product.price}\n`;
  });
  ctx.reply(message);
});

// Handle checkout
bot.hears('Checkout', ctx => {
  if (cart.length === 0) {
    ctx.reply('Your cart is empty');
    return;
  }

  let total = cart.reduce((sum, product) => sum + product.price, 0);
  ctx.reply(`Your total is $${total}. Please enter your shipping information:`);
});

bot.launch();

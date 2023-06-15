const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const BaseScene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Dummy data for orders
const orders = [
  {
    id: 1,
    userId: 1,
    status: 'Pending',
    items: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
  },
  {
    id: 2,
    userId: 1,
    status: 'Approved',
    items: [
      { productId: 3, quantity: 1 }
    ]
  },
  // ...
];

// Create an order scene using the BaseScene or WizardScene module
const orderScene = new BaseScene('order');

// Show order history and status when the user enters the scene
orderScene.enter((ctx) => {
  // Get user ID from session
  const userId = ctx.session.userId;
  // Get user's orders from dummy data
  const userOrders = orders.filter((order) => order.userId === userId);
  // Show user's order history and status
  userOrders.forEach((order) => {
    ctx.reply(`Order #${order.id}: ${order.status}`);
    let totalPrice = 0;
    order.items.forEach((item) => {
      const product = products.find((product) => product.id === item.productId);
      ctx.reply(`${product.name} x ${item.quantity} = $${product.price * item.quantity}`);
      totalPrice += product.price * item.quantity;
    });
    ctx.reply(`Total price: $${totalPrice}`);
  });
});

// Register the scene with the stage
stage.register(orderScene);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());

// Start the bot and listen for updates
bot.launch();

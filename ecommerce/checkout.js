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

// Create a checkout scene using the BaseScene or WizardScene module
const checkoutScene = new BaseScene('checkout');

// Show order details and payment options when the user enters the scene
checkoutScene.enter((ctx) => {
  // Get cart items from session
  const cartItems = ctx.session.cart || [];
  // Show all the products in the cart along with their quantities and total price
  let totalPrice = 0;
  cartItems.forEach((item) => {
    ctx.reply(`${item.product.name} x ${item.quantity} = $${item.product.price * item.quantity}`);
    totalPrice += item.product.price * item.quantity;
  });
  ctx.reply(`Total price: $${totalPrice}`);
  // Allow user to choose a payment method and proceed to payment
  ctx.reply(
    'Choose a payment method:',
    Markup.inlineKeyboard([
      [Markup.callbackButton('Pay with Card', 'pay-with-card')],
      [Markup.callbackButton('Pay with PayPal', 'pay-with-paypal')]
    ])
  );
});

// Handle payment method selection
checkoutScene.action('pay-with-card', (ctx) => {
  // Process payment using card
  // ...
  // Send confirmation message to user
  ctx.reply('Payment successful! Your order has been placed.');
});
checkoutScene.action('pay-with-paypal', (ctx) => {
  // Process payment using PayPal
  // ...
  // Send confirmation message to user
  ctx.reply('Payment successful! Your order has been placed.');
});

// Register the scene with the stage
stage.register(checkoutScene);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());

// Start the bot and listen for updates
bot.launch();

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Create a cart scene
const cartScene = new Scene('cart');

// Show cart items when the user enters the scene
cartScene.enter((ctx) => {
  // Get cart items from session
  const cartItems = ctx.session.cart || [];
  // Show all the products in the cart along with their quantities and total price
  let totalPrice = 0;
  cartItems.forEach((item) => {
    ctx.reply(`${item.product.name} x ${item.quantity} = $${item.product.price * item.quantity}`);
    totalPrice += item.product.price * item.quantity;
  });
  ctx.reply(`Total price: $${totalPrice}`);
  // Allow user to remove, increase or decrease quantity of each product in the cart
  cartItems.forEach((item) => {
    ctx.reply(
      'Update quantity:',
      Markup.inlineKeyboard([
        [
          Markup.callbackButton('-', `decrease-quantity-${item.product.id}`),
          Markup.callbackButton(`${item.quantity}`, `quantity-${item.product.id}`),
          Markup.callbackButton('+', `increase-quantity-${item.product.id}`),
          Markup.callbackButton('Remove', `remove-from-cart-${item.product.id}`)
        ]
      ])
    );
    cartScene.action(`decrease-quantity-${item.product.id}`, (ctx) => {
      if (item.quantity > 1) {
        item.quantity--;
        ctx.scene.reenter();
      }
      ctx.answerCbQuery();
    });
    cartScene.action(`increase-quantity-${item.product.id}`, (ctx) => {
      item.quantity++;
      ctx.scene.reenter();
      ctx.answerCbQuery();
    });
    cartScene.action(`remove-from-cart-${item.product.id}`, (ctx) => {
      const index = cartItems.indexOf(item);
      if (index > -1) {
        cartItems.splice(index, 1);
        ctx.scene.reenter();
      }
      ctx.answerCbQuery();
    });
  });
  // Provide a checkout button to proceed to the payment scene
  ctx.reply(
    'Checkout:',
    Markup.inlineKeyboard([
      [Markup.callbackButton('Checkout', 'checkout')]
    ])
  );
});

// Register the scene with the stage
stage.register(cartScene);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());

// Start the bot and listen for updates
bot.launch();

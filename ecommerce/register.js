const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Create a user registration scene
const registerScene = new Scene('register');

// Ask the user for their contact number when they enter the scene
registerScene.enter((ctx) => {
  ctx.reply(
    'Please share your contact number:',
    Markup.keyboard([[Markup.contactRequestButton('Share Contact')]]).resize().extra()
  );
});

// Handle the contact button and save the user's data in the database
registerScene.on('contact', async (ctx) => {
  const contact = ctx.message.contact;
  // Save the user's data in the database
  // ...
  // Assign the user an ID and check if they are an admin or not
  // ...
  // Move to the next scene
  ctx.scene.enter('product-display');
});

// Register the scene with the stage
stage.register(registerScene);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());

// Start the bot and listen for updates
bot.launch();

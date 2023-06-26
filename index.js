const { Telegraf, Markup,  Scene, session, WizardScene,Scenes } = require('telegraf');

const { Stage } = Scenes;
const bot = new Telegraf("6141908433:AAH44pcDhKSYKk853mKl2RgL7jmG3aSfRoc");


// Create a user registration scene
const registerScene = new Scenes.WizardScene('register',

// Ask the user for their contact number when they enter the scene
async (ctx) => {
  console.log(ctx.message)
  ctx.replyWithHTML(
    `<b>Share your contact number with me!</b>`,
    {
      reply_markup: {
        keyboard: [
          [{ text: 'Share Contact', request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  )
});
// bot.on('contact', (ctx) => {
//   console.log(ctx.message.contact)
//   ctx.reply(`Thank you for sharing your contact number, ${ctx.message.contact.first_name}!`)
// })

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
const stage = new Stage([registerScene]);
// stage.register([register]);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());
bot.command('start', (ctx) => ctx.scene.enter('register'));
// Start the bot and listen for updates
bot.launch();
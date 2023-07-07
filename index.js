const consola= require('consola')
const { Telegraf, Markup,  Scene, session, WizardScene,Scenes } = require('telegraf');

const { Stage } = Scenes;
const bot = new Telegraf("5972521271:AAHuq5fIqRhaz2DmPpoWaGUdK4TB-7DMmS8");
const logger = consola.withTag('pagination-bot')

// Create x amount of chunks with 10 items each
const results = chunk(Array.from({ length: 45 }).fill(0).map((_, i) => i+=1), 10)

// Create pagination buttons with choices
const makeButtons = (choiceButtons) => Markup.inlineKeyboard([
  ...choiceButtons,
  [
    Markup.button.callback('Prev', 'prev'),
    Markup.button.callback('Next', 'next')
  ]
])

// Catch Telegraf errors
bot.catch(e => logger.error(e))
bot
  .use(session())
  .use((ctx, next) => {
    ctx.session ??= {} // set session if no exists
    return next()
  })


bot.command('demo', async ctx => {
  // Set page number
  ctx.session.page = ctx.session.page || 0
  // Show first page results
  await ctx.replyWithMarkdownV2(results[ctx.session.page].map(i => `Item: *${i}*`).join('\n'), {
    ...makeButtons(chunk(results[ctx.session.page].map((_,i) => Markup.button.callback(i + 1, `prefix:${i + 1}`)), 5))
  })
}).action(/(prev|next)/, async ctx => {
  /* Handler to incremet or decrement page number, and change page */
  // Prevent errors when ctx.session.page is undefined
  if (typeof ctx.session.page === 'undefined') return ctx.answerCbQuery();
  const [, action] = ctx.match
  if (action === 'prev') {
    // prevent decrement and show alert
    if (ctx.session.page === 0) return ctx.answerCbQuery('You are on home page');
    ctx.session.page = ctx.session.page - 1; // decrement
  }
  if (action === 'next') {
    // prevent increment and show alert
    if ((ctx.session.page + 1) === results.length) return ctx.answerCbQuery('You are on last page');
    ctx.session.page = ctx.session.page + 1 // increment
  }
  await ctx.answerCbQuery()
  // Change results
  await ctx.editMessageText(results[ctx.session.page].map(i => `Item: *${i}*`).join('\n'), {
    ...makeButtons(chunk(results[ctx.session.page].map((_,i) => Markup.button.callback(i + 1, `prefix:${i + 1}`)), 5)),
    parse_mode: 'MarkdownV2'
  })
}).action(/prefix:(\d+)/, async ctx => {
  /* Item choice handler */
  const [, choice] = ctx.match
  await ctx.answerCbQuery()
  await ctx.replyWithMarkdownV2(`You chose the item: *${results[ctx.session.page][choice - 1]}*`)
})


function chunk (arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) })
    .fill(0)
    .map(() => arr.splice(0, size));
}

bot.launch()


// // Create a user registration scene
// const registerScene = new Scenes.WizardScene('register',

// // Ask the user for their contact number when they enter the scene
// async (ctx) => {
//   console.log(ctx.message)
//   ctx.replyWithHTML(
//     `<b>Share your contact number with me!</b>`,
//     {
//       reply_markup: {
//         keyboard: [
//           [{ text: 'Share Contact', request_contact: true }]
//         ],
//         resize_keyboard: true,
//         one_time_keyboard: true
//       }
//     }
//   )
// });
// // bot.on('contact', (ctx) => {
// //   console.log(ctx.message.contact)
// //   ctx.reply(`Thank you for sharing your contact number, ${ctx.message.contact.first_name}!`)
// // })

// // Handle the contact button and save the user's data in the database
// registerScene.on('contact', async (ctx) => {
//   const contact = ctx.message.contact;
//   // Save the user's data in the database
//   // ...
//   // Assign the user an ID and check if they are an admin or not
//   // ...
//   // Move to the next scene
//   ctx.scene.enter('product-display');
// });

// // Register the scene with the stage
// const stage = new Stage([registerScene]);
// // stage.register([register]);

// // Register stage middleware with the bot instance
// bot.use(session());
// bot.use(stage.middleware());
// bot.command('start', (ctx) => ctx.scene.enter('register'));
// // Start the bot and listen for updates
// bot.launch();
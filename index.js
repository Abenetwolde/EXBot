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
bot.launch();/* 
const { Telegraf, Markup,  Scene, session, WizardScene,Scenes } = require('telegraf');

const { Stage } = Scenes;
const bot = new Telegraf("6141908433:AAH44pcDhKSYKk853mKl2RgL7jmG3aSfRoc");


const motivationScene = new Scenes.WizardScene(
    'motivation',
    async (ctx) => {
        const response = await fetch('https://type.fit/api/quotes');
        const data = await response.json();
        ctx.reply(data.quote);
        ctx.scene.leave();
    }
)
// Scene for getting a random quiz

const quizScene = new Scenes.WizardScene(
    'quiz',
    async (ctx) => {
        ctx.replyWithPoll(
            'What is the capital of France?',
            ['Paris', 'London', 'Berlin', 'Madrid'],
            { is_anonymous: false, allows_multiple_answers: false }
          );
          return ctx.wizard.next();
        });
        quizScene.on('poll_answer', (ctx) => {
          // Check if the user selected the correct answer
          if (ctx.pollAnswer.option_ids[0] === 0) {
            ctx.reply('Congratulations! You are correct.');
            ctx.scene.leave();;;
          } else {
            // ctx.replyWithAnimation('<URL>');
            ctx.reply(
              'Sorry, that is not correct. The correct answer is Paris.',
              Markup.inlineKeyboard([
                Markup.callbackButton('View Answer', 'view_answer'),
              ]).extra()
            );
            ctx.scene.leave();;;
          }
        });
        quizScene.action('view_answer', (ctx) => {
          ctx.answerCbQuery();
          ctx.editMessageText('The correct answer is Paris.');
          ctx.scene.leave();;;
        }
        

        )
      


// Create a stage to manage all scenes
const stage = new Stage([motivationScene , quizScene]);
bot.use(session());
bot.use(stage.middleware());

// Show menu button when user starts the bot
bot.start((ctx) => {
    
  ctx.reply(
    'Welcome to the Quiz Bot!',
    Markup.keyboard([
      ['/help', '/motivation'],
      ['/quiz', '/stats'],
    ])
      .oneTime()
      .resize()
    //   .extra()
  );
});

// Respond to /help command
bot.command('help', (ctx) => {
  ctx.reply(
    'Here are some commands you can use:\n/help - Get additional help\n/motivation - Get a motivational quote\n/quiz - Get a random quiz\n/stats - See how many users are using the bot'
  );
});

// Respond to /motivation command
bot.command('motivation', (ctx) => {
  ctx.scene.enter('motivation');
});

// Respond to /quiz command
bot.command('quiz', (ctx) => {
  ctx.scene.enter('quiz');
});

// Respond to /stats command
bot.command('stats', (ctx) => {
  // Get the number of users who have started the bot
  const userCount = Object.keys(bot.context.db.users).length;
  ctx.reply(`There are ${userCount} users using this bot.`);
});

bot.launch();
 */
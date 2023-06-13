const { Telegraf, Markup,  Scene, session, WizardScene,Scenes } = require('telegraf');
const { Stage } = Scenes;
const { leave, enter } = Stage;
// const { MongoClient } = require('mongodb');
// const axios = require('axios');

const bot = new Telegraf("6141908433:AAH44pcDhKSYKk853mKl2RgL7jmG3aSfRoc");
// const mongoClient = new MongoClient(process.env.MONGO_URI);

// async function connectToMongo() {
//     await mongoClient.connect();
//     console.log('Connected to MongoDB');
// }

// connectToMongo();

// const db = mongoClient.db('mydb');
// const usersCollection = db.collection('users');
// const questionsCollection = db.collection('questions');
let questions = [
  {
      "q1": "The tree sends down roots from its branches to the soil is know as:",
      "o1": "Oak",
      "o2": "Pine",
      "o3": "Banyan",
      "answer": "o3",
      "used":true
  },
  {
      "question": "Electric bulb filament is made of ",
      "o1": "Copper",
      "o2": "Lead",
      "o3": "Tungsten",
      "answer": "o3",
      "used":true
  },
  {
      "question": "Which of the following is used in pencils?",
      "o1": "Graphite",
      "o2": "Lead",
      "o3": "Silicon",
      "answer": "o1",
      "used":false
  }, 
  {
      "question": "The speaker of the Lok Sabha can ask a member of the house to stop speaking and let another member speak. This phenomenon is known as :",
      "o1": "Crossing the floor",
      "o2": "Yielding the floor",
      "o3": "Calling Attention Motion",
      "answer": "o2",
      "used":false
  },
  {
      "question": "The Comptroller and Auditor General of India can be removed from office in like manner and on like grounds as :",
      "o1": "High Court Judge",
      "o2": "Prime Minister",
      "o3": "Supreme Court  Judge",
      "answer": "o3",
      "used":false
  },
]

const quizWizard = new Scenes.WizardScene(
    'quiz-wizard',
    async (ctx) => {
        const question = questions.filter((q)=>q.used==true);
        console.log(question)
        if (!question) {
            ctx.reply('No more questions available');
            return ctx.scene.leave();
        }
        ctx.wizard.state.question = question;
        console.log(   ctx.wizard.state.question)
         ctx.reply(question[0].q1, Markup.inlineKeyboard([
            Markup.button.callback('True', 'true'),
            Markup.button.callback('False', 'false')
        ]));
        return ctx.wizard.next();
    },
    async (ctx) => {
        const answer = ctx.update.callback_query.data;
        const question = ctx.wizard.state.question;
        if (answer === question.answer) {
            await ctx.reply('Correct!');
        } else {
            await ctx.reply('Incorrect');
        }
        // await questions.updateOne({ _id: question._id }, { $set: { used: true } });
        // const user = await usersCollection.findOne({ id: ctx.from.id });
        // if (!user) {
        //     await usersCollection.insertOne({ id: ctx.from.id, score: 1 });
        // } else {
        //     await usersCollection.updateOne({ id: ctx.from.id }, { $inc: { score: 1 } });
        // }
        return ctx.scene.leave();
    }
);

const stage = new Stage([quizWizard]);
bot.use(session())
bot.use(stage.middleware());
;
const question =  questions.filter((q)=>q.used==true);
console.log(question)
bot.command('start', (ctx) => ctx.reply(`Welcome to the quiz bot!`));
bot.command('quiz', (ctx) => ctx.scene.enter('quiz-wizard'));

bot.launch();
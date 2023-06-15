const { Telegraf, Markup,  Scene, session, WizardScene,Scenes } = require('telegraf');
const { Stage } = Scenes;
const InlineQueryResultArticle = require('telegraf/inline-query-result-article');
const InputTextMessageContent = require('telegraf/input-text-message-content');


// Create a new bot instance
const a ="6141908433:AAH44pcDhKSYKk853mKl2RgL7jmG3aSfRoc"
const bot = new Telegraf(a)
// Dummy data for products
const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 10,
    description: 'This is a description of product 1',
    images: [
      { id: 1, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' },
      { id: 2, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' },
      { id: 3, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' }
    ]
  },
  {
    id: 2,
    name: 'Product 2',
    price: 20,
    description: 'This is a description of product 2',
    images: [
      { id: 4, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' },
      { id: 5, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' },
      { id: 6, name: 'https://avatars.githubusercontent.com/u/58665822?v=4' }
    ]
  },
  // ...
];

// Handle inline queries
bot.on('inline_query', (ctx) => {
  // Get search query from inline query
  const query = ctx.inlineQuery.query;
  // Get matching products from dummy data
  const matchingProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  // Show matching products as inline results
  const results = matchingProducts.map((product) => {
    return InlineQueryResultArticle({
      id: product.id,
      title: product.name,
      description: `$${product.price}`,
      input_message_content: InputTextMessageContent({
        message_text: `${product.name} - $${product.price}`
      })
    });
});
ctx.answerInlineQuery(results);
});   
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Create a product list scene
const productListScene = new Scene('product-list');

// Show products from the API when the user enters the scene
productListScene.enter(async (ctx) => {
  // Get products from the API based on different criteria
  const products = await getProductsFromAPI();
  // Show products to the user using pagination logic from the Scenes module
  let currentPage = 0;
  const pageSize = 5;
  const pageCount = Math.ceil(products.length / pageSize);
  const showPage = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const pageProducts = products.slice(startIndex, endIndex);
    pageProducts.forEach((product) => {
      ctx.reply(`${product.name} - $${product.price}`);
    });
    ctx.reply(
      'Products:',
      Markup.inlineKeyboard([
        [
          Markup.callbackButton('Previous', 'previous-page'),
          Markup.callbackButton(`${currentPage + 1}/${pageCount}`, 'current-page'),
          Markup.callbackButton('Next', 'next-page')
        ]
      ])
    );
  };
  showPage();
  productListScene.action('previous-page', (ctx) => {
    if (currentPage > 0) {
      currentPage--;
      showPage();
    }
    ctx.answerCbQuery();
  });
  productListScene.action('next-page', (ctx) => {
    if (currentPage < pageCount - 1) {
      currentPage++;
      showPage();
    }
    ctx.answerCbQuery();
  });
});

// Allow user to filter products by price or date using Markup buttons
productListScene.enter((ctx) => {
  ctx.reply(
    'Filter by:',
    Markup.inlineKeyboard([
      [Markup.callbackButton('Price: Low to High', 'filter-by-price-asc')],
      [Markup.callbackButton('Price: High to Low', 'filter-by-price-desc')],
      [Markup.callbackButton('Date: Oldest First', 'filter-by-date-asc')],
      [Markup.callbackButton('Date: Newest First', 'filter-by-date-desc')]
    ])
  );
});

// Handle filter selection and show filtered products
productListScene.action('filter-by-price-asc', async (ctx) => {
  // Get filtered products from API
  const products = await getFilteredProductsFromAPI({ sortBy: 'price', sortOrder: 'asc' });
  showPage();
  
  productListScene.action('previous-page', (ctx) => {
    if (currentPage > 0) {
      currentPage--;
      showPage();
    }
    ctx.answerCbQuery();
  });
  
  productListScene.action('next-page', (ctx) => {
    if (currentPage < pageCount - 1) {
      currentPage++;
      showPage();
    }
    ctx.answerCbQuery();
  });
  
  productListScene.action('filter-by-price-asc', (ctx) => {
    filteredProducts = products.slice().sort((a, b) => a.price - b.price);
    currentPage = 0;
    showPage();
    ctx.answerCbQuery();
  });
  
  productListScene.action('filter-by-price-desc', (ctx) => {
    filteredProducts = products.slice().sort((a, b) => b.price - a.price);
    currentPage = 0;
    showPage();
    ctx.answerCbQuery();
  });
  
  productListScene.action('filter-by-date-asc', (ctx) => {
    filteredProducts = products.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    currentPage = 0;
    showPage();
    ctx.answerCbQuery();
  });
  
  productListScene.action('filter-by-date-desc', (ctx) => {
    filteredProducts = products.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    currentPage = 0;
    showPage();
    ctx.answerCbQuery();
  });
  
});

stage.register(productListScene);

bot.use(session());
bot.use(stage.middleware());

bot.launch();

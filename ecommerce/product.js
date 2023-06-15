const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Create a product display scene
const productDisplayScene = new Scene('product-display');

// Show products from the API when the user enters the scene
productDisplayScene.enter(async (ctx) => {
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
      // Show product name and price
      ctx.reply(`${product.name} - $${product.price}`);
      // Show product images using pagination logic
      let currentImagePage = 0;
      const imagePageSize = 3;
      const imagePageCount = Math.ceil(product.images.length / imagePageSize);
      const showImagePage = () => {
        const startImageIndex = currentImagePage * imagePageSize;
        const endImageIndex = startImageIndex + imagePageSize;
        const pageImages = product.images.slice(startImageIndex, endImageIndex);
        ctx.reply(
          'Product Images:',
          Markup.inlineKeyboard([
            pageImages.map((image) =>
              Markup.callbackButton(image.name, `view-image-${image.id}`)
            ),
            [
              Markup.callbackButton('Previous', `previous-image-page-${product.id}`),
              Markup.callbackButton(`${currentImagePage + 1}/${imagePageCount}`, `current-image-page-${product.id}`),
              Markup.callbackButton('Next', `next-image-page-${product.id}`)
            ]
          ])
        );
      };
      showImagePage();
      productDisplayScene.action(`previous-image-page-${product.id}`, (ctx) => {
        if (currentImagePage > 0) {
          currentImagePage--;
          showImagePage();
        }
        ctx.answerCbQuery();
      });
      productDisplayScene.action(`next-image-page-${product.id}`, (ctx) => {
        if (currentImagePage < imagePageCount - 1) {
          currentImagePage++;
          showImagePage();
        }
        ctx.answerCbQuery();
      });
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
  productDisplayScene.action('previous-page', (ctx) => {
    if (currentPage > 0) {
      currentPage--;
      showPage();
    }
    ctx.answerCbQuery();
  });
  productDisplayScene.action('next-page', (ctx) => {
    if (currentPage < pageCount - 1) {
      currentPage++;
      showPage();
    }
    ctx.answerCbQuery();
  });
});

// Register the scene with the stage
stage.register(productDisplayScene);

// Register stage middleware with the bot instance
bot.use(session());
bot.use(stage.middleware());

// Start the bot and listen for updates
bot.launch();

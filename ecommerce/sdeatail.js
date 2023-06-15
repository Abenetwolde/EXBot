
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

// Create a new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Create a new stage to manage scenes
const stage = new Stage();

// Create a product details scene
const productDetailsScene = new Scene('product-details');

// Show product details when the user enters the scene
productDetailsScene.enter((ctx) => {
  // Get product ID from session
  const productId = ctx.session.productId;
  // Get product details from dummy data
  const product = products.find((product) => product.id === productId);
  // Show all the details of the product
  ctx.reply(`Name: ${product.name}`);
  ctx.reply(`Price: $${product.price}`);
  ctx.reply(`Description: ${product.description}`);
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
  productDetailsScene.action(`previous-image-page-${product.id}`, (ctx) => {
    if (currentImagePage > 0) {
      currentImagePage--;
      showImagePage();
    }
    ctx.answerCbQuery();
  });
  productDetailsScene.action(`next-image-page-${product.id}`, (ctx) => {
    if (currentImagePage < imagePageCount - 1) {
      currentImagePage++;
      showImagePage();
    }
    ctx.answerCbQuery();
  });
  // Replace view product button with add to cart button and quantity input
  let quantity = 1;
  const showAddToCartButton = () => {
    ctx.reply(
      'Add to cart:',
      Markup.inlineKeyboard([
        [
          Markup.callbackButton('-', `decrease-quantity-${product.id}`),
          Markup.callbackButton(`${quantity}`, `quantity-${product.id}`),
          Markup.callbackButton('+', `increase-quantity-${product.id}`),
          Markup.callbackButton('Add to cart', `add-to-cart-${product.id}`)
        ]
      ])
    );
  }}
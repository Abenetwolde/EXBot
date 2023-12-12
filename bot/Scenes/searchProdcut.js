// Search Product scene
const { Scenes, Markup, session } = require("telegraf")
const axios = require('axios');
const { replace } = require("lodash");
const searchProduct = new Scenes.BaseScene('searchProduct');
const itemsPerPage = 10;
const apiUrl = " http://localhost:5000"
// Dummy data for products
const products = [
  {
    id: 1,
    name: 'Product 11',
    description: 'This is the description for Product 1.',
    images: [
      "https://th.bing.com/th/id/OIP.K8piq_1Rl_AyeNbcDyPpPgAAAA?pid=ImgDet&rs=1",
      "https://th.bing.com/th/id/OIP.y7QJCUnLeQFDE2FXeXH_CwHaHa?pid=ImgDet&rs=1"
    ]
  },
  {
    id: 2123,
    name: 'Product 3',
    description: 'This is the description for Product 2.',
    images: [
      "https://th.bing.com/th/id/OIP.y7QJCUnLeQFDE2FXeXH_CwHaHa?pid=ImgDet&rs=1",
      "https://th.bing.com/th/id/OIP.y7QJCUnLeQFDE2FXeXH_CwHaHa?pid=ImgDet&rs=1"
    ]
  },
  // Add more products as needed...
];
const generateProductDetailsReply = (product) => {
  // You can customize this message format based on your needs
  return `
    <b>${product.name}</b>
    Description: ${product.description}
    Images:
    ${product.images.map(image => `<a href="${image}">&#8205;</a>`).join('\n')}
  `;
};
const chosenResults = {};
searchProduct.enter(async (ctx) => {
  console.log("reach serach scene")
  let message = `
Type the Product Name to search
Example @testecommerce12bot Prodcut name
`;
  //ctx.reply(text, [extra params])
  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Click here to Search a prodcut', switch_inline_query_current_chat: "" }
        ]
      ],
      force_reply: true
    },

  })

});
// Handle inline queries within the scene
 searchProduct.on('inline_query', async (ctx) => {
  console.log("inline_query")
  let input = ctx.inlineQuery.query
    if (!input) {
      return;
    }
    const filteredProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(input);
    });
  
    const results = filteredProducts.map((product) => {
      const thumbnail = product.images[0]; // Use the first image as the thumbnail
  
      return {
        type: 'article',
        title: product.name,
        // photo_url: String(product.images[0]), // Use photo_url to specify the thumbnail image URL
        thumb_url: String(product.images[0]),
        // photo_width: 300,
        // photo_height: 200,
        description: product.description, // Set the type to 'photo'
        id: String(product.id),
  
  
        input_message_content: {
  
          message_text: `${product.name}\n${product.description}},<a href="${product.images[0]}">&#8205;</a>`,
   
          parse_mode: "HTML",
          media_group: product.images.map((image, index) => ({
            type: 'photo',
            media: image,
            caption: `Image ${index + 1}`,
            media_unique: `image_${index + 1}`,
          })),
          //  thumb_url: String(product.images[0]),
        },
  
        reply_markup: {
          inline_keyboard: 
            [
              [{
                text: 'View Moree',
                callback_data: `view_more_${product.id}`,  // Add a unique identifier
              }],
            ],
          
        },
      };
  
    });
 await ctx.answerInlineQuery(results, { cache_time: 0 });
  await ctx.answerInlineQuery(results, { cache_time: 0 });
});

searchProduct.on('chosen_inline_result', async (ctx) => {

const inlineMessageId = ctx.chosenInlineResult.inline_message_id;
  console.log('Inline Message ID:', inlineMessageId);

  // Delete the message using the inline message ID
  setTimeout(async () => { 
    // Edit the inline message with an empty message to clear it
    try {
      await ctx.telegram.deleteMessage(ctx.from.id, inlineMessageId);
      console.log('Inline message cleared.');
    } catch (error) {
      console.error('Error editing inline message:', error.description);
    }
  }, 2000);

const resultId = ctx.chosenInlineResult.result_id;
const selectedProduct = products.find(product => String(product.id) === resultId);

 const mediaGroup = selectedProduct.images.map(image => ({
  type: 'photo',
  media: image,
  message: "usaydu",


} ));

await ctx.telegram.sendMediaGroup(ctx.from.id, mediaGroup);
await ctx.telegram.sendMessage(
  ctx.from.id,
  selectedProduct.description
);

// await ctx.telegram.sendPhoto(ctx.from.id, image, {
//   caption: selectedProduct.description,
// });
// await ctx.telegram.sendPhoto(
//   ctx.from.id,
//   selectedProduct.images[0],
//   {
//     caption: selectedProduct.description,
//   }
// );
// await ctx.telegram.replyWithMediaGroup(
//   ctx.from.id,[
//   {
//     type: 'photo',
//     media:  "https://th.bing.com/th/id/OIP.K8piq_1Rl_AyeNbcDyPpPgAAAA?pid=ImgDet&rs=1", // Replace with the actual image URL
//     caption: 'Caption for Image 1',
//   },
//   {
//     type: 'photo',
//     media:  "https://th.bing.com/th/id/OIP.K8piq_1Rl_AyeNbcDyPpPgAAAA?pid=ImgDet&rs=1", // Replace with the actual image URL
//     caption: 'Caption for Image 2',
//   },
//   // Add more media items as needed
// ]);
  console.log("resultId...........", resultId);


  ctx.session.selectedProductId = resultId;
  ctx.session[resultId] = ctx.chosenInlineResult.inline_message_id;
  console.log("ctx.session[resultId]", ctx.session[resultId]);

  // ...

  // Later when you want to delete the stored message
  const storedMessageId = ctx.session[resultId];
  if (storedMessageId) {
    // Extract the correct inline_message_id from the stored value
    const inlineMessageId = storedMessageId.split('_')[1];

    // Delete the stored message using the corrected inline_message_id
  // await  ctx.deleteMessage( inlineMessageId)
  //     .then(() => {
  //       console.log("Message deleted successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting message:", error.description);
  //     });
  } else {
    console.log("No message to delete");
  }

  // ...
});
// Regular message event
// searchProduct.on('message', (ctx) => {
//   const userId = ctx.from.id;

//   // Check if there's a stored chosen result for the user
//   if (chosenResults[userId]) {
//     const resultId = chosenResults[userId].resultId;

//     // Reply with a message based on the chosen result
//     ctx.reply(`You chose result: ${resultId}`);

//     // Clear the stored chosen result information
//     delete chosenResults[userId];
//   }

//   // Handle other messages or commands as usual
// });
searchProduct.action(/view_more_/, async (ctx) => {
  console.log("viewmore............")
    // Extract the product ID from the callback data
    const productId = ctx.match.input.split('_')[2];

    // Generate the unique identifier for the stored message ID
    const resultId = `result_${productId}`;
  
    // Store the product ID in the session
    ctx.session.selectedProductId = productId;
  
    // Answer the callback query without sending a separate message
   await ctx.answerCbQuery();
    

  // Send a follow-up message or reply using ctx.reply
  await ctx.reply('View more details...');
    // Delete the stored message using the stored message ID
    if (ctx.session[resultId]) {
      ctx.telegram.deleteMessage(ctx.chat.id, ctx.session[resultId])
        .catch((error) => {
          console.error("Error deleting message:", error.description);
        });
    } else {
      console.log("No message to delete");
    }
    await ctx.scene.leave()
    // Enter the productDetails scene
    // ctx.scene.enter('productDetails');
});
searchProduct.leave(async (ctx) => {
  try {
   await ctx.scene.enter('productDetails');
  } catch (error) {
      console.error('Error in homeScene.leave:', error);
  }

  // Leave the scene

});
// // Function to generate data
// const generateData = (count) => {
//     let items = [];
//     for (let i = 0; i < count; i++) {
//       items.push({
//         title: `Item ${i}`,
//         description: `Description for item ${i}`,
//         id: `${i}`
//       });
//     }
//     return items;
//   };

//   searchProduct.enter(async (ctx) => {
// //  ctx.replyWithChatAction('sending Prodcuts');
//        ctx.reply(
//       `You are now viewing our serarchproducts.`,
//     //   Markup.keyboard([
//     //     ['Home', 'Category'],
//     //     ['Checkout']
//     //   ]).resize(),
//     );


// });

//   // Inline query handler
//   bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
//     const offset = parseInt(inlineQuery.offset) || 0;
//     const itemsPerPage = 10;
//     const data = generateData(100);

//     let results = data.slice(offset, offset + itemsPerPage).map((item) => ({
//       type: 'article',
//       id: item.id,
//       title: item.title,
//       description: item.description,
//       input_message_content: {
//         message_text: `*${item.title}*\n${item.description}`,
//         parse_mode: 'Markdown'
//       },
//       reply_markup: {
//         inline_keyboard: [[{ text: 'More info', callback_data: `moreinfo:${item.id}` }]]
//       }
//     }));

//     return answerInlineQuery(results, {
//       is_personal: true,
//       next_offset: offset + results.length,
//       cache_time: 10
//     });
//   });

//   // Callback query handler
//   searchProduct.on('callback_query', async (ctx) => {
//     const callbackData = ctx.callbackQuery.data.split(':');
//     if (callbackData[0] === 'moreinfo') {
//       const itemId = callbackData[1];
//       await ctx.answerCbQuery(`More info for item ${itemId}`);
//     }
//   });
//   searchProduct.leave(async (ctx) => {
//     await ctx.scene.leave();
//  })
//  module.exports = {
//     searchProduct
//  }

// const searchProduct = new Scenes.BaseScene('productSearchScene');

// searchProduct.enter(async (ctx) => {
//   await ctx.reply('Please enter a search query to find products:', Markup.forceReply());
// });

// searchProduct.on('text', async (ctx) => {
//   const query = ctx.message.text;

//   // Retrieve search results from external API
//   const response = await axios.get(`${apiUrl}/api/search?q=${query}`);

//   // Store search results in session
//   ctx.session.searchResults = response.data.products;

//   // Send search results
//   for (const product of response.data) {
//     await ctx.replyWithPhoto(
//       product.images[0],
//       { caption: `${product.name}\n${product.description}`,
//         reply_markup: Markup.inlineKeyboard([
//           [Markup.button.callback('View More', `view_more_${product.id}`)],
//         ])
//       }
//     );
//   }
// });

// searchProduct.on('inline_query', async (ctx) => {
//    const query = ctx.inlineQuery.query;
//    const offset = parseInt(ctx.inlineQuery.offset) || 0;

//    // Retrieve search results from external API
//    const response = await axios.get(`${apiUrl}/api/search?q=${query}&offset=${offset}&limit=${itemsPerPage}`);

//    // Generate inline query results
//    const results = response.data.map(product => ({
//      type: 'article',
//      id: product._id,
//      title: product.name,
//      description: product.description??product.description,
//      thumb_url: product.images[0],
//      input_message_content: {
//        message_text: `${product.name}\n${product.description??product.description}`,
//      },
//     ...Markup.inlineKeyboard([
//        [Markup.button.callback('View More', `view_more_${product._id}`)],
//      ]),
//    }));

//    // Answer inline query
//    await ctx.answerInlineQuery(results, {
//      next_offset: offset + itemsPerPage,
//    });
// });

// searchProduct.action(/view_more_(.+)/, async (ctx) => {
//    const productId = parseInt(ctx.match[1]);
//    const productIndex = ctx.session.searchResults.findIndex(product => product.id === productId);
//    const product = ctx.session.searchResults[productIndex];

//    await ctx.replyWithPhoto(
//      product.images[0],
//      { caption: `${product.name}\n${product.description}\nPrice: ${product.price}\n\nAdditional information:\n${product.additionalInformation}`,
//        reply_markup: Markup.inlineKeyboard([
//          [Markup.button.callback('-', `decrease_quantity_${product.id}`), Markup.button.callback(`${product.quantity}`, `quantity_${product.id}`), Markup.button.callback('+', `increase_quantity_${product.id}`)],
//          [Markup.button.callback('Buy', `buy_${product.id}`)],
//        ])
//      }
//    );
// });
module.exports = {
  searchProduct
}
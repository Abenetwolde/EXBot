
const axios = require('axios');
const sharp = require('sharp');
const { Scenes, Markup, session } = require("telegraf")
const apiUrl = 'http://localhost:5000';
module.exports = {
    displyProdcut:  async function (ctx) {
       

            const promises = [];
             for (const product of ctx.session.products)  {
              const productId = product._id;
              console.log("productId",product)
              product.quantity = 0;
              // Check if the product is already in the cart
              const cartItemIndex = ctx.session.cart.findIndex(
                (item) => item._id === productId
              );
              console.log("cartItemIndex", cartItemIndex);
              if (cartItemIndex !== -1) {
                // Set the quantity to the quantity in the cart
                product.quantity = ctx.session.cart[cartItemIndex].quantity;
              }
          
              ctx.session.currentImageIndex[productId] = 0;
              ctx.session.viewMore[productId] = false;
              // ctx.session.quantity[productId] = 0;
               await module.exports.sendProduct(ctx, productId, product);
            // console.log( "promises",promises)
            // return promises;
          }
          
    },

     sendProduct: async function (ctx, productId, product, iscart) {
       
        // const product =  ctx.session.iscart?ctx.session.cart:products
        console.log("product",product)
        // Generate a caption for this product by concatenating all of its properties except for the images property
        let caption = '';
       caption= `✔️ ${product.name}\n💳 ${product.price} Birr \n ✅ ${product.discription}\n ✅ ${product.discription}\n
       `
        // Object.keys(product).forEach((key) => {
        //     if (key !== 'images') {
        //         caption += `${key}: ${product[key]}\n`;
        //     }
        // });
        // If the viewMore flag for this product is false and the caption is longer than 20 characters, truncate it and add an ellipsis
        if (!ctx.session.viewMore[productId] && caption.length > 20) {
            caption = caption.substring(0, 50) + '...';
        }
        // Check if the image for this product exists
        if (!product.images || !product.images[ctx.session.currentImageIndex[productId]]) {
            return;
        }
        // Get the current image of this product from its images array using the current image productId stored in the session data
        const image = product.images[ctx.session.currentImageIndex[productId]];
        if (ctx.session.cleanUpState && ctx.session.cleanUpState.find(message => message.type === 'product' && message.productId === productId)) {
            const messageId = ctx.session.cleanUpState.find(message => message.type === 'product' && message.productId === productId).id;
            // If there is a previous message ID, use the editMessageMedia method to edit its media and update its image
    
            await ctx.telegram.editMessageMedia(
                ctx.chat.id,
                messageId,
                null,
                {
                    type: 'photo',
                    media: image,
                    caption: caption
                },
                Markup.inlineKeyboard([
                    product.quantity==0?[
                        Markup.button.callback('⬅️', `previous_${productId}`),
                        ctx.session.viewMore[productId] ? Markup.button.callback('View Less', `viewLess_${productId}`) : Markup.button.callback('View More', `viewMore_${productId}`),
                        Markup.button.callback('➡️', `next_${productId}`),
                        // ...(ctx.session.viewMore[productId] ? [Markup.button.callback('Buy', `buy_${productId}`)] : [])
                    ]:[],
                    ...(product.quantity > 0 ? [
                        [
                            Markup.button.callback('Remove Quantity', `removeQuantity_${productId}`),
                            Markup.button.callback(`${product.quantity} * ${product.price} = ${product.quantity * product.price} ${product.currency}`, `quantity_${productId}`),
                            Markup.button.callback('Add Quantity', `addQuantity_${productId}`)
                        ]
                    ] : (ctx.session.viewMore[productId] ? [
                        [
                            Markup.button.callback('Buy', `buy_${productId}`)
                        ]
                    ] : []))
                ])
            ) 
        } else {
            // const imageBuffer = await sharp(image)
            // .resize(200, 200)
            // .toBuffer();
            const response = await axios.get(image, { responseType: 'arraybuffer' });
            const imageBuffer = await sharp(response.data)
                .resize(200, 200)
                .toBuffer();
            // If there is no previous message ID, use the replyWithPhoto method to send a new message with this product's image
            await ctx.replyWithPhoto({ source: imageBuffer }, {
                caption: caption,
                ...Markup.inlineKeyboard([
                    product.quantity==0?[
                        Markup.button.callback('⬅️', `previous_${productId}`),
                        ctx.session.viewMore[productId] ? Markup.button.callback('View Less', `viewLess_${productId}`) : Markup.button.callback('View More', `viewMore_${productId}`),
                        Markup.button.callback('➡️', `next_${productId}`),
                        // ...(ctx.session.viewMore[productId] ? [Markup.button.callback('Buy', `buy_${productId}`)] : [])
                    ]:[],
                    ...(product.quantity > 0 ? [
                        [
                            Markup.button.callback('Remove Quantity', `removeQuantity_${productId}`),
                            Markup.button.callback(`${product.quantity} * ${product.price} = ${product.quantity * product.price} ${product.currency}`, `quantity_${productId}`),
                            Markup.button.callback('Add Quantity', `addQuantity_${productId}`)
                        ]
                    ] : (ctx.session.viewMore[productId] ? [
                        [
                            Markup.button.callback('Buy', `buy_${productId}`)
                        ]
                    ] : []))
                ])
            }
    
            ).then((message) => {
                // Push the message ID and type to the cleanUpState array in the session data
                ctx.session.cleanUpState.push({ id: message.message_id, type: 'product', productId: productId });
            });
        }
    
        // return await ctx.replyWithPhoto("https://th.bing.com/th/id/OIP.y7QJCUnLeQFDE2FXeXH_CwHaHa?pid=ImgDet&rs=1", /* Template.productButtons(categoryName, product, quantity) */)
    },
//     sendProducts: async function (ctx, categoryName, cart) {
//         // let products = productdata
//         console.log(ctx.scene)
//         let productMessageID = []
//         productMessageID = await Promise.all(
//             productdata.map(async (product) => {
//                 //   console.log(product);
//                 //    await ctx.reply(product.name)
//                 //   const message = await module.exports.sendMessage(ctx, product);
//                 const message = await ctx.replyWithPhoto(product.images[0],
//                     {
//                         caption: `${product.name}\n${product.description}\n${product.price}:${product.currency}\n${product.category}\n${product.brand}`,
//                         parse_mode: "Markdown",
//                         ...Markup.inlineKeyboard(
//                                             [
//                                                 Markup.button.callback("Previous", "previous"),
//                                                 Markup.button.callback("View Product", "viewDetails"),
//                                                 Markup.button.callback("Next", "next"),
                            
//                                             ]),
//                     }
//                 )
//                 return {
//                     id: message.message_id,
//                     type: "product",
//                     productName: product.name,
//                 };
//             })
//         );

//         return productMessageID
//     },
//     categoryMenuButtons: function () {
//         const extra = Markup
//             .keyboard([
//                 ["🏠 Back to Home"]
//             ])
//             .resize()
//         extra.parse_mode = "HTML"
//         return extra
//     },
//     categoryMessage: function (body, shopName) {
//         return body + `<i>🟢 - Available</i>
// <i>🟡 - Low on stock</i>
// <i>🔴 - Out of stock</i>

// <i>Navigate to the individual category using the buttons below that <b>${shopName}</b> offers.</i>
// `
//     },
}
const { Scenes, Markup, session } = require("telegraf")
const axios = require('axios');
const categoryScene = new Scenes.BaseScene('category');

const apiUrl = 'http://localhost:5000';
categoryScene.enter(async(ctx) => {
  await ctx.sendChatAction('typing');
let categories
  try {
     categories=  await axios.get(`${apiUrl}/api/getcategorys`)
  } catch (error) {
    ctx.reply(error)
  }
  console.log("categories",categories)
  const pairs = categories.data.categoryList.reduce((result, value, index, array) => {
    if (index % 2 === 0)
      result.push(array.slice(index, index + 2));
    return result;
  }, []);
  console.log("pairs",pairs)


 await ctx.reply(
    'You are now viewing our product Categories.',
    Markup.keyboard([
        ['Home']
    ]).resize(),
  );
// const categories=  await axios.get(`${apiUrl}/api/getcategory`)
  // In summary, the pairs.map(pair => pair.map(category => ...)) code maps over the pairs array to create an array of arrays, where each inner array contains two buttons representing a pair of categories. I hope this helps! 
  await ctx.replyWithHTML(
    '<b>Choose a product category:</b>',
    Markup.inlineKeyboard(
      pairs.map(pair => pair.map(category => Markup.button.callback(`${category.icon} ${category.name}`,  `category_${category._id}_${category.name}`)))
    )
  );

});

categoryScene.action(/category_(.+)/, async(ctx) => {
  const callbackData = ctx.match[1];
  const [categoryId, categoryName] = callbackData.split('_');

  // Now, you have both the category ID and name separately
  console.log('Category ID:', categoryId);
  console.log('Category Name:', categoryName);
  // ctx.scene.enter('product',  { category: categoryId });
 await ctx.scene.enter('product', { category: { id: categoryId, name: categoryName } });
  
});
categoryScene.leave(async (ctx) => {
  console.log("you are now leaving Categories scene")
  await ctx.scene.leave();
});
module.exports = {
    categoryScene 
}
bot.catch((err, ctx) => {
    if (err.description && err.description.includes('query is too old')) {
        ctx.reply('Sorry, your request has timed out.')
    } else {
        console.log(`Error: ${err}`)
    }
  })
bot.start((ctx) => {
    const referralLink = 'https://example.com/referral'
    ctx.reply(
        `Here's your referral link: ${referralLink}`,
        Markup.inlineKeyboard([
          Markup.button.switchToCurrentChat('Copy Referral Link', referralLink)
        ])
    )
    ctx.reply(`Here's your referral link:  <code>${referralLink}</code> `,{ parse_mode: 'HTML' }, Markup.inlineKeyboard([
        Markup.button.callback('Copy', 'copy')
    ]))
  })
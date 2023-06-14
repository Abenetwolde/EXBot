const { bot } = require('../config/connectTelegram.js');
const { BaseScene, Markup } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard');
const { main_keyboard, adminChat_15minutes, cancel_keyboard, getPrices_5sim, getNumber_5sim } = require('../helpers/utils.js');
const { $user, $number, $admin } = require('../config/connectMongoose.js');
const request = require('prequest');
const moment = require('moment');
const toArray = require('object-values-to-array');
const userBlock = require('telegraf-userblock');

moment.locale('ru')

const flags = {
    "afghanistan": "🇦🇫 Афганистан",
    "albania": "🇦🇱 Албания",
    "algeria": "🇩🇿 Алжир",
    "angola": "🇦🇴 Ангола",
    "anguilla": "🇦🇮 Ангилья",
    "antiguaandbarbuda": "🇦🇬 Антигуа и Барбуда",
    "argentina": "🇦🇷 Аргентина",
    "armenia": "🇦🇲 Армения",
    "aruba": "🇦🇼 Аруба",
    "austria": "🇦🇹 Австрия",
    "australia": "🇦🇺 Австралия",
    "azerbaijan": "🇦🇿 Азербайджан",
    "bahrain": "🇧🇭 Бахрейн",
    "bangladesh": "🇧🇩 Бангладеш",
    "barbados": "🇧🇧 Барбадос",
    "bahamas": "🇧🇸 Багамские острова",
    "belarus": "🇧🇾 Беларусь",
    "belgium": "🇧🇪 Бельгия",
    "belize": "🇧🇿 Белиз",
    "benin": "🇧🇯 Бенин",
    "bhutane": "🇧🇹 Бутан",
    "bih": "🇧🇦 Босния и Герцеговина",
    "bolivia": "🇧🇴 Боливия",
    "botswana": "🇧🇼 Ботсвана",
    "brazil": "🇧🇷 Бразилия",
    "bulgaria": "🇧🇬 Болгария",
    "burkinafaso": "🇧🇫 Буркина-Фасо",
    "burundi": "🇧🇮 Бурунди",
    "cambodia": "🇧🇮 Камбоджи",
    "cameroon": "🇨🇲 Камерун",
    "canada": "🇨🇦 Канада",
    "caymanislands": "🇰🇾 Острова Кайман",
    "capeverde": "🇨🇻 Кабо-Верде",
    "chad": "🇹🇩 Чад",
    "china": "🇨🇳 Китай",
    "chile": "🇨🇱 Чили",
    "colombia": "🇨🇴 Колумбия",
    "congo": "🇨🇴 Конго",
    "comoros": "🇰🇲 Коморские острова",
    "costarica": "🇨🇷 Коста-Рика",
    "croatia": "🇭🇷 Хорватия",
    "cuba": "🇨🇺 Куба",
    "cyprus": "🇨🇾 Кипр",
    "czech": "🇨🇿 Чехия",
    "djibouti": "🇩🇯 Джибути",
    "dominicana": "🇩🇴 Доминиканская Республика",
    "dominica": "🇩🇲 Доминика",
    "drcongo": "DR Congo",
    "easttimor": "🇹🇱 Восточный Тимор",
    "ecuador": "🇪🇨 Эквадор",
    "egypt": "🇪🇬 Египет",
    "england": "🇬🇧 Великобритания",
    "equatorialguinea": "🇬🇶 Экваториальная Гвинея",
    "estonia": "🇪🇪 Эстония",
    "ethiopia": "🇪🇹 Эфиопия",
    "eritrea": "🇪🇷 Эритрея",
    "finland": "🇫🇮 Финляндия",
    "france": "🇫🇷 Франция",
    "frenchguiana": "Французская Гвиана",
    "gabon": "🇬🇦 Габон",
    "gambia": "🇬🇲 Гамбия",
    "georgia": "🇬🇪 Грузия",
    "germany": "🇩🇪 Германия",
    "ghana": "🇬🇭 Гана",
    "greece": "🇬🇷 Греция",
    "grenada": "🇬🇩 Гренада",
    "guadeloupe": "🇬🇵 Гваделупа",
    "guatemala": "🇬🇹 Гватемала",
    "guinea": "🇬🇳 Гвинея",
    "guineabissau": "🇬🇼 Гвинея-Бисау",
    "guyana": "🇬🇾 Гайана",
    "haiti": "🇭🇹 Гаити",
    "honduras": "🇭🇳 Гондурас",
    "hongkong": "🇭🇰 Гонконг",
    "hungary": "🇭🇺 Венгрия",
    "india": "🇮🇳 Индия",
    "indonesia": "🇮🇩 Индонезия",
    "iran": "🇮🇷 Иран",
    "iraq": "🇮🇶 Ирак",
    "ireland": "🇮🇪 Ирландия",
    "israel": "🇮🇱 Израиль",
    "italy": "🇮🇹 Италия",
    "ivorycoast": "🇮🇹 Кот-д'Ивуар",
    "jamaica": "🇯🇲 Ямайка",
    "jordan": "🇯🇴 Иордания",
    "kazakhstan": "🇰🇿 Казахстан",
    "kenya": "🇰🇪 Кения",
    "kuwait": "🇰🇼 Кувейт",
    "kyrgyzstan": "🇰🇬 Кыргызстан",
    "laos": "🇱🇦 Лаос",
    "latvia": "🇱🇻 Латвия",
    "lesotho": "🇱🇸 Лесото",
    "libya": "🇱🇾 Ливия",
    "liberia": "🇱🇷 Либерия",
    "lithuania": "🇱🇹 Литва",
    "luxembourg": "🇱🇺 Люксембург",
    "macau": "🇲🇴 Макао",
    "madagascar": "🇲🇬 Мадагаскар",
    "malawi": "🇲🇼 Малави",
    "malaysia": "🇲🇾 Малайзия",
    "maldives": "🇲🇻 Мальдивы",
    "mali": "🇲🇱 Мали",
    "mauritania": "🇲🇷 Мавритания",
    "mauritius": "🇲🇺 Маврикий",
    "mexico": "🇲🇽 Мексика",
    "moldova": "🇲🇩 Молдавия",
    "mongolia": "🇲🇳 Монголия",
    "montenegro": "🇲🇪 Черногория",
    "morocco": "🇲🇦 Марокко",
    "mozambique": "🇲🇿 Мозамбик",
    "montserrat": "🇲🇸 Монтсеррат",
    "myanmar": "🇲🇲 Мьянма",
    "namibia": "🇳🇦 Намибия",
    "nepal": "🇳🇵 Непал",
    "netherlands": "🇳🇱 Нидерланды",
    "newzealand": "🇳🇿 Новая Зеландия",
    "newcaledonia": "🇳🇨 Новая Каледония",
    "nicaragua": "🇳🇮 Никарагуа",
    "nigeria": "🇳🇬 Нигерия",
    "niger": "🇳🇪 Нигер",
    "northmacedonia": "🇲🇰 Северная Македония",
    "norway": "🇳🇴 Норвегия",
    "oman": "🇴🇲 Оман",
    "pakistan": "🇵🇰 Пакистан",
    "panama": "🇵🇦 Панама",
    "papuanewguinea": "🇵🇦 Папуа-Новая Гвинея",
    "paraguay": "🇵🇾 Парагвай",
    "peru": "🇵🇪 Перу",
    "philippines": "🇵🇭 Филиппины",
    "poland": "🇵🇱 Польша",
    "portugal": "🇵🇹 Португалия",
    "puertorico": "🇵🇷 Пуэрто-Рико",
    "qatar": "🇶🇦 Катар",
    "reunion": "🇷🇪 Реюньон",
    "romania": "🇷🇴 Румыния",
    "russia": "🇷🇺 Россия",
    "seychelles": "🇸🇨 Сейшельские Острова",
    "rwanda": "🇷🇼 Руанда",
    "japan": "🇯🇵 Япония",
    "saintkittsandnevis": "🇰🇳 Сент-Китс и Невис",
    "saintlucia": "🇱🇨 Сент-Люсия",
    "saintvincentandgrenadines": "🇻🇨 Сент-Винсент и Гренадины",
    "salvador": "🇸🇻 Сальвадор",
    "saudiarabia": "🇸🇦 Саудовская Аравия",
    "samoa": "🇼🇸 Самоа",
    "saotomeandprincipe": "🇸🇹 Сан-Томе и Принсипи",
    "senegal": "🇸🇳 Сенегал",
    "serbia": "🇷🇸 Сербия",
    "sierraleone": "🇸🇱 Сьерра-Леоне",
    "slovakia": "🇸🇰 Словакия",
    "slovenia": "🇸🇮 Словения",
    "somalia": "🇸🇴 Сомали",
    "southafrica": "🇿🇦 Южная Африка",
    "spain": "🇪🇸 Испания",
    "srilanka": "🇱🇰 Шри-Ланка",
    "singapore": "🇸🇬 Сингапур",
    "sudan": "🇸🇩 Судан",
    "suriname": "🇸🇷 Суринам",
    "swaziland": "🇸🇿 Эсватини",
    "sweden": "🇸🇪 Швеция",
    "syria": "🇸🇾 Сирия",
    "solomonislands": "🇸🇧 Соломоновы острова",
    "southsudan": "🇸🇸 Южный Судан",
    "switzerland": "🇨🇭 Швейцария",
    "taiwan": "🇹🇼 Тайвань",
    "tajikistan": "🇹🇯 Таджикистан",
    "tanzania": "🇹🇿 Танзания",
    "thailand": "🇹🇭 Таиланд",
    "tit": "🇹🇹 Тринидад и Тобаго",
    "togo": "🇹🇬 Того",
    "tunisia": "🇹🇳 Тунис",
    "turkey": "🇹🇷 Турция",
    "turkmenistan": "🇹🇲 Туркменистан",
    "uae": "🇦🇪 ОАЭ",
    "uganda": "🇺🇬 Уганда",
    "uruguay": "🇺🇾 Уругвай",
    "usa": "🇺🇸 США",
    "uzbekistan": "🇺🇿 Узбекистан",
    "ukraine": "🇺🇦 Украина",
    "venezuela": "🇺🇿 Венесуэла",
    "vietnam": "🇻🇳 Вьетнам",
    "yemen": "🇾🇪 Йемен",
    "zambia": "🇿🇲 Замбия",
    "zimbabwe": "🇿🇼 Зимбабве"
}
const fivesim_scene = new BaseScene('fivesim_scene');
fivesim_scene.enter(async (ctx) => {
    ctx.session.cost = 0;
    ctx.session.garanty = 0;

    ctx.session.allServicesFullName = [
        '1688',
        '23red',
        '32red',
        '99app',
        'ace2three',
        'adidas',
        'agroinform',
        'airbnb',
        'airtel',
        'aitu',
        'akelni',
        'alfa',
        'algida',
        'alibaba',
        'aliexpress',
        'alipay',
        'amasia',
        'amazon',
        'aol',
        'apple',
        'astropay',
        'auchan',
        'avito',
        'avon',
        'azino',
        'b4ucabs',
        'baidu',
        'banqi',
        'bigolive',
        'billmill',
        'bisu',
        'bitaqaty',
        'bitclout',
        'bittube',
        'blablacar',
        'blizzard',
        'blockchain',
        'blued',
        'bolt',
        'brand20ua',
        'burgerking',
        'bykea',
        'cafebazaar',
        'caixa',
        'careem',
        'carousell',
        'cdkeys',
        'cekkazan',
        'citaprevia',
        'citymobil',
        'clickentregas',
        'cliqq',
        'clubhouse',
        'cmtcuzdan',
        'coinbase',
        'coinfield',
        'craigslist',
        'cryptocom',
        'dbrua',
        'deliveroo',
        'delivery',
        'dent',
        'dhani',
        'didi',
        'digikala',
        'discord',
        'disneyhotstar',
        'divar',
        'dixy',
        'dodopizza',
        'domdara',
        'dominospizza',
        'dostavista',
        'douyu',
        'dream11',
        'drom',
        'drugvokrug',
        'dukascopy',
        'easypay',
        'ebay',
        'ebikegewinnspiel',
        'edgeless',
        'electroneum',
        'eneba',
        'ezbuy',
        'faberlic',
        'facebook',
        'fiqsy',
        'fiverr',
        'foodpanda',
        'foody',
        'forwarding',
        'freecharge',
        'galaxy',
        'gamearena',
        'gameflip',
        'gamekit',
        'gamer',
        'gcash',
        'get',
        'getir',
        'gett',
        'gg',
        'gittigidiyor',
        'global24',
        'globaltel',
        'globus',
        'glovo',
        'google',
        'grabtaxi',
        'green',
        'grindr',
        'hamrahaval',
        'happn',
        'haraj',
        'hepsiburadacom',
        'hezzl',
        'hily',
        'hopi',
        'hqtrivia',
        'humblebundle',
        'humta',
        'huya',
        'icard',
        'icq',
        'icrypex',
        'ifood',
        'immowelt',
        'imo',
        'inboxlv',
        'indriver',
        'ininal',
        'instagram',
        'iost',
        'iqos',
        'irancell',
        'ivi',
        'iyc',
        'jd',
        'jkf',
        'justdating',
        'justdial',
        'kakaotalk',
        'karusel',
        'keybase',
        'komandacard',
        'kotak811',
        'kucoinplay',
        'kufarby',
        'kvartplata',
        'kwai',
        'lazada',
        'lbry',
        'lenta',
        'lianxin',
        'line',
        'linkedin',
        'livescore',
        'magnit',
        'magnolia',
        'mailru',
        'mamba',
        'mcdonalds',
        'meetme',
        'mega',
        'mercado',
        'michat',
        'microsoft',
        'miloan',
        'miratorg',
        'mobile01',
        'momo',
        'monese',
        'monobank',
        'mosru',
        'mrgreen',
        'mtscashback',
        'myfishka',
        'myglo',
        'mylove',
        'mymusictaste',
        'mzadqatar',
        'nana',
        'naver',
        'ncsoft',
        'netflix',
        'nhseven',
        'nifty',
        'nike',
        'nimses',
        'nrjmusicawards',
        'nttgame',
        'odnoklassniki',
        'offerup',
        'offgamers',
        'okcupid',
        'okey',
        'okta',
        'olacabs',
        'olx',
        'onlinerby',
        'openpoint',
        'oraclecloud',
        'oriflame',
        'other',
        'ozon',
        'paddypower',
        'pairs',
        'papara',
        'paxful',
        'payberry',
        'paycell',
        'paymaya',
        'paypal',
        'paysend',
        'paytm',
        'peoplecom',
        'perekrestok',
        'pgbonus',
        'picpay',
        'pof',
        'pokec',
        'pokermaster',
        'potato',
        'powerkredite',
        'prajmeriz2020',
        'premiumone',
        'prom',
        'proton',
        'protonmail',
        'protp',
        'pubg',
        'pureplatfrom',
        'pyaterochka',
        'pyromusic',
        'q12trivia',
        'qiwiwallet',
        'quipp',
        'rakuten',
        'rambler',
        'rediffmail',
        'reuse',
        'ripkord',
        'rosakhutor',
        'rsa',
        'rutube',
        'samokat',
        'seosprint',
        'sheerid',
        'shopee',
        'signal',
        'sikayetvar',
        'skout',
        'snapchat',
        'snappfood',
        'sneakersnstuff',
        'socios',
        'sportmaster',
        'spothit',
        'ssoidnet',
        'steam',
        'surveytime',
        'swvl',
        'taksheel',
        'tango',
        'tantan',
        'taobao',
        'telegram',
        'tencentqq',
        'ticketmaster',
        'tiktok',
        'tinder',
        'tosla',
        'totalcoin',
        'touchance',
        'trendyol',
        'truecaller',
        'twitch',
        'twitter',
        'uber',
        'ukrnet',
        'uploaded',
        'vernyi',
        'vernyj',
        'viber',
        'vitajekspress',
        'vkontakte',
        'voopee',
        'wechat',
        'weibo',
        'weku',
        'weststein',
        'whatsapp',
        'wildberries',
        'wingmoney',
        'winston',
        'wish',
        'wmaraci',
        'wolt',
        'yaay',
        'yahoo',
        'yalla',
        'yandex',
        'yemeksepeti',
        'youdo',
        'youla',
        'youstar',
        'zalo',
        'zoho',
        'zomato'
    ];
    ctx.session.pages_count = parseInt(ctx.session.allServicesFullName.length / 15) + 1;
    ctx.session.allServicesCost = [];
    ctx.session.selected_services = [];
    for (var i = 0; i < 15; i++) {
        ctx.session.selected_services.push(Key.callback(ctx.session.allServicesFullName[i]));
    }
    const keyboard1 = Keyboard.make([
        Key.callback(`⬅️`, `go ${(ctx.session.pages_count - 1) * 15}`),
        Key.callback(`📃 1/${ctx.session.pages_count}`, 'information'),
        Key.callback(`➡️`, `go 15`),
        Key.callback('🔙 Назад')
    ], { columns: 3 });
    const keyboard2 = Keyboard.make(ctx.session.selected_services, { columns: 2 });
    const keyboard = Keyboard.combine(keyboard2, keyboard1).inline();
    try {
        await ctx.editMessageText('Выберите сервис:', keyboard);
    } catch (err) {};
});


fivesim_scene.action(/go (\d+)$/i, async (ctx) => {
    var checked = false;
    ctx.session.selected_services = [];
    for (var i = ctx.match[1]; i < Number(ctx.match[1]) + 15 & i < ctx.session.allServicesFullName.length; i++) {
        checked = true;
        ctx.session.selected_services.push(Key.callback(ctx.session.allServicesFullName[i]));
    }
    if (!checked) return ctx.answerCbQuery(`Больше нет сервисов.`);

    var current_page = parseInt(ctx.match[1] / 15) + 1;

    var keyboard1;
    if (ctx.session.selected_services.length < 15) {
        keyboard1 = Keyboard.make([
            Key.callback('⬅️', `go ${Number(ctx.match[1]) - 15}`),
            Key.callback(`📃 ${ctx.session.pages_count}/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go ${(ctx.session.pages_count - 1) * 15}`),
            Key.callback('🔙 Назад')
        ], { columns: 3 });
    } else if (Number(ctx.match[1]) === 0) {
        ctx.session.selected_services = [];
        for (var i = 0; i < 15; i++) {
            ctx.session.selected_services.push(Key.callback(ctx.session.allServicesFullName[i]));
        }
        keyboard1 = Keyboard.make([
            Key.callback(`⬅️`, `go ${(ctx.session.pages_count - 1) * 15}`),
            Key.callback(`📃 1/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go 15`),
            Key.callback('🔙 Назад')
        ], { columns: 3 });
    } else {
        keyboard1 = Keyboard.make([
            Key.callback('⬅️', `go ${Number(ctx.match[1]) - 15}`),
            Key.callback(`📃 ${current_page}/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go ${Number(ctx.match[1]) + 15}`),
            Key.callback('🔙 Назад')
        ], { columns: 3 });
    }
    const keyboard2 = Keyboard.make(ctx.session.selected_services, { columns: 2 });
    const keyboard = Keyboard.combine(keyboard2, keyboard1).inline();
    try {
        await ctx.editMessageText('Выберите из списка или <b>введите название</b> нужного сервиса в строке ввода:', { parse_mode: "HTML", reply_markup: keyboard.reply_markup });
    } catch (err) {}
});

fivesim_scene.action('information', async (ctx) => {
    return ctx.scene.enter("fivesim_scene");
});

fivesim_scene.action('🔙 Назад', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (err) {};
    const keyboard = Keyboard.make([
        Key.callback('🔙 Назад', 'back_to_order'),
        Key.callback('✔️ Беру', 'order_for_ten_minutes_buy'),
        Key.callback('⌚️ Действующая активация', 'my_order_now')
    ], { pattern: [2, 1] }).inline()
    await ctx.reply(`
⏱ Номер выдаётся на 10 минут. За это время Вам нужно успеть получить все необходимые смс.
💡 Используется обычно для регистрации и одноразовых манипуляций. После закрытия номера вернуть его будет не возможно! Будьте внимательны: заказывайте полный комплект смс сразу!`, keyboard);
    return ctx.scene.leave();
});

fivesim_scene.on('callback_query', async (ctx) => {
    ctx.session.selected_service = ctx.update.callback_query.data;
    for (var i = ctx.session.allServicesFullName.length - 1; i >= 0; i--) {
        if (ctx.session.allServicesFullName[i] == ctx.session.selected_service) {
            ctx.session.selected_service_id = ctx.session.allServicesFullName[i];
            break;
        }
    }
    return ctx.scene.enter("fivesim_scene_2")
});

fivesim_scene.on('text', async (ctx) => {

    ctx.session.selected_service = ctx.message.text.toLowerCase();
    var check = false;
    for (var i = ctx.session.allServicesFullName.length - 1; i >= 0; i--) {
        if (ctx.session.allServicesFullName[i].includes(ctx.session.selected_service)) check = true;
    }
    if (!check) return ctx.reply(`У нас нет такого сервиса.`)

    for (var i = ctx.session.allServicesFullName.length - 1; i >= 0; i--) {
        if (ctx.session.allServicesFullName[i].includes(ctx.session.selected_service)) {
            ctx.session.selected_service_id = ctx.session.allServicesFullName[i];
            break;
        }
    }
    return ctx.scene.enter("fivesim_scene_2")
});

const fivesim_scene_2 = new BaseScene('fivesim_scene_2');
fivesim_scene_2.enter(async (ctx) => {
    ctx.session.allServicesCost = [];
    ctx.session.allCountries = [];
    ctx.session.allCountriesId = [];

    const result_prices = await getPrices_5sim(ctx.session.selected_service_id);
    const result = Object.getOwnPropertyNames(result_prices[ctx.session.selected_service_id]);

    for (var i = 0; i < result.length; i++) {
        ctx.session.allCountries.push(flags[result[i]]);
        ctx.session.allCountriesId.push(result[i]);
        console.log(ctx.session.allCountries)
    }

    const admin = await $admin.findOne({ uid: 0 })

    for (var i = 0; i < ctx.session.allCountries.length; i++) {
        try {
            const temp = await Object.getOwnPropertyNames(result_prices[ctx.session.selected_service_id][result[i]]);
            ctx.session.allServicesCost.push(Number(result_prices[ctx.session.selected_service_id][result[i]][temp[0]].cost * admin.saleCoefficient_fivesim).toFixed(2));
        } catch (err) {
            await ctx.replyWithMarkdown(`Сервер занят, *попробуйте позже.*`, main_keyboard);
            return ctx.scene.leave();
        }
    }
    ctx.session.pages_count = parseInt(ctx.session.allCountries.length / 15) + 1;

    ctx.session.selected_countries = [];

    for (var i = 0; i < 15; i++) {
        ctx.session.selected_countries.push(Key.callback(`${ctx.session.allCountries[i]} (${ctx.session.allServicesCost[i]} руб․)`, `cost ${ctx.session.allCountriesId[i]} ${ctx.session.allServicesCost[i]}`));
    }

    const keyboard1 = Keyboard.make([
        Key.callback(`⬅️`, `go ${(ctx.session.pages_count - 1) * 15}`),
        Key.callback(`📃 1/${ctx.session.pages_count}`, 'information'),
        Key.callback(`➡️`, `go 15`),
        Key.callback('🔙 Назад')
    ], { columns: 3 });
    const keyboard2 = Keyboard.make(ctx.session.selected_countries, { columns: 2 });
    const keyboard = Keyboard.combine(keyboard2, keyboard1).inline();

      ctx.reply("Выбрать страну:", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Открыть",
                        web_app: {
                            url: "https://quiet-taffy-b3f2ab.netlify.app"
                        }
                    }
                ]
            ]
        }
    })
    
    try {
        await ctx.editMessageText('Выберите страну:', keyboard);
    } catch (err) {
        return ctx.reply('Выберите страну:', keyboard);
    };
});

fivesim_scene_2.action(/go (\d+)$/i, async (ctx) => {

    var checked = false;
    ctx.session.selected_countries = [];
    for (var i = ctx.match[1]; i < Number(ctx.match[1]) + 15 && i < ctx.session.allCountries.length; i++) {
        checked = true;
        ctx.session.selected_countries.push(Key.callback(`${ctx.session.allCountries[i]} (${ctx.session.allServicesCost[i]} руб․)`, `cost ${ctx.session.allCountriesId[i]} ${ctx.session.allServicesCost[i]}`));

    }
    if (!checked) return ctx.answerCbQuery(`Больше нет доступных стран.`);

    var current_page = parseInt(ctx.match[1] / 15) + 1;

    var keyboard1;
    if (ctx.session.selected_countries.length < 15) {
        keyboard1 = Keyboard.make([
            Key.callback(`⬅️`, `go ${Number(ctx.match[1]) - 15}`),
            Key.callback(`📃 ${ctx.session.pages_count}/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go 0`),
            Key.callback('🔙 Назад')
        ], { pattern: [2, 1] });

    } else if (Number(ctx.match[1]) === 0) {
        ctx.session.selected_countries = [];
        for (var i = 0; i < 15; i++) {
            ctx.session.selected_countries.push(Key.callback(`${ctx.session.allCountries[i]} (${ctx.session.allServicesCost[i]} руб․)`, `cost ${ctx.session.allCountriesId[i]} ${ctx.session.allServicesCost[i]}`));
        }
        keyboard1 = Keyboard.make([
            Key.callback(`⬅️`, `go ${(ctx.session.pages_count - 1) * 15}`),
            Key.callback(`📃 1/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go 15`),
            Key.callback('🔙 Назад')
        ], { pattern: [2, 1] });
    } else {
        keyboard1 = Keyboard.make([
            Key.callback(`⬅️`, `go ${Number(ctx.match[1]) - 15}`),
            Key.callback(`📃 ${current_page}/${ctx.session.pages_count}`, 'information'),
            Key.callback(`➡️`, `go ${Number(ctx.match[1]) + 15}`),
            Key.callback('🔙 Назад')
        ], { pattern: [3, 1] });
    }
    const keyboard2 = Keyboard.make(ctx.session.selected_countries, { columns: 2 });
    const keyboard = Keyboard.combine(keyboard2, keyboard1).inline();
    try {
        await ctx.editMessageText('Выберите страну:', keyboard);
    } catch (err) {}
});

fivesim_scene_2.action(/information$/i, async (ctx) => {
    return ctx.scene.enter("fivesim_scene_2");
});

fivesim_scene_2.action(/cost (\w+)\s(.+)$/i, async (ctx) => {
    ctx.session.countryId = ctx.match[1];
    for (var i = ctx.session.allCountriesId.length - 1; i >= 0; i--) {
        if (ctx.session.allCountriesId[i] === ctx.match[1]) {
            ctx.session.countryName = ctx.session.allCountries[i];
        }
    }
    ctx.session.cost = Number(ctx.match[2]);
    return ctx.scene.enter("fivesim_scene_3")
});

fivesim_scene_2.action('🔙 Назад', async (ctx) => {
    return ctx.scene.enter("fivesim_scene")
});

const fivesim_scene_3 = new BaseScene('fivesim_scene_3');
fivesim_scene_3.enter(async (ctx) => {
    const user = await $user.findOne({ id: ctx.from.id })
    const keyboard = Keyboard.make(['🔙 Назад', '✔️ Беру']).inline();
    var sale = Number(Number(ctx.session.cost) - Number(Number(ctx.session.cost) * user.salePercent / 100));

    await ctx.editMessageText(`
⌚️ Номер на 15 минут
Клиент: @${ctx.from.username} (#${ctx.from.id})
Сервис: ${ctx.session.selected_service}
Страна: ${ctx.session.countryName}
Итого։ ${user.salePercent !== 0 ? `<del>${ctx.session.cost}</del>₽ ${sale}₽` : ctx.session.cost + '₽'}
`, keyboard);
    ctx.session.cost = sale;
});

fivesim_scene_3.action(/🔙 Назад$/i, async (ctx) => {
    return ctx.scene.enter("fivesim_scene_2");
});

fivesim_scene_3.action(/✔️ Беру$/i, async (ctx) => {
    const user = await $user.findOne({ id: ctx.from.id })
    if (Number(user.balance) < Number(ctx.session.cost)) return ctx.replyWithMarkdown(`На вашем балансе *недостаточно средств* для покупки данной услуги․`);
    try {
        await ctx.deleteMessage();
    } catch (err) {};
    const result = await getNumber_5sim(ctx.session.countryId, ctx.session.selected_service_id);
    if (!result || !result.id) {
        var items = [
            "CAACAgIAAxkBAAEEfEZiWsMBXfX1ZVEErzMWpzS_MeGEbQACRxEAAgVLoErpHIOC2QoE_yQE",
            "CAACAgIAAxkBAAEEfEhiWsN7fjQk3n74m5dAH6wCZZximgAC-wAD9wLIDwZKNWTYrSivJAQ",
            "CAACAgIAAxkBAAEEfEpiWsOOgMAnZElsJ_lWivnkFj8w7wACfQADwZxgDC0C3IgAAUrikSQE",
            "CAACAgIAAxkBAAEEfExiWsOfiiBHXstf5_LVLLJp7loa3gACYw0AAsUsQUuMXqcxzWXQIyQE",
            "CAACAgIAAxkBAAEEfE5iWsOoA0uF4yhAFXMP9gSrjq9EdAACdQ8AAoq5KEkFiBV6D5IzsCQE",
            "CAACAgIAAxkBAAEEfFBiWsPIdTyeDeWccctQ75UZwxopQQACuAADwZxgDBuRSWGcQFhEJAQ",
            "CAACAgIAAxkBAAEEfFRiWsPrsAN4osEDWFq_OrnFf1SiQgAChQgAAmPCGEgrUK9WUTTOUCQE"
        ]
        var item = items[Math.floor(Math.random() * items.length)];

        await ctx.replyWithSticker(item);
        await ctx.replyWithMarkdown(`😔 К большому сожалению, *номер не был арендован․*\n\nПричина։ *свободных номеров нет*`, main_keyboard);
        return;
    }
    const count_numbers = await $number.countDocuments();

    let number = new $number({
        uid: count_numbers,
        ownerId: ctx.from.id,
        fivesim: true,
        phone: `${result.phone}`,
        numberId: result.id,
        country: ctx.session.countryName,
        countryId: ctx.session.countryId,
        service: ctx.session.selected_service_id,
        fullServiceName: ctx.session.selected_service_id,
        cost: ctx.session.cost,
        date: moment().format(),
        active: true,
        hours: 0.25
    })
    await number.save();

    await user.dec("balance", Number(ctx.session.cost));
    const keyboard = Keyboard.make([
        Key.callback('Закрыть номер', `closeNumber ${result.id}`),
        Key.callback(`Блок/уже занят`, `blockNumber ${result.id}`),
        Key.callback(`Не пришло смс`, `errorNumber ${result.id}`),
        Key.callback(`Добавить в 🍳 Избранное`, `addToTop ${result.id}`)
    ], { pattern: [2, 1, 1] }).inline();
    await ctx.replyWithMarkdown(`
🔍 *Ведётся поиск SMS ...*
💡 Используйте номер в течении 15 минут
`, main_keyboard);
    ctx.replyWithHTML(`
📲Получен номер: 👇
<code>${result.phone}</code>
`, keyboard);
    bot.telegram.sendMessage(adminChat_15minutes, `
${result.phone}
Клиент: @${ctx.from.username} (#${ctx.from.id})
Сервис: ${ctx.session.selected_service}
Страна: ${number.country}
Итого։ ${ctx.session.cost}₽`, { parse_mode: "HTML" });
    return ctx.scene.leave();
});

module.exports = {
    fivesim_scene,
    fivesim_scene_2,
    fivesim_scene_3
}
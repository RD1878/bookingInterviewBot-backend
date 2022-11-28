const TelegramBot = require('node-telegram-bot-api');
const {config} = require('dotenv');
const express = require('express');
const cors = require('cors');

config();

const token = process.env.TELEGRAM_API_TOKEN;
const webUrl = process.env.WEB_APP_URL;
const port = process.env.SERVER_PORT;

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/start') {
        // await bot.sendMessage(chatId, 'Привет. Ниже находится кнопка для перехода к бронированию времени интервью. Нажми на нее', {
        //     reply_markup: {
        //         keyboard: [
        //             [{text: "Забронируй время", web_app: {url: webUrl}}]
        //         ]
        //     }
        // });

        await bot.sendMessage(chatId, 'Привет. Ниже находится кнопка для перехода к бронированию времени интервью. Нажми на нее', {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Забронируй время", web_app: {url: webUrl}}]
                ]
            }
        })
    }

    // if (msg?.web_app_data?.data) {
    //     try {
    //         const data = JSON.parse(msg?.web_app_data?.data);
    //         await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
    //         await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
    //         await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);
    //
    //         setTimeout(async () => {
    //             await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
    //         }, 3000)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }


});

app.post('/', async (req, res) => {
    console.log(req)
    const {queryId, country, street, subject} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Ваши данные',
            input_message_content: {
                message_text: `Ваши данные ${queryId}, ${country}, ${street}, ${subject}`
            }
        })
        return res.status(200).json({'success': 'success'});
    } catch (e) {
        return res.status(500).json({'error': e})
    }
})


app.listen(port, () => console.log('Server started on PORT ' + port));
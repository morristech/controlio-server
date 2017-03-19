# Node.js backend for Controlio #

* `https://api.controlio.co` — production instance

### How do I get set up? ###

Create a .env file in the root directory of Controlio.

Add these environment variables:

API_KEY — любой
JWT_SECRET — любой
MONGO_URL — адрес монго (mongodb://localhost:3333/controlio, например)
SENDGRID_API_KEY — это для посыла имейлов (можешь юзать мой )
TOKEN_SALT — любой
STRIPE_API_KEY — можешь заюзать мой (sk_test_t4v531gxDQirk1hxuRb1PUOM)
TELEGRAM_KEY — любой токен телеграм бота (для посылки логов, сейчас отключен)
TELEGRAM_ID — id, кому слать логи

* `API_KEY` — any string, you will sign all the requests with it
* `JWT_SECRET` — any string, server will use it to salt users' JWT
* `MONGO_URL` — address of the mongo db you're using
* `SENDGRID_API_KEY` — api key for Sendgrid used to send emails, you can use our test one: `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`
* `TOKEN_SALT` — any string, server will use id to salt random tokens we need for magic links and reset password 
* `STRIPE_API_KEY` — api key for Stripe, you can use our test one: `sk_test_YHIgl0QMnM5p0XI6YEPFdhmd`
* `(Optional) TELEGRAM_KEY` — Telegram bot token to send logs
* `(Optional) TELEGRAM_ID` — id of the telegram chat where to send logs

Make sure you don't have conflicts with the environment variables from the ~/.bash_profile or other similar places in the system.

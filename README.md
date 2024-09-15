Что использовалось при создании: typescript, express, pg, knex

Как это запустить: 

1. установить зависимости с помощью команды pnpm i
2. создать .env файл с переменными окружения, примеры переменных находятся в файле .env.sample
3. запустить миграции с помощью команды pnpm knex migrate:latest
4. запустить приложение командой pnpm ts-node index.ts

endpoints

под защитой* === для использования эндпоинта нужно предоставить в заголовке authorization bearer token. токен можно получить после логина

1. генерация ссылки для приглашения (GET /student/generate-referral-link, под защитой* (что значит читать выше))
2. регистрация (POST /student/register, body sample = ```{
    "email": "temp22@gmail.com",
    "password": "12345",
    "fio": "фио",
    "phone": "+11111111111",
    "referralCode": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjEsImlhdCI6MTcyNjQxNzkzMH0.K65tHGFkRzZqu7KW8P0Lr2OT7lpd-GQfZ1zaiLVYFlY" // не обязательно передавать. здесь нужен код из ссылки для приглашения
}```)
3. логин (POST /student/login, body sample = ```{
    "email": "temp22@gmail.com",
    "password": "12345"
}```)
4. обработка оплаты (GET /student/payment, под защитой* (что значит читать выше))
5. статистика приглашенных участников (GET /student/referral-stats/:referrerId)

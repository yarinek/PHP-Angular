# PHP-Angular

## Installation
1. Download [XAMPP](https://www.apachefriends.org/pl/download.html)

2. Download [Composer](https://getcomposer.org/download/)

3. Download [Node.js](https://nodejs.org/en/)

## Run Backend

1. Open XAMPP then run Apache and MySQL servers

2. Open the console and cd your project `backend` directory:
- Rename `.env.example` file to `.env` inside your project root and fill the database information. (windows wont let you do it, so you have to open your console cd your project root directory and run `mv .env.example .env` )
- Run `composer install` or ```php composer.phar install```
- Run `php artisan migrate`
- Run `php artisan serve`

## Run Frontend
1. Open the console and cd your project `frontend` directory
- Run `npm install -g @angular/cli`
- Run `npm install`
- Run `ng serve` to run your project (default: `localhost:4200`)



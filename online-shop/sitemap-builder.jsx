require('babel-register');

const router = require('./routes').default;
const Sitemap = require('react-router-sitemap').default;

(
    new Sitemap(router)
        .build('https://www.starpack.ph')
        .save('./public/sitemap.xml')
);

console.log('Sitemap has been generated!');

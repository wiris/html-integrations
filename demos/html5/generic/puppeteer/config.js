/*
    Config file for puppeteer environments. Values given in this file
*/
const config = {};


config.OPTS = {
  headless: false,
  timeout: 10000,
  devtools: true,
  slowMo: 0,
  defaultViewport: null,
};
config.DEMO_URL = 'http://localhost:8006';


module.exports = config;

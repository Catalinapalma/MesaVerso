// S5 · Configuración de Karma para ejecutar las pruebas Jasmine (ng test).
// Uso local: "ng test" abre Chrome con el reporte de Jasmine en el navegador
// (localhost:9876) y vuelve a correr las pruebas al guardar cambios.
// Uso sin pantalla (terminal/CI): CI=1 ng test --watch=false
module.exports = function (config) {
  const sinPantalla = Boolean(process.env.CI);

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: {
      jasmine: {},
      clearContext: false // Muestra el reporte de Jasmine en el navegador.
    },
    jasmineHtmlReporter: { suppressAll: true },
    // "progress" en la terminal y "kjhtml" en el navegador.
    reporters: ['progress', 'kjhtml'],
    customLaunchers: {
      // Chrome sin ventana; --no-sandbox es necesario en contenedores.
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] }
    },
    // Con ventana por defecto; sin ventana cuando CI está definido.
    browsers: [sinPantalla ? 'ChromeHeadlessCI' : 'Chrome'],
    retryLimit: 0,
    restartOnFileChange: true
  });
};
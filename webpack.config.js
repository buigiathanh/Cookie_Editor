const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        background: './src/background.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build/service_worker'),
        clean: true,
    }
};
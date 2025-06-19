const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        background: './src/background.js',
        ads: './src/ads.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build/libs'),
        clean: true,
    }
};
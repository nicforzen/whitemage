const path = require('path');

module.exports = {
  entry: './src/index.js',
  "mode": "development",
  output: {
    filename: 'whitemage.js',
    globalObject: 'this',
    library: {
      name: 'whm',
      type: 'umd'
    },
    path: path.resolve(__dirname, 'dist'),
  },
};
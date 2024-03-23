import path from 'path';

module.exports = {
  entry: './src/main.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output filename
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Process .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use babel-loader to transpile JavaScript
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Use preset-env for ES6+ support and preset-react for React support
          },
        },
      },
    ],
  },
};

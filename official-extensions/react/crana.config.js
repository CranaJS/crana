module.exports = {
  name: 'react',
  tags: ['frontend'],
  eslint: './eslint.config.json',
  client: {
    babel: './babel.config.json',
  },
  dependencies: {
    'eslint-plugin-react': '^7.4.0',
    'react-hot-loader': '^4.3.12',
    '@babel/preset-react': '^7.0.0'
  },
  template: [
    './template/',
    {
      dependencies: {
        react: '^16.6.3',
        'react-dom': '^16.6.3',
        'react-hot-loader': '^4.3.12'
      }
    }
  ]
};

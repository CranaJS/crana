module.exports = {
  name: 'svelte',
  tags: ['frontend'],
  client: {
    webpack: {
      dev: 'webpack.dev.js',
      prod: 'webpack.prod.js'
    },
  },
  dependencies: {
    'svelte-loader': '^2.9.0',
    svelte: '^2.0.0'
  },
  template: './template/'
};

module.exports = {
  name: 'typescript',
  tags: ['backend', 'frontend'],
  client: {
    babel: './babel.config.json',
  },
  server: {
    startDev: ({ appServer: mainPath }) => `ts-node ${mainPath}/start-server.ts`,
    build: ({ appServer: mainPath, appRootPath: root }) => `tsc ${mainPath}/** --outDir ${root}/build/server`,
    startProd: ({ appRootPath: root }) => `node ${root}/build/server/start-server.js`
  },
  dependencies: {
    'ts-node': '^7.0.1',
    typescript: '^3.1.6',
    '@babel/preset-typescript': '^7.0.1'
  },
  template: [
    './template/',
    {
      dependencies: {
        '@types/node': '^10.12.10',
        '@types/react': '^16.7.7',
        '@types/react-dom': '^16.0.11'
      }
    }
  ]
};

require('ts-node').register({
  project: require('path').join(__dirname, 'tsconfig.json'),
  transpileOnly: true,
  compilerOptions: {
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    module: 'commonjs',
    target: 'ES2021',
    moduleResolution: 'node',
    esModuleInterop: true
  }
});
require('dotenv').config();
require('./src/main');
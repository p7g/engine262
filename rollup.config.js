'use strict';

const fs = require('fs');
const babel = require('rollup-plugin-babel');
const { name, version } = require('./package.json');

const banner = `/*
 * engine262 ${version}
 *
 * ${fs.readFileSync('./LICENSE', 'utf8').trim().split('\n').join('\n * ')}
 */
`;

module.exports = () => ({
  input: './src/api.mjs',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-syntax-object-rest-spread',
        process.env.USE_DO_EXPRESSIONS ? './transform_do.js' : './transform.js',
      ],
    }),
  ],
  treeshake: !process.env.USE_DO_EXPRESSIONS,
  ...process.env.USE_DO_EXPRESSIONS ? {
    acorn: {
      plugins: { doExpressions: true },
    },
    acornInjectPlugins: [(acorn) => {
      acorn.plugins.doExpressions = function doExpressions(instance) {
        instance.extend('parseExprAtom', (superF) => function parseExprAtom(...args) {
          if (this.type === acorn.tokTypes._do) { // eslint-disable-line no-underscore-dangle
            this.eat(acorn.tokTypes._do); // eslint-disable-line no-underscore-dangle
            const node = this.startNode();
            node.body = this.parseBlock();
            return this.finishNode(node, 'DoExpression');
          }
          return Reflect.apply(superF, this, args);
        });
      };
      return acorn;
    }],
  } : {},
  output: [
    {
      file: 'dist/engine262.js',
      format: 'umd',
      sourcemap: true,
      name,
      banner,
    }, {
      file: 'dist/engine262.mjs',
      format: 'es',
      sourcemap: true,
      banner,
    },
  ],
});

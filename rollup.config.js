import babel from 'rollup-plugin-babel'
import baseConfig from './rollup.config-es6'
import {merge} from 'lodash';

const rollupConfig = merge( baseConfig, {
	format: 'cjs',
	plugins: [ babel() ],
});
export default rollupConfig;

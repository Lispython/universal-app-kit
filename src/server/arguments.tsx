import { BUILD_TS, APP_VERSION, BUILD_DT } from '../build_info';

const yargs = require('yargs/yargs')

const argv = yargs(process.argv.slice(2))
    .usage('Universal-app kit \n\nUsage: $0 [options]')
    .help('help').alias('help', 'h')
    .version('version', APP_VERSION).alias('version', 'V')
    .options({
        config: {
            alias: 'i',
            description: "<filename> Config file name",
            requiresArg: true,
            required: true
        }
    })
    .argv;

export default argv;

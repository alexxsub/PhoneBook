import { mergeTypeDefs} from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toMergeTypes = loadFilesSync(path.join(__dirname, '*.gql'))
export default  mergeTypeDefs(toMergeTypes);
        
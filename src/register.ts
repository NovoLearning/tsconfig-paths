import {findPath} from "./find-path";
import * as tsconfig from "tsconfig";

/**
 * Installs a custom module load function that can adhere to paths in tsconfig.
 */
export function register() {

  const cwd = process.cwd();
  const config = readConfig(undefined, cwd);
  const {baseUrl, paths} = config.compilerOptions;
  // console.log(`installModuleLoadForPaths, paths: ${JSON.stringify(paths)}, baseUrl: ${baseUrl}`);

  const Module = require('module');
  const originalLoader = Module._load;
  Module._load = function (request: string) {
    const found = findPath(request, baseUrl, paths);
    if (found) {
      arguments[0] = found
    }
    return originalLoader.apply(this, arguments)
  }

}

function readConfig(project: string | boolean | undefined, cwd: string) {
  const result = tsconfig.loadSync(cwd, typeof project === 'string' ? project : undefined);
  return result.config;
}

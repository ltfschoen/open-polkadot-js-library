const { execSync } = require('child_process');

/**
 * Duplicate of https://github.com/polkadot-js/dev/blob/master/packages/dev/scripts/execSync.js
 */
function execute(cmd: any, noLog: boolean = false) {
  !noLog && console.log(`$ ${cmd}`);

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    process.exit(-1);
  }
};

export {
  execute
}

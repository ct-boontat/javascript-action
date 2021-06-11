const core = require('@actions/core');
const exec = require('@actions/exec');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    const tool = core.getInput('tool');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());

    let myOutput = '';
    let myError = '';
    
    const options = {};
    // options.listeners = {
    //   stdout: (data: buffer) => {
    //     myOutput += data.toString();
    //   },
    //   stderr: (data: buffer) => {
    //     myError += data.toString();
    //   }
    // };

    core.info(`tool to check ${tool}`);

    await exec.exec('which', [tool], options);

    core.info(`Here is your output ${myOutput}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

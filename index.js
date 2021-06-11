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
    options.listeners = {
      stdout: (data) => {
        myOutput += data.toString();
      },
      stderr: (data) => {
        myError += data.toString();
      }
    };

    core.info(`tool to check ${tool}`);

    await exec.exec('which', [tool], options);
    
    if (myOutput.length == 0) {
      core.info(`Tool ${tool} is not installed`);
    } else {
      core.info(`Good new, ${tool} is installed`);
    }

    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

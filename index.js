const core = require('@actions/core');
const exec = require('@actions/exec');
const wait = require('./wait');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const projectName = core.getInput('projectName');
    const libraryPath = core.getInput('libraryPath');
    // const cmd = 'dependency-check --enableExperimental --enableRetired --project $name -s "./library/" -o "./scan-result/result-$mark.html"';
    const cmd = 'dependency-check';
    let mark = new Date().toTimeString();
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

    await exec.exec(cmd, ['--enableExperimental', '--enableRetired', '--project', projectName, '-s', libraryPath, '-o', `./scan-result/result-${mark}.html`], options);
    
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

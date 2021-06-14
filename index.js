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
    let today = new Date();
    let mark = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
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

    await exec.exec(cmd, ['--enableExperimental', '--enableRetired', '--project', projectName, '-s', libraryPath, '-o', `./scan-result/result-${mark}.html`], options);
    
    core.info(`output: ${myOutput}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

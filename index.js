const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const wait = require('./wait');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const projectName = core.getInput('projectName');
    const libraryPath = core.getInput('libraryPath');
    const outputPath = core.getInput('outputPath');
    const cmd = 'dependency-check';
    let today = new Date();
    let mark = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    let myOutput = '';
    let myError = '';

    // create directory
    await io.mkdirP(outputPath);
    
    const options = {};
    options.listeners = {
      stdout: (data) => {
        myOutput += data.toString();
      },
      stderr: (data) => {
        myError += data.toString();
      }
    };

    await exec.exec(cmd, ['--enableExperimental', '--enableRetired', '--project', projectName, '-s', libraryPath, '-o', `./${outputPath}/result-${mark}.html`], options);
    
    core.info(`output: ${myOutput}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

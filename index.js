const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const artifact = require('@actions/artifact');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const projectName = core.getInput('projectName');
    const libraryPath = core.getInput('libraryPath');
    const outputPath = core.getInput('outputPath');
    const artifactName = core.getInput('artifactName');
    const cmd = 'dependency-check';
    let today = new Date();
    let mark = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}_${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    let myOutput = '';
    let myError = '';

    // create directory
    await io.mkdirP(outputPath);
    
    // run dependency check
    const execOptions = {};
    execOptions.listeners = {
      stdout: (data) => {
        myOutput += data.toString();
      },
      stderr: (data) => {
        myError += data.toString();
      }
    };
    let outputFullPath = `./${outputPath}/result-${mark}.html`;
    await exec.exec(cmd, ['--enableExperimental', '--enableRetired', '--project', projectName, '-s', libraryPath, '-o', outputFullPath], execOptions);
    core.info(`output: ${myOutput}`);

    // upload artefact
    const artifactClient = artifact.create();
    const files = [
      outputFullPath
    ];
    const rootDirectory = `./${outputPath}`;
    const artefactOptions = {
        continueOnError: false
    }

    const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, artefactOptions)
    core.info(`output: ${uploadResponse}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

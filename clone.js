const prompt = require('prompt');
const Git = require("nodegit");
const fse = require('fs-extra');

const repoURL = 'https://github.com/johnsonj561/zip-tracker.git';
const cloneDirectory = 'union-shared';

const gitAuthPrompt = {
  properties: {
    username: {
      description: 'Enter GitHub Username'
    },
    password: {
      description: 'Enter GitHub Password',
      hidden: true
    }
  }
};

let cred;

prompt.start();

// Prompt user for github credentials, then begin cloning of repo
prompt.get(gitAuthPrompt, function (err, result) {
  if (result) {
    cred = Git.Cred.userpassPlaintextNew(result.username, result.password);
    cloneRepo(repoURL, cloneDirectory);
  }
});

/*
 * Clone's remote repo from souce to local destination
 * Deletes destination if exists (alternative: pull if exists)
 */
function cloneRepo(src, dst) {
  console.log('\nCloning: ' + src);
  console.log('Destination:' + dst + '\n');
  fse.pathExists(dst).then(exists => {
    if (exists) { // if local directory exists, remove it
      console.log('Removing old directory: ' + dst);
      fse.remove(dst)
        .then(() => console.log(dst + ' removed successfully'))
        .then(() => Git.Clone(src, dst)
          .then(repo => isValidRepo(repo))
        )
        .catch(err => console.log('Error removing ' + dst + '\n' + err))
    } else {
      Git.Clone(src, dst)
        .then(repo => isValidRepo(repo))
    }
  });
};

/*
 * Tests if repo is Repository Instance and logs result
 */
function isValidRepo(repo) {
  if (repo instanceof Git.Repository) console.log('\nRepo Cloned Successfully\n');
  else console.log('\nError Occurred, Repo Was Not Cloned Properly\n');
}

const { exec } = require('child_process');

module.exports = url => {
  switch(process.platform) { // eslint-disable-line
    case 'darwin':
      exec(`open ${ url }`);
      break;
    case 'win31':
      exec(`start ${ url}`);
    break;

  }
};
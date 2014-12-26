function helpCommand (next) {

  next();

  console.log('\n\n\n  Usage:\n\n',
  '    asimov [start]     start application\n',
  '    asimov debug       start app with verbose logging\n',
  '    asimov test        run unit and integration tests\n',
  '    asimov loc         count lines of code in /lib\n',
  '    asimov help        show these instructions\n',
  '\n\n\n');
}

module.exports = helpCommand;
const { startCli } = require('./src/cli');

if (require.main === module) {
  startCli().catch(() => {
    process.stderr.write('Não foi possível iniciar a Sala do Eco.\n');
    process.exitCode = 1;
  });
}

module.exports = { startCli };

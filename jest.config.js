const sh = require('shelljs');

const isWin = /^win/.test(process.platform);
const isMac = /^darwin/.test(process.platform);
const isLinux = /^linux/.test(process.platform);
let os = '';
if (isWin) {
  os = '_win';
} else if (isMac) {
  os = '_macos';
} else if (isLinux) {
  os = '_linux';
}
const web = process.env.NODE_JEST === 'test_web' ? '_web' : '';
const minio = process.env.NODE_JEST === 'test_minio' ? '_minio' : '';

module.exports = async () => {
  const BRANCH_NAME = await new Promise((resolve, reject) => {
    sh.exec(
      'git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3',
      (code, stdout, stderr) => {
        if (code !== 0) {
          const e = new Error();
          e.message = stderr;
          e.name = String(code);
          reject(e);
        } else {
          resolve(stdout);
        }
      }
    );
  });

  return {
    rootDir: './tests',
    verbose: true,
    setupFiles: ['../scripts/setup-tests.js'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/internals/mocks/fileMock.js',
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    moduleDirectories: ['node_modules', 'app/node_modules'],
    testMatch: [
      '**/{unit,e2e,app,test,integration}/**/*.{test,e2e}.{js,tsx,ts,tsx}'
    ],
    testPathIgnorePatterns: ['<rootDir>/extensions'],
    reporters: [
      'default',
      [
        '../node_modules/jest-html-reporter',
        {
          pageTitle: BRANCH_NAME + ' Test Report',
          outputPath:
            './test-reports/' + BRANCH_NAME + os + web + minio + '.html'
        }
      ]
    ],
    collectCoverage: true,
    maxWorkers: 1
  };
};

// Initialize the testing framework
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

// Initialize execute promise
const execute = (script) => new Promise((resolve, reject) => {
  require('child_process').exec(script, (error, stdout) => {
    if (error) reject(error);
    else resolve(stdout);
  });
});

// Begin the rl-stdin tests
describe('safe-delete tests', () => {

  beforeEach((done) => {
    execute(
      'mkdir temp-trash; ' +
      'if test "$(ls ~/.Trash)"; ' +
        'then mv ~/.Trash/* temp-trash/; ' +
      'fi; '
    )
    .then(() => done());
  });

  afterEach((done) => {
    execute('echo "yes" | safe-delete -t; safe-delete temp-trash/*; rm -r temp-trash;')
    .then(() => done());
  });

  it('should delete a file', () => {
    return expect(
      execute('touch test.txt')
      .then(() => execute('if [[ -f test.txt ]]; then safe-delete test.txt; if [[ ! -f test.txt ]]; then printf "true"; else printf "false"; fi; else printf "false"; fi;'))
    ).to.eventually.equal('true');
  });

  it('should delete a directory (empty and non-empty)', () => {
    return expect(
      execute('mkdir test test1; touch test1/test.txt')
      // delete an empty directory then delete a non-empty directory
      .then(() => execute(
        'if [[ -d test ]]; then safe-delete test; if [[ ! -d test ]]; then printf "true"; else printf "false"; fi; else printf "false"; fi; ' +
        'printf "\n"; ' +
        'if [[ -d test1 ]]; then safe-delete test1; if [[ ! -d test1 ]]; then printf "true"; else printf "false"; fi; else printf "false"; fi; '
      ))
    ).to.eventually.equal('true\ntrue');
  });

  it('should accept the wild card argument: *', function() {
    return expect(
      execute('mkdir test; touch test/test.txt test/test1.txt test/test2.txt')
      .then(() => execute(
        'if [[ -d test ]] && [[ -f test/test.txt ]] && [[ -f test/test1.txt ]] && [[ -f test/test2.txt ]]; ' + 
          'then safe-delete test/*; ' + // this should delete all the files within the test directory, but leave the test directory
          'if [[ -d test ]] && [[ ! -f test/test.txt ]] && [[ ! -f test/test1.txt ]] && [[ ! -f test/test2.txt ]]; ' +
            'then printf "true"; del test; ' + 
            ' else printf "false1"; ' + 
            ' fi; ' +
          'else printf "false2"; ' +
        'fi; '
      ))
    ).to.eventually.equal('true');
  });
  
  xit('should follow symlinks');
  
  it('should empty the trash', function() {
    return expect(
      execute('mkdir test; touch test/test.txt; safe-delete test;')
      .then(() => execute(
        'if [[ -d ~/.Trash/test ]] && [[ -f ~/.Trash/test/test.txt ]]; ' +
          'then printf "yes" | safe-delete -trash; ' +
          'if [[ ! -d ~/.Trash/test ]] && [[ ! -f ~/.Trash/test/test.txt ]]; ' +
            'then printf "true"; ' +
            'else printf "false"; ' +
            'fi; ' +
          'else printf "false"; ' +
        'fi;'
      ))
    ).to.eventually.equal('true');
  });
});

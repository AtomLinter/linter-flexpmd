'use babel';

import * as path from 'path';
import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach,
} from 'jasmine-fix';

const { lint } = require('../lib/init.js').provideLinter();

const badFile = path.join(__dirname, 'fixtures', 'SomeBadClass.as');
const goodFile = path.join(__dirname, 'fixtures', 'SomeGoodClass.as');

describe('The FlexPMD provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-flexpmd');
  });

  it('checks a file with syntax warning with flexpmd and reports the correct message', async () => {
    const excerpt = 'The copyright header is missing in this file';
    const editor = await atom.workspace.open(badFile);
    const messages = await lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('warning');
    expect(messages[0].excerpt).toBe(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 9]]);
  });

  it('finds nothing wrong with a valid file using flexpmd', async () => {
    const editor = await atom.workspace.open(goodFile);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });
});

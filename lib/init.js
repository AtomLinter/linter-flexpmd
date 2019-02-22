'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

let helpers;
let flexPmd;
let os;
let fs;
let util;
let readFileAsync;
let unlinkFileAsync;

const REGEX = /<violation beginline="(-?\d+)" endline="(-?\d+)" begincolumn="(-?\d+)" endcolumn="(-?\d+)".* priority="(-?\d+)">(.+?)<\/violation>/g;

const showErrorNotification = (text = 'Unexpected error', description) => {
  atom.notifications.addError(`linter-flexpmd ${text}`, { description });
};

const loadDeps = () => {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!flexPmd) {
    flexPmd = require('flexpmd');
  }
  if (!os) {
    os = require('os');
  }
  if (!fs) {
    fs = require('fs');
  }
  if (!util) {
    util = require('util');
  }
  if (!readFileAsync) {
    readFileAsync = util.promisify(fs.readFile);
  }
  if (!unlinkFileAsync) {
    unlinkFileAsync = util.promisify(fs.unlink);
  }
};

const parseFlexPmdOutput = (output, file, editor) => {
  const messages = [];
  let match = REGEX.exec(output);
  while (match !== null) {
    const line = Number.parseInt(match[1], 10) - 1;
    const col = Number.parseInt(match[3], 10) - 1;
    messages.push({
      severity: 'warning',
      excerpt: match[6],
      location: {
        file,
        position: helpers.generateRange(editor, line, col),
      },
    });
    match = REGEX.exec(output);
  }
  return messages;
};

module.exports = {
  activate() {
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterFlexpmdDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-flexpmd');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterFlexpmdDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe(
        'linter-flexpmd.javaExecutablePath',
        (value) => { this.javaExecutablePath = value; },
      ),
      atom.config.observe(
        'linter-flexpmd.javaMemoryAllocation',
        (value) => { this.javaMemoryAllocation = value; },
      ),
    );
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'flexpmd',
      grammarScopes: ['source.actionscript.3'],
      scope: 'file',
      lintsOnChange: false,
      lint: async (editor) => {
        if (!atom.workspace.isTextEditor(editor)) {
          return null;
        }

        const filePath = editor.getPath();
        if (!filePath) {
          return null;
        }

        loadDeps();

        const tempDir = os.tmpdir();
        const tempPmdFile = `${tempDir}/pmd.xml`;
        const args = [];

        args.push(`-Xmx${this.javaMemoryAllocation || '256m'}`);
        args.push('-jar');
        args.push(flexPmd.cmd);
        args.push('-o', tempDir);
        args.push('-s');

        args.push(filePath);

        const execOptions = {
          stream: 'stderr',
          uniqueKey: `linter-flexpmd::${filePath}`,
          allowEmptyStderr: true,
        };

        let output;
        try {
          output = await helpers.exec(this.javaExecutablePath, args, execOptions);
        } catch (e) {
          if (e.message === 'Process execution timed out') {
            atom.notifications.addInfo('linter-flexpmd: `flexpmd` timed out', {
              description: 'A timeout occured while executing `flexpmd`, it could be due to lower resources '
                           + 'or a temporary overload.',
            });
          } else {
            showErrorNotification(e.message);
          }
          return null;
        }

        // Process was canceled by newer process
        if (output === null) { return null; }

        return readFileAsync(tempPmdFile).then((data) => {
          unlinkFileAsync(tempPmdFile).catch((error) => {
            showErrorNotification('Delete file error', error.message);
            return null;
          });
          return parseFlexPmdOutput(data.toString(), filePath, editor);
        }).catch((error) => {
          showErrorNotification('Read file error', error.message);
          return null;
        });
      },
    };
  },
};

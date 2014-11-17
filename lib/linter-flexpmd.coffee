linterPath = atom.packages.getLoadedPackage('linter').path
Linter = require "#{linterPath}/lib/linter"
findFile = require "#{linterPath}/lib/util"
flexPmd = require 'flexpmd'
fs = require 'fs'
{exec, child} = require('child_process')

class Flexpmdlint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.actionscript.3']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: "java -Xmx256m -jar #{flexPmd.cmd} -o @tempdir -s"

  linterName: 'flexpmd'

  defaultLevel: 'warning'

  errorStream: 'file'

  reportFilePath: 'pmd.xml'

  # A regex pattern used to extract information from the executable's output.
  regex:
    '<violation beginline="(?<lineStart>\\d+)"' +
    ' endline="(?<lineEnd>\\d+)"' +
    ' begincolumn="(?<colStart>\\d+)"' +
    ' endcolumn="(?<colEnd>\\d+)"' +
    '.+?' +
    ' priority="(?<priority>\\d+)"' +
    '>(?<message>.+?)</violation>'

  regexFlags: 's'

  configPath: null

  constructor: (editor) ->
    super(editor)

    atom.config.observe 'linter-flexpmd.javaExecutablePath', =>
      @executablePath = atom.config.get 'linter-flexpmd.javaExecutablePath'

  destroy: ->
    atom.config.unobserve 'linter-flexpmd.javaExecutablePath'

module.exports = Flexpmdlint

var vscode = require('vscode')
var ncp = require('copy-paste')
var EOL = require('os').EOL

function activate(context) {
  var config = vscode.workspace.getConfiguration('sendToTerminal')

  var disposable = vscode.commands.registerCommand('sendToTerminal.run', function () {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    runCommand(editor, config)
  })
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

function buildCommand(command) {
  return command.cmd
}

function clearBeforeRun(config) {
  return config.get('clearBeforeRun')
}

function commands(config) {
  return config.get('commands') || []
}

function matchPattern(pattern, fileName) {
  return pattern && pattern.length > 0 && new RegExp(pattern).test(fileName)
}

function runCommand(editor, config) {
  var _commands = commands(config)
  if (_commands.length === 0) {
    return
  }
  var column = editor.viewColumn
  var document = editor.document
  var fileName = document.fileName

  var command = _commands.find((item) => {
    var pattern = item.match || ''
    var isMatch = pattern.length === 0 || matchPattern(pattern, fileName)
    return isMatch
  })

  if (command == null) {
    return
  }

  var _command = buildCommand(command)

  command = clearBeforeRun(config) ? ` clear; ${_command}` : ` ${_command}`
  ncp.paste((err, clipboard) => {
    ncp.copy(command + EOL, () => {
      vscode.commands.executeCommand('workbench.action.terminal.focus').then(() => {
        vscode.commands.executeCommand('workbench.action.terminal.paste').then(() => {
          vscode.window.showTextDocument(editor.document, column)
          ncp.copy(clipboard)
        })
      })
    })
  })
}

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
    var command = `echo '${editor.document.fileName}'`
    runCommand(command, editor, config)
  })
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

function clearBeforeRun(config) {
  return config.get('clearBeforeRun')
}

function runCommand(command, editor, config) {
  var column = editor.viewColumn
  command = clearBeforeRun(config) ? ` clear; ${command}` : ` ${command}`
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

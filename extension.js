var vscode = require('vscode')
var ncp = require('copy-paste')
var EOL = require('os').EOL

function activate(context) {
  var disposable = vscode.commands.registerCommand('sendToTerminal.run', function () {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    var column = editor.viewColumn
    var command = `echo '${editor.document.fileName}'`
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
  })
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

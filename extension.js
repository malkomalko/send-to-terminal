var vscode = require('vscode')

function activate(context) {
  var disposable = vscode.commands.registerCommand('sendToTerminal.run', function () {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    vscode.window.showInformationMessage(editor.document.fileName)
  });
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

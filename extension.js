var vscode = require('vscode')

function activate(context) {
  var disposable = vscode.commands.registerCommand('extension.sendToTerminal', function () {
    console.log('Sending to terminal...')
  });
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate

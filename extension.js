var vscode = require('vscode')
var path = require('path')
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

function buildCommand(command, editor) {
  var document = editor.document
  var cmdStr = command.cmd
  var extName = path.extname(document.fileName)
  var root = vscode.workspace.rootPath
  var relativeFile = "." + document.fileName.replace(root, "")

  cmdStr = cmdStr.replace(/\${relativeFile}/g, relativeFile)
  cmdStr = cmdStr.replace(/\${file}/g, `${document.fileName}`)
  cmdStr = cmdStr.replace(/\${workspaceRoot}/g, `${vscode.workspace.rootPath}`)
  cmdStr = cmdStr.replace(/\${fileBasename}/g, `${path.basename(document.fileName)}`)
  cmdStr = cmdStr.replace(/\${fileDirname}/g, `${path.dirname(document.fileName)}`)
  cmdStr = cmdStr.replace(/\${fileExtname}/g, `${extName}`)
  cmdStr = cmdStr.replace(/\${fileBasenameNoExt}/g, `${path.basename(document.fileName, extName)}`)
  cmdStr = cmdStr.replace(/\${cwd}/g, `${process.cwd()}`)

  // replace environment variables ${env.Name}
  cmdStr = cmdStr.replace(/\${env\.([^}]+)}/g, (sub, envName) => {
    return process.env[envName]
  })

  return cmdStr
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

  var _command = buildCommand(command, editor)

  command = clearBeforeRun(config) ? ` clear; ${_command}` : ` ${_command}`
  ncp.paste((err, clipboard) => {
    ncp.copy(command + EOL, () => {
      vscode.commands.executeCommand('workbench.action.terminal.focus').then(() => {
        vscode.commands.executeCommand('workbench.action.terminal.paste').then(() => {
          vscode.window.showTextDocument(document, column)
          ncp.copy(clipboard)
        })
      })
    })
  })
}

# send-to-terminal README

send-to-terminal allows you to run custom commands to the active Terminal that match specific patterns that you define.  Out of the box there is no default configuration, so you will have to set this up yourself.

## Features

The first thing you'll want to do is set a few configuration options in your User Settings.  Setting it up for rspec looks like this:

```
    "sendToTerminal.commands": [{
        "match": "_spec\\.rb$",
        "cmd": "./bin/rspec ${relativeFile}"
    }, {
        "match": ".*",
        "cmd": "echo 'Please add an entry to \"sendToTerminal.commands\" for \"${fileExtname}\"'"
    }],
    "sendToTerminal.focusCommands": [{
        "match": "_spec\\.rb$",
        "cmd": "./bin/rspec ${relativeFile}:${line}"
    }],
```

You'll notice that we're using tokens like ${relativeFile}.  Here's a full list of all the tokens:

* ${column}
* ${cwd}
* ${env.Name} // replace environment variables
* ${file}
* ${fileBasename}
* ${fileBasenameNoExt}
* ${fileDirname}
* ${fileExtname}
* ${line}
* ${relativeFile}
* ${workspaceRoot}

## Commands

* `sendToTerminal.run` (Send to Terminal - Run): Run the current file if it can find a matching pattern in `sendToTerminal.commands`.
* `sendToTerminal.runFocus` (Send to Terminal - Run Focus): Optionally run a focused version (think test) if it can find a matching pattern in `sendToTerminal.focusCommands`.
* `sendToTerminal.runLast` (Send to Terminal - Run Last): Run the last command.  This is useful if you are in another file and you want to run the last test.

## Extension Settings

* `sendToTerminal.clearBeforeRun` (default `false`): Set to `true` if you would like to clear the terminal before every run.
* `sendToTerminal.commands`: Array of focus commands used with `sendToTerminal.run`.
* `sendToTerminal.focusCommands`: Array of focus commands used with `sendToTerminal.runFocus`.

## Requirements

N/A

## Known Issues

N/A

## Release Notes

### 0.0.1

Initial release

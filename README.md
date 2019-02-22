linter-flexpmd
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [FlexPMD](https://github.com/apache/flex-utilities/tree/develop/FlexPMD) for linting/analyzing ActionScript/Flash/Flex/AIR code.

## Installation

1. Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

2. [language-actionscript3](https://atom.io/packages/language-actionscript3) package must be installed.
```
$ apm install language-actionscript3
```

3. FlexPMD tool requires Java, so you need install it first.

Now you can proceed to install the linter-flexpmd plugin.

### Plugin installation
```
$ apm install linter-flexpmd
```

## Settings
You can configure linter-flexpmd by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```
'linter-flexpmd':
  'javaExecutablePath': null #java path. run 'which java' to find the path
```

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass coffeelint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!

## Donation
[![Share the love!](https://chewbacco-stuff.s3.amazonaws.com/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8)

[![donate-paypal](https://s3-eu-west-1.amazonaws.com/chewbacco-stuff/donate-paypal.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8)

[Donate Bitcoins](https://www.coinbase.com/checkouts/2945dab392cb1cefbb7097e4cd17a603)

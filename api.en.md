# Technologies API

The package includes the following technologies:

* [browser-js](#browser-js) – JavaScript build for working in the browser.
* [node-js](#node-js) – JavaScript build for working in Node.js.

## browser-js

Builds the source JS files for blocks to be used for working in the browser.

The build includes the files with code that will work in any runtime environment (with the extension `.vanilla.js`), as well as files with code that will only work in the browser (with the extension `.browser.js` or `.js`).

### Options

Options are specified in the `.enb/ make.js` configuration file.

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [iife](#iife)
* [compress](#compress)
* [sourcemap](#sourcemap)
* [includeYM](#includeym)

### target

Type: `String`. Default: `?.browser.js`.

The name of the file for saving the result of building the necessary JS files for the project – the compiled `?.browser.js file.`

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The file list is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['vanilla.js', 'js', 'browser.js']`.

Suffixes of files for filtering out files with JS code.

#### iife

Type: `Boolean`. Default: `false`.

Isolates the code of the blocks by wrapping the code of each file in [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression).

#### compress

Type: `Boolean`. Default: `false`.

Minimizing the resulting JS code using [UglifyJS](https://github.com/mishoo/UglifyJS2).

#### sourcemap

Type: `Boolean`. Default: `false`.

Creates source maps with information about the source files.

The maps are included in a compiled file called `? .files` – they are not stored in separate files with a `.map` extension.

#### includeYM

Type: `Boolean`. Default: `false`.

Adds the [ YModules](https://github.com/ymaps/modules/blob/master/README.md) code at the beginning of the file.

**Example**

```js
/* Code for blocks in the file system before the build
* blocks/
* ├── block.vanilla.js
* └── block.browser.js
* └── block.js
*
* After the build
* bundle/
* └── bundle.browser.js
*/

var BrowserJsTech = require('enb-js/techs/browser-js'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the list of files for the build
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Compiling the JS file for working in the browser
        node.addTech(BrowserJsTech);
        node.addTarget('?.browser.js');
    });
};
```

## node-js

Builds the source JS files for blocks to be used for working in Node.js.

The build includes the files with code that will work in any runtime environment (with the extension `.vanilla.js`), as well as files with code that will only work in Node.js (with the extension `.node.js`).

By default, all source files are connected using `require`. The paths are processed relative to the file that specifies `require`.

For the build to work correctly, all the source files must exist. To assemble the code into a single independent file (which does not require the source files to be present), use the [bundled](#bundled) option.

### Options

Options are specified in the `.enb/make.js` configuration file.

* [target](#target-1)
* [filesTarget](#filestarget-1)
* [sourceSuffixes](#sourcesuffixes-1)
* [devMode](#devmode)
* [bundled](#bundled)
* [includeYM](#includeym-1)

#### target

Type: `String`. Default: `?.node.js`.

The name of the file for saving the build result of the necessary project JS files – the compiled `?.node.js` file.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The file list is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['vanilla.js', 'node.js']`.

Suffixes of files for filtering out files with JS code.

#### devMode

Type: `Boolean`. Default: `true`.

Build mode for development. The Node.js cache is not taken into account for each build. This allows you to see changes without restarting Node.js.

#### bundled

Type: `Boolean`. Default: `false`.

Compiles all source files into one file.

When using this option, there is no need to store the source JS files for executing the compiled file.

#### includeYM

Type: `Boolean`. Default: `false`.

Provides [YModules](https://github.com/ymaps/modules/blob/master/README.md) to the `modules` global variable.

**Example**

```js
/* Код блоков в файловой системе до сборки
* blocks/
* ├── block.vanilla.js
* └── block.node.js
*
* После сбоки
* bundle/
* └── bundle.node.js
*/

var NodeJsTech = require('enb-js/techs/node-js'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the list of files for the build
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Compiling the JS file for working in Node.js
        node.addTech(NodeJsTech);
        node.addTarget('?.node.js');
    });
};
```

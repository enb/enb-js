var EOL = require('os').EOL;

/**
 * @class BrowserJsTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Builds JavaScript files for browsers. <br/><br/>
 *
 * Compiles any files which contains JavaScript code for browsers:
 * `vanilla.js` – isomorphic code, which can be used on client side and server side;
 * `js` and `browser.js` – code, which could be used only on client side.
 *
 * @param {Object}    [options]                                                    Options
 * @param {String}    [options.target='?.browser.js']                              Path to compiled file.
 * @param {String}    [options.filesTarget='?.files']                              Path to a target with FileList<br>
 *                                                                                 {@link http://bit.ly/1GTUOj0}
 * @param {String[]}  [options.sourceSuffixes=['vanilla.js', 'js', 'browser.js']]  Files with specified suffixes<br>
 *                                                                                 involved in the assembly.
 * @param {Boolean}   [options.iife=false]                                         Adds an option to wrap merged<br>
 *                                                                                 files to IIFE.
 *
 * @example
 * // Code in a file system before build:
 * // blocks/
 * // ├── block.vanilla.js
 * // └── block.browser.js
 * // └── block.js
 * //
 * // After build:
 * // bundle/
 * // └── bundle.browser.js
 *
 * var BrowserJsTech = require('enb-diverse-js/techs/browser-js'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bem.levels, levels: ['blocks']],
 *             bem.deps,
 *             bem.files
 *         ]);
 *
 *         // build browser.js file
 *         node.addTech(BrowserJsTech);
 *         node.addTarget('?.browser.js');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('browser-js')
    .target('target', '?.browser.js')
    .useFileList(['vanilla.js', 'js', 'browser.js'])
    .defineOption('iife', false)
    .justJoinFiles(function (filename, contents) {
        var relPath = this.node.relativePath(filename);

        if (this._iife) {
            contents = [
                '(function(){',
                contents,
                '}());'
            ].join(EOL);
        }
        return [
            '/* begin: ' + relPath + ' */',
            contents,
            '/* end: ' + relPath + ' *' + '/'
        ].join(EOL);
    })
    .createTech();

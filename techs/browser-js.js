var vow = require('vow'),
    enb = require('enb'),
    vfs = enb.asyncFS || require('enb/lib/fs/async-fs'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    utils = require('enb-source-map/lib/utils'),
    File = require('enb-source-map/lib/file'),
    minify = require('uglify-js').minify;

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
 * @param {Boolean}   [options.compress=false]                                     Minifies and compresses JS code.
 * @param {Boolean}   [options.sourcemap=false]                                    Includes inline source maps.
 * @param {Boolean}   [options.includeYM=false]                                    Prepends code of YModules.
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
 *     bemTechs = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bemTechs.levels, levels: ['blocks']],
 *             [bemTechs.deps],
 *             [bemTechs.files]
 *         ]);
 *
 *         // build browser.js file
 *         node.addTech(BrowserJsTech);
 *         node.addTarget('?.browser.js');
 *     });
 * };
 */
module.exports = buildFlow.create()
    .name('browser-js')
    .target('target', '?.browser.js')
    .useFileList(['vanilla.js', 'js', 'browser.js'])
    .defineOption('includeYM', false)
    .defineOption('iife', false)
    .defineOption('compress', false)
    .defineOption('sourcemap', false)
    .builder(function (sourceFiles) {
        var promises = [this._readSourceFiles(sourceFiles)];

        if (this._includeYM) {
            promises.push(this._readYM());
        }

        return vow.all(promises)
            .spread(function (sources, ymSource) {
                var node = this.node,
                    file = new File(node.resolvePath(this._target), { sourceMap: this._sourcemap }),
                    needWrapIIFE = this._iife,
                    needToAddComments = !this._compress,
                    compressOptions = { fromString: true },
                    compressed;

                if (ymSource) {
                    file.writeFileContent(node.relativePath(ymSource.path), ymSource.contents);
                }

                sources.forEach(function (source) {
                    needToAddComments && file.writeLine('/* begin: ' + source.relPath + ' */');
                    needWrapIIFE && file.writeLine('(function(){');
                    file.writeFileContent(source.relPath, source.contents);
                    needWrapIIFE && file.writeLine('}());');
                    needToAddComments && file.writeLine('/* end: ' + source.relPath + ' */');
                });

                if (!this._compress) {
                    return file.render();
                }

                if (!this._sourcemap) {
                    return minify(file.render(), compressOptions).code;
                }

                compressOptions.inSourceMap = file.getSourceMap();
                compressOptions.outSourceMap = this._target + '.map';

                compressed = minify(file.getContent(), compressOptions);
                return utils.joinContentAndSourceMap(compressed.code, compressed.map);
            }, this);
    })
    .methods({
        /**
         * Reads source js files.
         *
         * @protected
         * @param {FileList} files
         * @returns {FileData[]}
         */
        _readSourceFiles: function (files) {
            var node = this.node;

            return vow.all(files.map(function (file) {
                return vfs.read(file.fullname, 'utf8')
                    .then(function (contents) {
                        return {
                            path: file.fullname,
                            relPath: node.relativePath(file.fullname),
                            contents: contents
                        };
                    });
            }));
        },
        /**
         * Reads source code of YModules.
         *
         * @protected
         * @returns {Promise}
         */
        _readYM: function () {
            var filename = require.resolve('ym');

            return vfs.read(filename, 'utf-8')
                .then(function (contents) {
                    return {
                        path: filename,
                        contents: contents
                    };
                });
        }
    })
    .createTech();

var EOL = require('os').EOL,
    browserify = require('browserify'),
    promisify = require('vow-node').promisify;

/**
 * @class NodeJsTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Builds JavaScript files for Node.js. <br/><br/>
 *
 * Compiles any files which contains JavaScript code for Node.js:
 * `vanilla.js` – isomorphic code, which can be used on client side and server side;
 * `node.js` – code, which could be used only on Node.js.
 *
 * @param {Object}    [options]                                           Options
 * @param {String}    [options.target='?.node.js']                        Path to compiled file.
 * @param {String}    [options.filesTarget='?.files']                     Path to a target with FileList<br>
 *                                                                        {@link http://bit.ly/1GTUOj0}
 * @param {String[]}  [options.sourceSuffixes=['vanilla.js', 'node.js']]  Files with specified suffixes involved<br>
 *                                                                        in the assembly.
 * @param {Boolean}   [options.devMode=true]                              Drops cache for `require` of source modules.
 * @param {Boolean}   [options.bundled=false]                             Builds CommonJS files in one file.
 *
 * @example
 * // Code in a file system before build:
 * // blocks/
 * // ├── block.vanilla.js
 * // └── block.node.js
 * //
 * // After build:
 * // bundle/
 * // └── bundle.node.js
 *
 * var NodeJsTech = require('enb-diverse-js/techs/node-js'),
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
 *         // build node.js file
 *         node.addTech(NodeJsTech);
 *         node.addTarget('?.node.js');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('node-js')
    .target('target', '?.node.js')
    .useFileList(['vanilla.js', 'node.js'])
    .defineOption('devMode', true)
    .defineOption('bundled', false)
    .builder(function (sourceFiles) {
        var node = this.node,
            dropRequireCacheFunc = [
                'function dropRequireCache(requireFunc, filename) {',
                '    var module = requireFunc.cache[filename];',
                '    if (module) {',
                '        if (module.parent) {',
                '            if (module.parent.children) {',
                '                var moduleIndex = module.parent.children.indexOf(module);',
                '                if (moduleIndex !== -1) {',
                '                    module.parent.children.splice(moduleIndex, 1);',
                '                }',
                '            }',
                '            delete module.parent;',
                '        }',
                '        delete module.children;',
                '        delete requireFunc.cache[filename];',
                '    }',
                '};'
            ].join(EOL),
            devMode = this._devMode || '';

        if (this._bundled) {
            var files = sourceFiles.map(function (file) {
                    return node.relativePath(file.fullname);
                }),
                browserifyOptions = {
                    basedir: node.getDir(),
                    builtins: [],
                    bundleExternal: false
                },
                renderer = browserify(files, browserifyOptions),
                bundle = promisify(renderer.bundle.bind(renderer));

            return bundle()
                .then(function (buf) {
                    return buf.toString('utf-8');
                });
        }

        return [
            devMode && dropRequireCacheFunc,
            sourceFiles.map(function (file) {
                var relPath = node.relativePath(file.fullname);

                return [
                    devMode && 'dropRequireCache(require, require.resolve("' + relPath + '"));',
                    'require("' + relPath + '");'
                ].join(EOL);
            }).join(EOL)
        ].join(EOL);
    })
    .createTech();

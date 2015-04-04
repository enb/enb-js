/**
 * node-js
 * =======
 *
 * Собирает *vanilla.js* и *node.js*-файлы по deps'ам с помощью `require`, сохраняет в виде `?.node.js`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.node.js`.
 * * *Array<String>* **source** — Суффиксы файлов, из которых собирается таргет.
 *   По умолчанию — `['vanilla.js', 'node.js']`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-diverse-js/techs/node-js'));
 * ```
 */
module.exports = require('enb/lib/build-flow').create()
    .name('node-js')
    .target('target', '?.node.js')
    .useSourceResult('filesTarget', '?.files')
    .defineOption('source', ['vanilla.js', 'node.js'])
    .builder(function (sourceFiles) {
        var node = this.node;
        var dropRequireCacheFunc = [
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
            ].join('\n');

        return [
            dropRequireCacheFunc,
            sourceFiles.items.filter(function (item) {
                return this._source.indexOf(item.suffix) > -1;
            }, this).map(function (file) {
                var relPath = node.relativePath(file.fullname);

                return [
                    'dropRequireCache(require, require.resolve("' + relPath + '"));',
                    'require("' + relPath + '")'
                ].join('\n');
            }).join('\n')
        ].join('\n');
    })
    .createTech();

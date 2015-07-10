/**
 * browser-js
 * ==========
 *
 * Склеивает *vanilla.js*, *js* и *browser.js*-файлы по deps'ам, сохраняет в виде `?.browser.js`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.browser.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-diverse-js/techs/browser-js'));
 * ```
 */
var EOL = require('os').EOL;
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

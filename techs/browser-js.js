/**
 * browser-js
 * ==========
 *
 * Склеивает *vanilla.js*, *js* и *browser.js*-файлы по deps'ам, сохраняет в виде `?.browser.js`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.browser.js`.
 * * *Array<String>* **source** — Суффиксы файлов, из которых собирается таргет.
 *   По умолчанию — `['vanilla.js', 'js', 'browser.js']`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-diverse-js/techs/browser-js'));
 * ```
 */
module.exports = require('enb/lib/build-flow').create()
    .name('browser-js')
    .target('target', '?.browser.js')
    .useSourceResult('filesTarget', 'target')
    .defineOption('source', ['vanilla.js', 'js', 'browser.js'])
    .builder(function (sourceFiles) {
        return this._joinFiles(sourceFiles.items.filter(function (item) {
            return this._source.indexOf(item.suffix) > -1;
        }, this));
    })
    .createTech();

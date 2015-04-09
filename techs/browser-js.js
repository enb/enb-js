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
        var files = sourceFiles.items.filter(function(item) { return this._source.indexOf(item.suffix) > -1; }, this),
            suffixIndexes = this._source.reduce(function(prev, suffix, i, array) {
                prev[suffix] = array.indexOf(suffix);
                return prev;
            }, {}),
            getPathWithoutSuffix = function (path, suffix) { return path.substr(0, path.length - suffix.length); };
        /*
         {
         '/prj/b1' : ['/prj/b1.node.js', '/prj/b1.vanilla.js'],
         '/prj/b1_mod': ...
         }
         */
        var filesBySuffixes = {},
            sortedFiles = [];

        for(var i = 0, entity; i < files.length; i += 1) {
            entity = getPathWithoutSuffix(files[i].fullname, files[i].suffix);
            if(!filesBySuffixes[entity]) filesBySuffixes[entity] = [];
            filesBySuffixes[entity].push(files[i]);
        }

        // сортировка сущностей по суффиксам и конкатенация в общий массив
        Object.keys(filesBySuffixes).forEach(function(key) {
            sortedFiles = sortedFiles.concat(filesBySuffixes[key].sort(function(a, b) {
                return suffixIndexes[a.suffix] - suffixIndexes[b.suffix];
            }));
        });

        return this._joinFiles(sortedFiles);
    })
    .createTech();

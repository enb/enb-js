API технологий
==============

Пакет предоставляет следующие технологии:

* [browser-js](#browser-js) — сборка JS-кода для работы в браузере.
* [node-js](#node-js) — сборка JS-кода для работы в `Node.js`.

browser-js
----------

Собирает исходные JS-файлы блоков, предназначенные для работы в браузере.

В сборку попадают как файлы, код которых будет работать в любой среде исполнения (с расширением `.vanilla.js`), так и файлы, код которых может работать только в браузере (с расширением `.browser.js` или `.js`).

### Опции

Опции указываются в конфигурационном файле `.enb/make.js`.

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [iife](#iife)
* [compress](#compress)
* [sourcemap](#sourcemap)
* [includeYM](#includeym)

### target

Тип: `String`. По умолчанию: `?.browser.js`.

Имя файла, куда будет записан результат сборки необходимых JS-файлов проекта —
скомпилированный файл `?.browser.js`

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://ru.bem.info/tools/bem/enb-bem-techs/readme#files)
пакета [enb-bem-techs](https://ru.bem.info/tools/bem/enb-bem-techs/readme/).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['vanilla.js', 'js', 'browser.js']`.

Суффиксы файлов, по которым отбираются файлы с JS-кодом.

#### iife

Тип: `Boolean`. По умолчанию: `false`.

Изолирует код блоков друг от друга, оборачивая код каждого файла в [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression).

#### compress

Тип: `Boolean`. По умолчанию: `false`.

Минимизация итогового JS-кода с помощью [UglifyJS](https://github.com/mishoo/UglifyJS2).

#### sourcemap

Тип: `Boolean`. По умолчанию: `false`.

Построение карт кода (source maps) с информацией об исходных файлах.

Карты встраиваются в скомпилированный файл `?.files`, а не хранятся в отдельном файле с расширением `.map`.

#### includeYM

Тип: `Boolean`. По умолчанию: `false`.

Добавляет код [YModules](https://ru.bem.info/tools/bem/modules/) в начало файла.

--------------------------------------

**Пример**

```js
 // Код блоков в файловой системе до сборки
 // blocks/
 // ├── block.vanilla.js
 // └── block.browser.js
 // └── block.js
 //
 // После сбоки
 // bundle/
 // └── bundle.browser.js

var BrowserJsTech = require('enb-js/techs/browser-js'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получение списка файлов для сборки
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Сборка JS-файл для работы в браузере
        node.addTech(BrowserJsTech);
        node.addTarget('?.browser.js');
    });
};
```

node-js
-------

Собирает исходные JS-файлы блоков, предназначенные для работы в `Node.js`.

В сборку попадают как файлы, код которых будет работать в любой среде исполнения (с расширением `.vanilla.js`), так и файлы, код которых может работать только в Node.js (с расширением `.node.js`).

По умолчанию все исходные файлы подключаются с помощью `require`. Пути обрабатываются относительно того файла, в котором написан `require`.

Для корректной работы требуется наличие всех исходных файлов. Чтобы собрать код в один независимый файл (не требующий наличия исходных файлов), необходимо использовать опцию [bundled](#bundled).

### Опции

Опции указываются в конфигурационном файле `.enb/make.js`.

* [target](#target-1)
* [filesTarget](#filestarget-1)
* [sourceSuffixes](#sourcesuffixes-1)
* [devMode](#devmode)
* [bundled](#bundled)
* [includeYM](#includeym-1)

#### target

Тип: `String`. По умолчанию: `?.node.js`.

Имя файла, куда будет записан результат сборки необходимых JS-файлов проекта —
скомпилированный файл `?.node.js`.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb-bem/enb-bem-techs/blob/master/docs/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb-bem/enb-bem-techs/blob/master/README.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['vanilla.js', 'node.js']`.

Суффиксы файлов, по которым отбираются файлы с JS-кодом.

#### devMode

Тип: `Boolean`. По умолчанию: `true`.

Режим сборки, предназначенный для разработки. При каждом выполнении кэш Node.js не будет учитываться. Это позволяет видеть изменения без перезапуска Node.js.

#### bundled

Тип: `Boolean`. По умолчанию: `false`.

Собирает все исходные файлы в один файл.

При использовании этой опции отпадает необходимость в хранении исходных JS-файлов для выполнения собранного файла.

#### includeYM

Тип: `Boolean`. По умолчанию: `false`.

Предоставляет [YModules](https://ru.bem.info/tools/bem/modules/) в глобальную переменную `modules`.

--------------------------------------

**Пример**

```js
// Код блоков в файловой системе до сборки:
// blocks/
// ├── block.vanilla.js
// └── block.node.js
//
// После сбоки:
// bundle/
// └── bundle.node.js

var NodeJsTech = require('enb-js/techs/node-js'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получение списка файлов для сборки
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Сборка JS-файл для работы в Node.js
        node.addTech(NodeJsTech);
        node.addTarget('?.node.js');
    });
};
```

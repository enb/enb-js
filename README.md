enb-js
======

[![NPM version](https://img.shields.io/npm/v/enb-js.svg?style=flat)](https://www.npmjs.org/package/enb-js)
[![Build Status](https://img.shields.io/travis/enb/enb-js/master.svg?style=flat&label=tests)](https://travis-ci.org/enb/enb-js)
[![Coverage Status](https://img.shields.io/coveralls/enb/enb-js.svg?style=flat)](https://coveralls.io/r/enb/enb-js?branch=master)
[![Dependency Status](https://img.shields.io/david/enb/enb-js.svg?style=flat)](https://david-dm.org/enb/enb-js)

Пакет предоставляет набор [ENB](https://ru.bem.info/tools/bem/enb-bem/)-технологий для сборки
JavaScript-кода в проектах, построенных по [методологии БЭМ](https://ru.bem.info/method/).

**Технологии пакета `enb-js`:**

* [browser-js](api.ru.md#browser-js)
* [node-js](api.ru.md#node-js)

Принципы работы технологий и их API описаны в документе [API технологий](api.ru.md).

## Установка

Установите пакет `enb-js`:

```sh
$ npm install --save-dev enb-js
```

**Требования:** зависимость от пакета `enb` версии `0.16.0` или выше.

<!-- TOC -->
- [Быстрый старт](#Быстрый-старт)
- [Особенности технологий пакета](#Особенности-технологий-пакета)
  - [Изоморфный JavaScript](#Изоморфный-javascript)
  - [Отладка кода](#Отладка-кода)
    - [Source Maps](#source-maps)
    - [Режим разработки для Node.js](#Режим-разработки-для-nodejs)
  - [Изоляция кода исходных блоков](#Изоляция-кода-исходных-блоков)
  - [Минимизация кода](#Минимизация-кода)
- [Лицензия](#Лицензия)

<!-- TOC END -->


Быстрый старт
-------------

Чтобы собрать JS-код для исполнения в браузере, подключите технологию [browser-js](api.ru.md#browser-js), а для работы в `Node.js` — [node-js](api.ru.md#node-js).

```js
var BrowserJsTech = require('enb-js/techs/browser-js'),
    NodeJsTech = require('enb-js/techs/node-js'),
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
        node.addTech([BrowserJsTech, { /* опции технологии */ }]);
        node.addTarget('?.browser.js');

        // Сборка JS-файл для работы в Node.js
        node.addTech([NodeJsTech, { /* опции технологии */ }]);
        node.addTarget('?.browser.js');
    });
};
```

Особенности технологий пакета
-----------------------------

### Изоморфный JavaScript

Термин «изоморфность» означает возможность выполнения одного и того же кода как в браузере, так и в `Node.js`.

Предполагается, что в файловой системе код блоков разделяется по файлам с разными расширениями, которые обозначают в какой среде может работать данный код:

* `*.vanilla.js` — файлы, код которых может работать как в бразуере, так и в `Node.js`.
* `*.js` и `*.browser.js` — файлы, код которых может работать только в браузере.
* `*.node.js` — файлы, код которых может работать только в `Node.js`.

### Отладка кода

#### Source Maps

Для удобной отладки кода в браузере следует включить генерацию карт кода с помощью опции [sourcemaps](api.ru.md#sourcemaps).

#### Режим разработки для Node.js

Для сборки файлов, предназначенных для исполнения в Node.js, существует специальный режим, удобный для разработки.

После сборки итоговый файл не содержит исходного кода блоков, а лишь подключает необходимые файлы с помощью `require`.

```js
require('../blocks/utils/utils.node.js');
require('../blocks/page/page.node.js');
```

При таком подходе сообщения об ошибках будут указывать на код из исходных файлов. Кроме того, при каждом выполнении собранного файла кэш Node.js не будет учитываться. Это позволяет видеть изменения без перезапуска Node.js.

Настроить сборку для выкладки в production можно с помощью опций [devMode](api.ru.md#devmode) или [bundled](api.ru.md#bundled).

### Изоляция кода исходных блоков

При обычной сборке JS-кода, предназначенного для работы в браузере, один блок может некорректно влиять на работу другого блока.

```js
/* begin: blocks/greeting/greeting.js */
var message = 'Кукусики!';

onStart(function () {
    alert(message);
});
/* end: blocks/greeting/greeting.js */
/* begin: blocks/parting/parting.js */
var message = 'Я буду скучать...';

onEnd(function () {
    alert(message);
});
/* end: blocks/parting/parting.js */
```

Чтобы исключить подобное влияние, следует использовать опцию [iife](api.ru.md#iife), которая обернет код каждого исходного файла с помощью [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression).

### Минимизация кода

Для минимизации JS-кода используется [UglifyJS](https://github.com/mishoo/UglifyJS2).

Включить минимизацию можно с помощью опции [compress](api.ru.md#compress).

Лицензия
--------

© 2014 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).

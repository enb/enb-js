enb-diverse-js 
==============

[![NPM version](https://img.shields.io/npm/v/enb-diverse-js.svg?style=flat)](https://www.npmjs.org/package/enb-diverse-js) 
[![Build Status](https://img.shields.io/travis/enb-make/enb-diverse-js/master.svg?style=flat&label=tests)](https://travis-ci.org/enb-make/enb-diverse-js) 
[![Coverage Status](https://img.shields.io/coveralls/enb-make/enb-diverse-js.svg?style=flat)](https://coveralls.io/r/enb-make/enb-diverse-js?branch=master) 
[![Dependency Status](https://img.shields.io/david/enb-make/enb-diverse-js.svg?style=flat)](https://david-dm.org/enb-make/enb-diverse-js)

Поддержка js технологий для ENB.

Установка:
----------

```sh
$ npm install --save-dev enb-diverse-js
```

История изменений
-----------------

История изменений на [отдельной странице](/CHANGELOG.md).

Разработка
----------
Руководство на [отдельной странице](/CONTRIBUTION.md).

Запуск тестов
-------------
```sh
$ npm test
```

Технологии
----------

 * [`browser.js`](#browser-js) и [`node.js`](#node-js) для описания JS-реализаций модулей (блоков) в соответствующих движках. Для совместимости, считается, что файлы с расширением `.js` содержат реализацию блоков в технологии [`browser.js`](#browser.js).


browser-js
==========

Склеивает `vanilla.js`, `js` и `browser.js`-файлы по deps'ам, сохраняет в виде `?.browser.js`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.browser.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-diverse-js/techs/browser-js'));
```

node-js
=======

Собирает `vanilla.js` и `node.js`-файлы по deps'ам с помощью `require`, сохраняет в виде `?.node.js`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.node.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-diverse-js/techs/node-js'));
```

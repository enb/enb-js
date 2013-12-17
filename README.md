enb-diverse-js [![Build Status](https://travis-ci.org/enb-make/enb-diverse-js.png?branch=master)](https://travis-ci.org/enb-make/enb-diverse-js) [![NPM version](https://badge.fury.io/js/enb-diverse-js.png)](http://badge.fury.io/js/enb-diverse-js)
==============

Поддержка js технологий для ENB.

Установка:
----------

```
npm install enb-diverse-js
```

Технологии
----------

 * [`vanilla.js`](#vanilla-js) для описания JS-реализации модулей, не зависящей от конкретного JavaScript движка.
 * [`browser.js`](#browser-js) и [`node.js`](#node-js) для описания JS-реализаций модулей (блоков) в соответствующих движках. Для совместимости, считается, что файлы с расширением `.js` содержат реализацию блоков в технологии [`browser.js`](#browser.js).

vanilla-js
==========

Склеивает `vanilla.js`-файлы по deps'ам, сохраняет в виде `?.vanilla.js`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.vanilla.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-diverse-js/techs/vanilla-js'));
```

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

Склеивает `vanilla.js` и `node.js`-файлы по deps'ам, сохраняет в виде `?.node.js`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.node.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-diverse-js/techs/node-js'));
```
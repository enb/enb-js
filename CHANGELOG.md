История изменений
=================

1.1.1
-----

### Зависимости

* Модуль `browserify@11.1.0` обновлен до версии `14.3.0`.
* Модуль `enb-source-map@1.8.0` обновлен до версии `1.10.0`.
* Модуль `uglify-js@2.4.24` обновлен до версии `2.8.22`.
* Модуль `vow@0.4.10` обновлен до версии `0.4.15`.

1.1.0
-----

* Добавлена поддержка `enb` версии `1.x` ([#45]).

1.0.0
-----

### Технологии

* [ __*major*__ ] Удалена технология `vanilla-js` ([#13]).

### Новая функциональность

* [Изоляция кода](README.md#Изоляция-кода-исходных-блоков) ([#6]).
* [Минимизация кода](README.md#Минимизация-кода) ([#30]).
* [Поддержка карт кода](README.md#source-maps) (source maps) ([#12]).
* Сборка `Node.js`-кода в [один файл](api.ru.md#bundled) ([#17]).
* [Поддержка YModules](api.ru.md#includeym) ([#31])

### Опции технологий

* В технологию [browser-js](api.ru.md#browser-js) добавлена опция [devMode](api.ru.md#devmode) ([#15])

### Остальное

* [ __*major*__ ] Пакет `enb-diverse-js` переименован в `enb-js` ([#14]).
* Добавлены тесты на технологии `browser-js` и `node-js` ([#7]).
* Обновлен jsdoc ([#23]).

0.1.0
-----

### Технологии

* Добавлена технология `vanilla-js`.
* Добавлена технология `browser-js`.
* Добавлена технология `node-js`.

[#45]: https://github.com/enb/enb-js/pull/45
[#31]: https://github.com/enb/enb-js/issues/31
[#30]: https://github.com/enb/enb-js/issues/30
[#23]: https://github.com/enb/enb-js/issues/23
[#17]: https://github.com/enb/enb-js/issues/17
[#15]: https://github.com/enb/enb-js/issues/15
[#14]: https://github.com/enb/enb-js/issues/14
[#13]: https://github.com/enb/enb-js/issues/13
[#12]: https://github.com/enb/enb-js/issues/12
[#7]:  https://github.com/enb/enb-js/issues/7
[#6]:  https://github.com/enb/enb-js/issues/6

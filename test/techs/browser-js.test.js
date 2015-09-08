require('chai')
    .use(require('chai-as-promised'))
    .should();

var EOL = require('os').EOL,
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    MockNode = require('mock-enb/lib/mock-node'),
    browserJsTech = require('../../techs/browser-js');

describe('browser-js', function () {
    afterEach(function () {
        mock.restore();
    });

    describe('join files', function () {
        it('must join all files', function () {
            var blocks = {
                'block0.vanilla.js': 'Hello0',
                'block1.browser.js': 'Hello1'
            },
                reference = [
                '/* begin: ../blocks/block0.vanilla.js */',
                'Hello0',
                '/* end: ../blocks/block0.vanilla.js */',
                '/* begin: ../blocks/block1.browser.js */',
                'Hello1',
                '/* end: ../blocks/block1.browser.js */',
                ''
            ].join(EOL);

            return build(blocks)
                .spread(function (content) {
                    content.should.be.equal(reference);
                });
        });
    });

    describe('compress', function () {
        it('must compress files', function () {
            var blocks = {
                    'block0.vanilla.js': 'var b = function () {};',
                    'block1.browser.js': 'if (foo) { bar(); }'
                },
                reference = 'var b=function(){};foo&&bar();';

            return build(blocks, { compress: true })
                .spread(function (content) {
                    content.should.be.equal(reference);
                });
        });
    });

    describe('code executes', function () {
        var globals,
            blocks = {
                'block0.vanilla.js': 'var a = 1;',
                'block1.browser.js': 'var a; global.TEST.push(a || 2);'
            };

        beforeEach(function () {
            globals = global.TEST = [];
        });

        it('code must executed in isolation', function () {
            return build(blocks, { iife: true }, true)
                .then(function () {
                    globals[0].should.be.equal(2);
                });
        });

        it('code must  be executed in the same scoupe', function () {
            return build(blocks, null, true)
                .then(function () {
                    globals[0].should.be.equal(1);
                });
        });
    });

    describe('sourcemap', function () {
        it('must generate sourcemap', function () {
            var blocks = {
                    'block0.vanilla.js': 'Hello0',
                    'block1.browser.js': 'Hello1'
                };

            return build(blocks, { sourcemap: true })
                .spread(function (content) {
                    content.should.match(/sourceMappingURL/);
                });
        });

        it('must generate sourcemap with minification', function () {
            var blocks = {
                'block0.vanilla.js': 'Hello0',
                'block1.browser.js': 'Hello1'
            };

            return build(blocks, { sourcemap: true, compress: true })
                .spread(function (content) {
                    content.should.match(/Hello0,Hello1;\n\/\/#\ssourceMappingURL/);
                });
        });
    });
});

function build(blocks, options, isNeedRequire) {
    mock({
        blocks: blocks,
        bundle: {}
    });

    var bundle = new MockNode('bundle'),
        fileList = new FileList(),
        testFunc;

    fileList.loadFromDirSync('blocks');

    bundle.provideTechData('?.files', fileList);

    testFunc = isNeedRequire ? bundle.runTechAndRequire : bundle.runTechAndGetContent;

    return testFunc.call(bundle, browserJsTech, options);
}

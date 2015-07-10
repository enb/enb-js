var EOL = require('os').EOL,
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    MockNode = require('mock-enb/lib/mock-node'),
    browserJsTech = require('../../techs/browser-js');

describe('browser-js', function () {
    afterEach(function () {
        mock.restore();
    });

    describe('must join files with comments', function () {
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
                '/* end: ../blocks/block1.browser.js */'
            ].join(EOL);

            return build(blocks)
                .then(function (content) {
                    content[0].must.be(reference);
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
                    globals[0].must.be(2);
                });
        });

        it('code must  be executed in the same scoupe', function () {
            return build(blocks, null, true)
                .then(function () {
                    globals[0].must.be(1);
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

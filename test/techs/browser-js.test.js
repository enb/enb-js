var fs = require('fs'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    browserJs = require('../../techs/browser-js');

describe('browser-js', function () {
    var bundle,
        fileList,
        scheme;

    afterEach(function () {
        mock.restore();
    });

    it('must join files with comments', function () {
        scheme = {
            blocks: {
                'block0.vanilla.js': 'Hello0',
                'block1.browser.js': 'Hello1'
            },
            bundle: {}
        };

        mock(scheme);

        bundle = new TestNode('bundle');
        fileList = new FileList();

        fileList.loadFromDirSync('blocks');

        bundle.provideTechData('?.files', fileList);

        var reference = [
            '/* begin: ../blocks/block0.vanilla.js */',
            'Hello0',
            '/* end: ../blocks/block0.vanilla.js */',
            '/* begin: ../blocks/block1.browser.js */',
            'Hello1',
            '/* end: ../blocks/block1.browser.js */'
        ].join('\n');

        return bundle.runTechAndGetContent(browserJs)
            .spread(function (content) {
                content.toString().must.be(reference);
            });
    });
});


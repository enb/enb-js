var fs = require('fs'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    browserJs = require('../../techs/browser-js');

describe('browser-js', function () {
    var bundle;

    afterEach(function () {
        mock.restore();
    });

    it('must join files with comments', function () {
        var scheme = {
            blocks: {
                'block1.browser.js': 'Hello1',
                'block2.browser.js': 'Hello2'
            },
            bundle: {}
        };

        mock(scheme);

        bundle = new TestNode('bundle');
        var fileList = new FileList();

        fileList.loadFromDirSync('blocks');

        bundle.provideTechData('?.files', fileList);

        var reference = [
            '/* begin: ../blocks/block1.browser.js */',
            'Hello1',
            '/* end: ../blocks/block1.browser.js */',
            '/* begin: ../blocks/block2.browser.js */',
            'Hello2',
            '/* end: ../blocks/block2.browser.js */'
        ].join('\n');

        return bundle.runTechAndGetContent(browserJs)
            .spread(function (content) {
                content.toString('utf-8').must.be(reference);
                var data = fs.readFileSync('bundle/bundle.browser.js', { encoding: 'utf-8' });
                data.must.be(reference);
            });
    });
});


var mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    vanillaJs = require('../../techs/vanilla-js');

describe('vanilla-js', function () {
    var bundle,
        fileList,
        scheme;

    afterEach(function () {
        mock.restore();
    });

    it('must join files with comments', function () {
        scheme = {
            blocks: {
                'block1.vanilla.js': 'Hello1',
                'block2.vanilla.js': 'Hello2'
            },
            bundle: {}
        };

        mock(scheme);

        bundle = new TestNode('bundle');
        fileList = new FileList();

        fileList.loadFromDirSync('blocks');

        bundle.provideTechData('?.files', fileList);

        var reference = [
            '/* begin: ../blocks/block1.vanilla.js */',
            'Hello1',
            '/* end: ../blocks/block1.vanilla.js */',
            '/* begin: ../blocks/block2.vanilla.js */',
            'Hello2',
            '/* end: ../blocks/block2.vanilla.js */'
        ].join('\n');

        return bundle.runTechAndGetContent(vanillaJs)
            .spread(function (content) {
                content.toString().must.be(reference);
            });
    });
});

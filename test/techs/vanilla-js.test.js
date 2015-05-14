var fs = require('fs'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    vanillaJs = require('../../techs/vanilla-js');

describe('vanilla-js', function () {
    var bundle;

    afterEach(function () {
        mock.restore();
    });

    it('must join files with comments', function () {
        var scheme = {
            blocks: {
                'block1.vanilla.js': 'Hello1',
                'block2.vanilla.js': 'Hello2'
            },
            bundle: {}
        };

        mock(scheme);

        bundle = new TestNode('bundle');
        var fileList = new FileList();

        fileList.loadFromDirSync('blocks');

        bundle.provideTechData('?.files', fileList);

        var reference =
            '/* begin: ../blocks/block1.vanilla.js */\n' +
            'Hello1\n' +
            '/* end: ../blocks/block1.vanilla.js */\n' +
            '/* begin: ../blocks/block2.vanilla.js */\n' +
            'Hello2\n' +
            '/* end: ../blocks/block2.vanilla.js */';

        return bundle.runTechAndGetContent(vanillaJs)
            .spread(function (content) {
                content.toString('utf-8').must.be(reference);
                var data = fs.readFileSync('bundle/bundle.vanilla.js', { encoding: 'utf-8' });
                data.must.be(reference);
            });
    });
});

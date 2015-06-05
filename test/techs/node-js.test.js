var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache'),
    MockNode = require('mock-enb/lib/mock-node'),
    nodeJs = require('../../techs/node-js');

describe('node-js', function () {
    var bundle;

    beforeEach(function () {
        global.REQUIRED_TECHS = [];
    });

    afterEach(function () {
        mock.restore();
    });

    describe('must join files', function () {
        var techs;

        beforeEach(function () {
            var scheme = {
                blocks: {
                    'block.vanilla.js': 'global.REQUIRED_TECHS.push("vanilla-js");',
                    'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
                },
                bundle: {}
            };

            mock(scheme);

            bundle = new MockNode('bundle');
            var fileList = new FileList();

            fileList.loadFromDirSync('blocks');

            bundle.provideTechData('?.files', fileList);

            return bundle.runTechAndRequire(nodeJs)
                .then(function () {
                    techs = global.REQUIRED_TECHS;
                });
        });

        it('must require all given techs in valid order', function () {
            techs.must.include('vanilla-js');
            techs.must.include('node-js');
            techs.indexOf('node-js').must.be.above(techs.indexOf('vanilla-js'));
        });

        it('must drop require cache', function () {
            fs.writeFileSync('./blocks/block.node.js', 'global.REQUIRED_TECHS.push("fake-node-js");');
            dropRequireCache(require, path.resolve('./bundle/bundle.node.js'));
            require(path.resolve('./bundle/bundle.node.js'));
            techs.must.include('fake-node-js');
        });
    });
});

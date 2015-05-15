var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache'),
    TestNode = require('enb/lib/test/mocks/test-node'),
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

        beforeEach(function (done) {
            var scheme = {
                blocks: {
                    'block0.vanilla.js': 'global.REQUIRED_TECHS.push("vanilla0-js");',
                    'block1.node.js': 'global.REQUIRED_TECHS.push("node1-js");',
                    'block2.node.js': 'global.REQUIRED_TECHS.push("node2-js");'
                },
                bundle: {}
            };

            mock(scheme);

            bundle = new TestNode('bundle');
            var fileList = new FileList();

            fileList.loadFromDirSync('blocks');

            bundle.provideTechData('?.files', fileList);

            return bundle.runTechAndRequire(nodeJs)
                .then(function () {
                    techs = global.REQUIRED_TECHS;
                    done();
                });
        });

        it('must require vanilla-js tech', function () {
            techs.must.include('vanilla0-js');
            techs.must.include('node1-js');
            techs.must.include('node2-js');
        });

        it('must require node-js techs', function () {
            techs.must.include('node1-js');
            techs.must.include('node2-js');
        });

        it('must require techs in order', function () {
            techs.indexOf('node1-js').must.be.above(techs.indexOf('vanilla0-js'));
        });

        it('must drop require cache', function () {
            fs.writeFileSync('./blocks/block2.node.js', 'global.REQUIRED_TECHS.push("fake-node-js");');
            dropRequireCache(require, path.resolve('./bundle/bundle.node.js'));
            require(path.resolve('./bundle/bundle.node.js'));
            techs.must.include('fake-node-js');
        });
    });
});

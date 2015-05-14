var fs = require('fs'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    nodeJs = require('../../techs/node-js');

describe('node-js', function () {
    var bundle;

    afterEach(function () {
        mock.restore();
    });

    describe('must join files', function () {
        var techs;

        beforeEach(function (done) {
            var scheme = {
                blocks: {
                    'block0.vanilla.js': '' +
                    'global.REQUIRED_TECHS = global.REQUIRED_TECHS || [];' +
                    'global.REQUIRED_TECHS.push("vanilla0-js");',
                    'block1.node.js': '' +
                    'global.REQUIRED_TECHS = global.REQUIRED_TECHS || [];' +
                    'global.REQUIRED_TECHS.push("node1-js");',
                    'block2.node.js': '' +
                    'global.REQUIRED_TECHS = global.REQUIRED_TECHS || [];' +
                    'global.REQUIRED_TECHS.push("node2-js");'
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
                    techs = global['REQUIRED_TECHS']
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
    });
});

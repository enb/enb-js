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

    it('must join files with comments', function () {
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
            .spread(function () {
                global['REQUIRED_TECHS'].must.include('vanilla0-js');
                global['REQUIRED_TECHS'].must.include('node1-js');
                global['REQUIRED_TECHS'].must.include('node2-js');
            });
    });
});

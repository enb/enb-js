var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache'),
    MockNode = require('mock-enb/lib/mock-node'),
    NodeJsTech = require('../../techs/node-js');

describe('node-js', function () {
    var globals;

    beforeEach(function () {
        globals = global.REQUIRED_TECHS = [];
    });

    afterEach(function () {
        mock.restore();
    });

    describe('join files', function () {
        var blocks = {
            'block.vanilla.js': 'global.REQUIRED_TECHS.push("vanilla-js");',
            'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
        };

        it('must join files all files', function () {
            return build(blocks)
                .then(function () {
                    globals.must.include('vanilla-js');
                    globals.must.include('node-js');
                });
        });

        it('must join `vanilla.js` file after `node.js` file', function () {
            return build(blocks)
                .then(function () {
                    globals.indexOf('node-js').must.be.above(globals.indexOf('vanilla-js'));
                });
        });
    });

    describe('devMode', function () {
        var blocks = {
                'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
            },
            blockPath = path.resolve('./blocks/block.node.js'),
            targetPath = path.resolve('./bundle/bundle.node.js');

        afterEach(function () {
            dropRequireCache(require, blockPath);
            dropRequireCache(require, targetPath);
        });

        it('must drop require cache by default', function () {
            return build(blocks)
                .then(function () {
                    fs.writeFileSync(blockPath, 'global.REQUIRED_TECHS.push("fake-node-js");');

                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    globals.must.include('fake-node-js');
                });
        });

        it('must not drop require cache in production mode', function () {
            return build(blocks, { devMode: false })
                .then(function () {
                    fs.writeFileSync(blockPath, 'global.REQUIRED_TECHS.push("fake-node-js");');

                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    globals.must.include('node-js');
                    globals.must.have.length(1);
                });
        });
    });
});

function build(blocks, options) {
    mock({
        blocks: blocks,
        bundle: {}
    });

    var bundle = new MockNode('bundle'),
        fileList = new FileList();

    fileList.loadFromDirSync('blocks');

    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(NodeJsTech, options);
}

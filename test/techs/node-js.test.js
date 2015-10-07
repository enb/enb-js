require('chai')
    .use(require('chai-as-promised'))
    .should();

var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    FileList = require('enb/lib/file-list'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache'),
    MockNode = require('mock-enb/lib/mock-node'),
    NodeJsTech = require('../../techs/node-js'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    rimraf = require('rimraf'),
    EOL = require('os').EOL;

describe('node-js', function () {
    var globals;

    beforeEach(function () {
        globals = global.REQUIRED_TECHS = [];
    });

    afterEach(function () {
        mock.restore();
    });

    describe('join files', function () {
        var scheme = {
                blocks: {
                    'block.vanilla.js': 'global.REQUIRED_TECHS.push("vanilla-js");',
                    'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
                }
            },
            targetPath = path.resolve('./bundle/bundle.node.js');

        afterEach(function () {
            dropRequireCache(require, targetPath);
        });

        it('must join all files', function () {
            return build(scheme)
                .then(function () {
                    require(targetPath);

                    globals.should.include('vanilla-js');
                    globals.should.include('node-js');
                });
        });

        it('must join `vanilla.js` file after `node.js` file', function () {
            return build(scheme)
                .then(function () {
                    require(targetPath);

                    globals.indexOf('node-js').should.be.above(globals.indexOf('vanilla-js'));
                });
        });
    });

    describe('devMode', function () {
        var scheme = {
                blocks: {
                    'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
                }
            },
            blockPath = path.resolve('./blocks/block.node.js'),
            targetPath = path.resolve('./bundle/bundle.node.js');

        afterEach(function () {
            dropRequireCache(require, blockPath);
            dropRequireCache(require, targetPath);
        });

        it('must drop require cache by default', function () {
            return build(scheme)
                .then(function () {
                    require(targetPath);
                    fs.writeFileSync(blockPath, 'global.REQUIRED_TECHS.push("fake-node-js");');
                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    globals.should.include('fake-node-js');
                });
        });

        it('must not drop require cache in production mode', function () {
            return build(scheme, { devMode: false })
                .then(function () {
                    require(targetPath);
                    fs.writeFileSync(blockPath, 'global.REQUIRED_TECHS.push("fake-node-js");');
                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    globals.should.include('node-js');
                    globals.should.have.length(1);
                });
        });
    });

    describe('bundled', function () {
        var targetPath = path.resolve('./bundle/bundle.node.js');

        afterEach(function () {
            global.__fake = '';
            dropRequireCache(require, targetPath);
        });

        it('must run code from bundle in isolation of blocks', function () {
            var scheme = {
                blocks: {
                    'block.vanilla.js': 'global.REQUIRED_TECHS.push("vanilla-js");',
                    'block.node.js': 'global.REQUIRED_TECHS.push("node-js");'
                }
            };
            return build(scheme, { bundled: true })
                .then(function () {
                    rimraf.sync('./blocks/');
                    require(targetPath);

                    globals.should.include('node-js');
                    globals.should.include('vanilla-js');
                });
        });

        it('must use CommonJS module', function () {
            var scheme = {
                blocks: {
                    'block.node.js': 'global.__fake = require("fake");'
                },
                // jscs:disable
                node_modules: {
                    fake: {
                        'index.js': 'module.exports = "fake";'
                    }
                }
                // jscs:enable
            };

            return build(scheme, { bundled: true })
                .then(function () {
                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    global.__fake.should.be.equal('fake');
                })
                .then(function () {
                    dropRequireCache(require, require.resolve('fake'));
                })
                .fail(function (err) {
                    dropRequireCache(require, require.resolve('fake'));
                    throw err;
                });
        });

        it('must not browserify base node modules', function () {
            global.__type = 'fake';
            var scheme = {
                blocks: {
                    'block.node.js': 'global.__type = require("os").type();'
                }
            };

            return build(scheme, { bundled: true })
                .then(function () {
                    dropRequireCache(require, targetPath);
                    require(targetPath);

                    global.__type.should.not.equal('fake');
                    global.__type.should.not.equal('Browser');
                });
        });

        it('must not reveal node_modules', function () {
            var scheme = {
                    blocks: {
                        'block.node.js': 'require("fake");'
                    },
                    // jscs:disable
                    node_modules: {
                        fake: {
                            'index.js': 'module.exports = "fake";'
                        }
                    }
                    // jscs:enable
                },
                pathToModule = require.resolve('fake');

            return build(scheme, { bundled: true })
                .then(function () {
                    dropRequireCache(require, targetPath);
                    rimraf.sync('./node_modules');

                    (function () {
                        require(targetPath);
                     }).should.throw(/fake/);
                })
                .then(function () {
                    dropRequireCache(require, pathToModule);
                })
                .fail(function (err) {
                    dropRequireCache(require, pathToModule);
                    throw err;
                });
        });

        describe('ym', function () {
            var YMFilename = require.resolve('ym'),
                YMContents = fs.readFileSync(YMFilename, 'utf-8');

            afterEach(function () {
                delete global.modules;
            });

            var scheme = {
                blocks: {
                    'block.node.js': [
                        'modules.define("my-module", function (provide) {',
                        '    provide("module-value")',
                        '});'
                    ].join(EOL)
                },
                // jscs:disable
                node_modules: {
                    ym: {
                        'index.js': YMContents
                    }
                }
                // jscs:enable
            };

            it('must provide ym to `global.modules`', function () {
                return build(scheme, { includeYM: true })
                    .then(function () {
                        dropRequireCache(require, targetPath);
                        require(targetPath);

                        global.modules.getState('my-module').should.eql('NOT_RESOLVED');
                    });
            });

            it('must provide ym to `global.modules` in bundled file', function () {
                return build(scheme, { includeYM: true, bundled: true })
                    .then(function () {
                        dropRequireCache(require, targetPath);
                        require(targetPath);

                        global.modules.getState('my-module').should.eql('NOT_RESOLVED');
                    });
            });
        });
    });
});

function build(scheme, options) {
    scheme.bundle = {};
    mock(scheme);

    var bundle = new MockNode('bundle'),
        fileList = new FileList();

    fileList.addFiles(loadDirSync('blocks'));

    bundle.provideTechData('?.files', fileList);

    return bundle.runTech(NodeJsTech, options);
}

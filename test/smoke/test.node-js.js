var TestTarget = require('../lib/test-target').TestTarget;
var target = new TestTarget('bundle/bundle.node.js');
var techs;

describe('node-js', function () {
    beforeEach(function (done) {
        return target.build()
            .then(function () {
                techs = target.require();
                done();
            });
    });

    it('must require vanilla-js tech', function () {
        techs.must.include('vanilla-js');
    });

    it('must require node-js tech', function () {
        techs.must.include('node-js');
    });

    it('must require techs in order', function () {
        var vanillaTechIndex = techs.indexOf('vanilla-js');
        var nodeTechIndex = techs.indexOf('node-js');

        nodeTechIndex.must.be.above(vanillaTechIndex);
    });

    describe('cache', function () {
        var fs = require('fs');
        var path = require('path');
        var fakeSource = 'global.REQUIRED_TECHS.push(\'faked-node-js\');\n';
        var blockTechPath = path.join(__dirname, '..', 'fixtures', 'blocks', 'some-block', 'some-block.node.js');
        var realSource = fs.readFileSync(blockTechPath);

        before(function () {
            fs.writeFileSync(blockTechPath, fakeSource);
        });

        after(function () {
            fs.writeFileSync(blockTechPath, realSource);
        });

        it('must drop require cache', function () {
            techs = target.require();

            techs.must.include('faked-node-js');
        });
    });
});

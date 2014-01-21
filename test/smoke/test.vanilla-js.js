var TestTarget = require('../lib/test-target').TestTarget;
var target = new TestTarget('bundle/bundle.vanilla.js');
var techs;

describe('vanilla-js', function () {
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
});

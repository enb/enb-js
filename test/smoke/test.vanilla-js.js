var TestTarget = require('../lib/test-target').TestTarget,
    target = new TestTarget('bundle/bundle.vanilla.js'),
    techs;

describe('vanilla-js', function() {
    beforeEach(function(done) {
        return target.build()
            .then(function() {
                techs = target.require();
                done();
            });
    });

    it('must require vanilla-js tech', function() {
        techs.must.include('vanilla-js');
    });
});

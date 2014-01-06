var TestTarget = require('../lib/test-target').TestTarget,
    target = new TestTarget('bundle/bundle.browser.js'),
    techs;

describe('browser-js', function() {
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

    it('must require browser-js tech', function() {
        techs.must.include('browser-js');
        techs.must.include('browser-js-alias');
    });

    it('must require techs in order', function() {
        var vanillaTechIndex = techs.indexOf('vanilla-js'),
            browserAliasTechIndex = techs.indexOf('browser-js-alias'),
            browserTechIndex = techs.indexOf('browser-js');

        browserTechIndex.must.be.above(vanillaTechIndex);
        browserAliasTechIndex.must.be.above(vanillaTechIndex);
    });
});

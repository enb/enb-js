var path = require('path'),
    MakePlatform = require('enb/lib/make'),
    Logger = require('enb/lib/logger'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache'),
    makePlatform = new MakePlatform(),
    logger = new Logger(),
    fixturesRelativePath = path.join('..', 'fixtures'),
    fixturesAbsolutePath = path.join(__dirname, fixturesRelativePath);

logger.setEnabled(false);

function TestTarget(target) {
    this._target = target;
    this._targetRelativePath = path.join(fixturesRelativePath, target);
    this._targetAbsolutePath = path.join(fixturesAbsolutePath, target);
}

TestTarget.prototype.build = function() {
    var targets = [this._target];

    return makePlatform.init(fixturesAbsolutePath)
        .then(function() {
            makePlatform.loadCache();
            makePlatform.setLogger(logger);
            makePlatform.buildTargets(targets);
        })
        .then(function() {
            makePlatform.saveCache();
            makePlatform.destruct();
        });
};

TestTarget.prototype.require = function() {
    global.REQUIRED_TECHS = [];

    dropRequireCache(require, this._targetAbsolutePath);
    require(this._targetRelativePath);

    return global.REQUIRED_TECHS;
};

exports.TestTarget = TestTarget;

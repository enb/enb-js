var ENB_DIVERSE_JS_TECHS = '../../../techs';

module.exports = function(config) {
    config.node('bundle', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/files'),
            require('enb/techs/deps'),
            require(ENB_DIVERSE_JS_TECHS + '/vanilla-js'),
            require(ENB_DIVERSE_JS_TECHS + '/node-js'),
            require(ENB_DIVERSE_JS_TECHS + '/browser-js')
        ]);
        nodeConfig.addTargets([
            '?.vanilla.js', '?.browser.js', '?.node.js'
        ]);
    });

};

function getLevels(config) {
    return [
        'blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

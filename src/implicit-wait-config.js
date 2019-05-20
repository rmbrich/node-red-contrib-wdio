const common = require('./wdio-common')

module.exports = function(RED) {

    function waitConfig(config) {
        RED.nodes.createNode(this, config)
        const node = this        
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())
                
                let implicit = config.implicit || msg.implicit
                let pageload = config.pageload || msg.pageload
                let script = config.script || msg.script
               
                if (config.action === 'set') {
                    await browser.setTimeouts(implicit, pageload, script)
                } else if (config.action === 'get') {
                    msg.payload = await browser.getTimeouts()
                }
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('implicit-wait-config', waitConfig)
}
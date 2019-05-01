const common = require('./wdio-common')

module.exports = function(RED) {

    function deleteSession(config) {
        RED.nodes.createNode(this, config)
        const node = this
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.deleteSession(node.context())
                if (browser && browser.sessionId) {
                    msg.payload = browser.sessionId
                } else {
                    msg.payload = 'no open session'
                }
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('delete-session', deleteSession)
}
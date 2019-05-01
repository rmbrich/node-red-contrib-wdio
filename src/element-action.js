const common = require('./wdio-common')

module.exports = function(RED) {

    function elementAction(config) {
        RED.nodes.createNode(this, config)
        const node = this
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())
                let elementId = await common.getElementId(browser, config.locateUsing, config.locateValue)
                
                if (config.action === 'click') {
                    await browser.elementClick(elementId)
                } else if (config.action === 'clear') {
                    await browser.elementClear(elementId)
                } else if (config.action === 'sendKeys') {
                    await browser.elementSendKeys(elementId, Array.from(config.sendKeys))
                }                
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('element-action', elementAction)
}
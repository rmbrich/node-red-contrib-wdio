const common = require('./wdio-common')

module.exports = function(RED) {

    function elementCheck(config) {
        RED.nodes.createNode(this, config)
        const node = this        
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())
                let elementId = await common.getElementId(browser, config.locateUsing, config.locateValue)
                
                if (config.check === 'selected') {
                    msg.payload = await browser.isElementSelected(elementId)
                } else if (config.check === 'enabled') {
                    msg.payload = await browser.isElementEnabled(elementId)
                } else if (config.check === 'displayed') {
                    msg.payload = await browser.isElementDisplayed(elementId)
                }                 
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('element-check', elementCheck)
}
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
                else if (config.action === 'getValue') {
                    msg.payload = await browser.getElementAttribute(elementId,'value')
                }
                else if (config.action === 'getText') {
                    msg.payload = await browser.getElementText(elementId)
                } 
                /*else if (config.action === 'setValue') {
                    await browser.addValue(elementId,'value')
                }*/
                else if (config.action === 'getAttribute') {
                    msg.payload = await browser.getElementAttribute(elementId, config.attribute)
                }
                else if(config.action === 'takeScreenShot'){
                    msg.payload = await browser.takeElementScreenshot(elementId)
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
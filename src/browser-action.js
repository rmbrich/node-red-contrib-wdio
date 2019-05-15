const common = require('./wdio-common')

module.exports = function(RED) {

    function browserAction(config) {
        RED.nodes.createNode(this, config)
        const node = this        
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())

                let url = config.url || msg.url
                let height  = config.height || msg.height
                let width = config.width || msg.width
                
                if (config.action === 'getUrl') {
                    msg.payload = await browser.getUrl()
                } else if (config.action === 'navigateTo') {
                    await browser.navigateTo(url)
                }
                else if (config.action === 'back') {
                    await browser.back()
                }
                else if (config.action === 'forward') {
                    await browser.forward()
                }
                else if (config.action === 'refresh') {
                    await browser.refresh()
                }
                else if (config.action === 'getTitle') {
                    msg.payload = await browser.getTitle()
                }
                else if (config.action === 'setSize') {
                    await browser.setWindowSize(parseInt(width), parseInt(height))
                }
                else if (config.action === 'maximize') {
                    await browser.maximizeWindow()
                }
                else if (config.action === 'takeScreenShot') {
                    msg.payload = await browser.takeScreenshot()
                }
                else if (config.action === 'pageSource') {
                    msg.payload = await browser.getPageSource()
                }
                else if (config.action === 'getCookies') {
                    msg.payload = await browser.getAllCookies()
                }
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('browser-action', browserAction)
}
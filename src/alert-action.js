const common = require('./wdio-common')

const isAlertPresent = async (browser) => {
    try{
        await browser.getAlertText()
        return true
    }
    catch(e){
        return false
    } 
}

module.exports = function(RED) {

    function alertAction(config) {
        RED.nodes.createNode(this, config)
        const node = this        
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())
               
                let value = config.sendText || msg.value           
                
                
                if (config.action === 'dismiss') {
                    await browser.dismissAlert()
                } else if (config.action === 'accept') {
                    await browser.acceptAlert()
                } else if (config.action === 'getAlertText') {
                    msg.payload = await browser.getAlertText()
                }
                else if (config.action === 'sendAlertText') {
                    if(await isAlertPresent()){  
                        await browser.sendAlertText(value)
                        //await browser.keys(Array.from(value))
                    }                    
                }
                else if (config.action === 'isPresent') {                    
                    msg.payload = await isAlertPresent(browser)
                }                
                common.successStatus(node)
                node.send(msg)
            } catch (e) {
                common.handleError(e, node, msg)
            }
        })
    }
    RED.nodes.registerType('alert-action', alertAction)
}
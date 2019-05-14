const common = require('./wdio-common')

module.exports = function(RED) {

    function alertAction(config) {
        RED.nodes.createNode(this, config)
        const node = this        
        common.clearStatus(node)

        node.on('input', async (msg) => {
            try {
                let browser = await common.getBrowser(node.context())
               
                let value = config.sendText || msg.value
                
                let isAlertPresent = async () => {
                    try{
                        await browser.getAlertText()
                        return true
                    }
                    catch(e){
                        return false
                    } 
                }
                
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
                else if (config.action === 'isExists') {                    
                    msg.payload = await isAlertPresent()
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
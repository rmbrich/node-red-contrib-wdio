const common = require('./wdio-common')

module.exports = function(RED) {
  function executeScript(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())
        let element = await common.getElement(
          browser,
          config.locateUsing,
          config.locateValue
        )

        let script = config.script || msg.script

        if (config.action === 'sync') {
          await browser.executeScript(script, Array.from(element))
        } else if (config.action === 'aSync') {
          await browser.executeAsyncScript(script, Array.from(element))
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('execute-script', executeScript)
}

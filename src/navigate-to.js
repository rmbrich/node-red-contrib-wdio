const common = require('./wdio-common')

module.exports = function(RED) {
  function navigateTo(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())
        await browser.navigateTo(config.url)
        msg.payload = config.url
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('navigate-to', navigateTo)
}

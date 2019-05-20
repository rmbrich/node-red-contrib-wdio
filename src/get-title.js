const common = require('./wdio-common')

module.exports = function(RED) {
  function getTitle(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())
        msg.payload = await browser.getTitle()
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('get-title', getTitle)
}

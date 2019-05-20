const common = require('./wdio-common')

module.exports = function(RED) {
  function frameAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let frame = config.frame || msg.value

        if (config.action === 'frame') {
          let checkNumber = Number(frame)
          if (!Number.isNaN(checkNumber)) {
            await browser.switchToFrame(parseInt(frame))
          } else {
            await browser.switchToFrame(frame)
          }
        } else if (config.action === 'parentFrame') {
          await browser.switchToParentFrame()
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('frame-action', frameAction)
}

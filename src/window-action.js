const common = require('./wdio-common')

module.exports = function(RED) {
  function windowAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let value = config.value || msg.value
        let index = config.index || msg.index

        if (config.action === 'byName') {
          await browser.switchWindow(value)
        } else if (config.action === 'byIndex') {
          let handles = await browser.getWindowHandles()
          await browser.switchWindow(handles[index])
        } else if (config.action === 'getHandle') {
          await browser.getWindowHandle()
        } else if (config.action === 'close') {
          await browser.closeWindow()
        } else if (config.action === 'open') {
          await browser.createWindow(value)
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('window-action', windowAction)
}

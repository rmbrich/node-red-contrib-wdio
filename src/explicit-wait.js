const common = require('./wdio-common')

module.exports = function(RED) {
  function explicitWait(config) {
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

        let time = config.time || msg.time
        let reverse = config.reverse || msg.reverse
        let error = config.error || msg.error

        let boolReverse = reverse === 'false' ? false : true

        if (config.action === 'displayed') {
          await element.waitForDisplayed(time, boolReverse, error)
        } else if (config.action === 'enabled') {
          await element.waitForEnabled(time, boolReverse, error)
        } else if (config.action === 'exists') {
          await element.waitForExist(time, boolReverse, error)
        } else if (config.action === 'until') {
          await element.waitUntil()
        }

        if (error) {
          common.handleError(error, node, msg)
        } else {
          common.successStatus(node)
          node.send(msg)
        }
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('explicit-wait', explicitWait)
}

const common = require('./wdio-common')

module.exports = function(RED) {
  function dropdownAction(config) {
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

        let text = config.text || msg.text
        let attribute = config.attribute || msg.attribute
        let index = config.index || msg.index
        let value = config.value || msg.value

        if (config.action === 'selectByAttr') {
          await element.selectByAttribute(attribute, value)
        } else if (config.action === 'selectByIndex') {
          await element.selectByIndex(parseInt(index))
        } else if (config.action === 'selectByText') {
          await element.selectByVisibleText(text)
        } else if (config.action === 'getValue') {
          msg.payload = await element.getValue()
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('dropdown-action', dropdownAction)
}

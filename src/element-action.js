const common = require('./wdio-common')

module.exports = function(RED) {
  function elementAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    const context = node.context()
    common.clearStatus(node)

    var getTypeInputValue = async (msg, type, value) => {
      var r = ''
      switch (type) {
        case 'msg':
          r = RED.util.getMessageProperty(msg, value)
          break
        case 'flow':
          r = context.flow.get(value)
          break
        case 'global':
          r = context.global.get(value)
          break
        case 'str':
          try {
            r = unescape(JSON.parse('"' + value + '"'))
          } catch (e) {
            r = value
          }
          break
        case 'num':
          r = parseFloat(value)
          break
        case 'json':
          if (value !== '') {
            r = JSON.parse(value)
          } else {
            r = undefined
          }
      }
      return r
    }

    node.on('input', async (msg) => {
      try {
        let locateUsing = config.locateUsing || msg.locateUsing
        let locateValue = config.locateValue || msg.locateValue

        let browser = await common.getBrowser(context)
        let elementId = await common.getElementId(
          browser,
          locateUsing,
          locateValue
        )

        let value = await getTypeInputValue(msg, config.object, config.sendKeys)
        let attribute = config.attribute || msg.attribute

        if (config.action === 'click') {
          await browser.elementClick(elementId)
        } else if (config.action === 'clear') {
          await browser.elementClear(elementId)
        } else if (config.action === 'sendKeys' && value) {
          await browser.elementSendKeys(elementId, Array.from(value))
        } else if (config.action === 'getValue') {
          msg.payload = await browser.getElementAttribute(elementId, 'value')
        } else if (config.action === 'getText') {
          msg.payload = await browser.getElementText(elementId)
        } else if (config.action === 'getAttribute') {
          msg.payload = await browser.getElementAttribute(elementId, attribute)
        } else if (config.action === 'takeScreenShot') {
          msg.payload = await browser.takeElementScreenshot(elementId)
        } else if (config.action === 'hover') {
          let element = await common.getElement(
            browser,
            locateUsing,
            locateValue
          )
          msg.payload = await element.moveTo()
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('element-action', elementAction)
}

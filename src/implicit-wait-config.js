const common = require('./wdio-common')

module.exports = function(RED) {
  function waitConfig(config) {
    RED.nodes.createNode(this, config)
    this.implicit = config.implicit
    this.pageload = config.pageload
    this.script = config.script
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let implicit = parseInt(node.implicit || msg.implicit)
        let pageLoad = parseInt(node.pageload || msg.pageload)
        let script = parseInt(node.script || msg.script)

        if (config.action === 'set') {
          var timeouts = {
            implicit,
            pageLoad,
            script
          }
          await browser.setTimeout(timeouts)
        } else if (config.action === 'get') {
          msg.payload = await browser.getTimeouts()
        }
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('implicit-wait-config', waitConfig)
}

const common = require('./wdio-common')

module.exports = function(RED) {
  function newSession(config) {
    RED.nodes.createNode(this, config)
    const node = this

    const webdriverConfig = Object.assign(
      { logLevel: config.logLevel },
      parseUri(config.webdriverUri, node),
      getCapabilities(config.webdriverProvider, config.webdriverBrowser)
    )
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let b = await common.newSession(webdriverConfig, node, node.context())
        common.connectedStatus(node)
        msg.payload = b.sessionId
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })

    node.on('close', async (done) => {
      try {
        if (config.killSession) {
          let b = await common.deleteSession(node.context())
          let sessionId = ''
          if (b && b.sessionId) sessionId = b.sessionId
          common.disconnectedStatus(node)
          node.log('Disconnected webdriver session ' + sessionId)
        }
      } catch (e) {
        common.handleError(e, node, msg)
      }
      done()
    })
  }
  RED.nodes.registerType('new-session', newSession)
}

const parseUri = (uri, node) => {
  let uriComponents
  try {
    if (uri[uri.length - 1] !== '/') uri += '/'
    let parsed = uri.match(/(\w+):\/\/(.+):(\d+)(\/.*)/)
    uriComponents = {
      protocol: parsed[1],
      hostname: parsed[2],
      port: parseInt(parsed[3]),
      path: parsed[4]
    }
  } catch (e) {
    common.handleError(
      new Error(
        'Invalid URI, expected format "<protocol>://<host>:<port>/<path>'
      ),
      node
    )
  }

  return uriComponents
}

const getCapabilities = (vendor, browser) => {
  let capabilities

  if (vendor === 'browserless.io') {
    capabilities = {
      browserName: browser,
      chromeOptions: {
        args: ['--headless', '--no-sandbox']
      }
    }
  } else if (vendor === 'local') {
    capabilities = {
      browserName: browser
    }
  }

  return { capabilities }
}

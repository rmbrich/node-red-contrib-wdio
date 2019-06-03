# node-red-contrib-webdriverio

Node Red nodes for [Webdriver IO](https://webdriver.io) test framework.

## Usage

The "new session" node creates a Selenium Webdriver session with the configured provider, or local Webdriver server. The session is stored at the Flow level, so can be reused by downstream webdriverIO nodes in the same flow.

If any nodes encounter an error, for example unable to locate a given element on a page, an error will be thrown. This can be caught by a global catch node and actioned appropriately.

After a flow completes, close the Selenium session using the "delete session" node. Alternatively, when Node Red exits, any open Selenium sessions will be closed.

## Example flow

Basic flow example: [https://github.com/rmbrich/node-red-contrib-wdio/blob/master/examples/basic.json](https://github.com/rmbrich/node-red-contrib-wdio/blob/master/examples/basic.json)

![basic flow](https://raw.githubusercontent.com/rmbrich/node-red-contrib-wdio/master/examples/basic.png)

## Local development

Follow these steps to use the nodes locally while developing or making changes (i.e. not as an npm package). This assumes you have a separate local NodeJS project that has Node Red as a dependency.

1. Clone this repository locally.
2. Run `yarn link` inside the project root folder. This will register "node-red-contrib-wdio" in the Yarn link registry.
3. Switch to your Node Red test project, then run `yarn link node-red-contrib-wdio`.
4. Start Node Red. The Webdriver IO nodes will be available in the palette.
5. After making changes in the node-red-contrib-wdio project, simply restart Node Red in your test project and the changes will be live.

To add a new node,

1. Node naming should line up to the Webdriver IO [Webdriver Protocol](https://webdriver.io/docs/api/webdriver.html).
2. Create the corresponding .html and .js files in the `src` directory.
3. If introducing a new method that could be used across multiple nodes, consider using the `wdio-common.js` module.
4. Add the new nodes to the `"nodes"` object in `package.json`.

## Contributing

Pull requests are welcomed for bug fixes, new nodes, and new features. Please push your changes in a branch and initiate a Pull Request against master.

Make sure the package version is incremented in `package.json` according to Semantic Versioning. Once a commit is merged to master, CI will automatically publish the new version to NPM.

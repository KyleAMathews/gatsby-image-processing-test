const fs = require(`fs`);
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

const urls = JSON.parse(fs.readFileSync(`${__dirname}/urls.json`, `utf-8`));

exports.sourceNodes = ({ actions, createNodeId, store, cache }) =>
  Promise.all(
    urls.map(async url => {
      let fileNode;
      const nodeId = createNodeId(url);
      try {
        fileNode = await createRemoteFileNode({
          url: url,
          parentNodeId: nodeId,
          store,
          cache,
          createNode: actions.createNode,
          createNodeId,
        });
      } catch (e) {
        console.log(e);
        // Ignore
      }

      const node = {
        id: nodeId,
        remoteUrl: url,
        internal: { type: `RemoteImage`, contentDigest: url },
      };

      if (fileNode) {
        node.file___NODE = fileNode.id;
      }

      actions.createNode(node);
    })
  );

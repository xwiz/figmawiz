const axios = require('axios');

async function getDesignElements(fileId) {
  // Retrieve the node tree of the mobile screen
  const response = await axios.get(`https://api.figma.com/v1/files/${fileId}/nodes`, {
    headers: {
      'X-Figma-Token': 'YOUR_FIGMA_TOKEN',
    },
  });

  const nodes = response.data.nodes;
  const mobileScreenNode = nodes['MOBILE_SCREEN_NODE_ID']; // Replace with the actual node ID of the mobile screen

  // Traverse the node tree to extract the design elements
  const designElements = [];
  function traverseNodes(node) {
    if (node.type === 'TEXT') {
      designElements.push({
        type: 'text',
        text: node.characters,
        fontSize: node.fontSize,
        fontName: node.fontName,
        color: node.fills[0].color,
      });
    } else if (node.type === 'RECTANGLE') {
      designElements.push({
        type: 'shape',
        width: node.width,
        height: node.height,
        color: node.fills[0].color,
      });
    } else if (node.type === 'VECTOR') {
      designElements.push({
        type: 'image',
        width: node.width,
        height: node.height,
        imageUrl: node.vectorProperties.imageUrl,
      });
    } else {
      // Recursively traverse the children nodes
      if (node.children) {
        node.children.forEach((childNode) => traverseNodes(childNode));
      }
    }
  }
  traverseNodes(mobileScreenNode);

  return designElements;
}

// Example usage:
getDesignElements('FILE_ID')
  .then((designElements) => console.log(designElements))
  .catch((error) => console.error(error));

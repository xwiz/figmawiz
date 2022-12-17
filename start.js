const axios = require('axios');

async function extractDesignElements(fileId, accessToken) {
  // Retrieve the node tree of the file
  const response = await axios.get(
    `https://api.figma.com/v1/files/${fileId}/nodes`,
    {
      headers: {
        'X-Figma-Token': accessToken,
      },
    }
  );
  const nodes = response.data.nodes;

  // Traverse the node tree and extract the design elements
  const designElements = [];
  for (const nodeId in nodes) {
    const node = nodes[nodeId];
    if (node.type === 'TEXT') {
      // Extract text element
      designElements.push({
        type: 'text',
        text: node.characters,
        fontName: node.fontName.family,
        fontSize: node.fontSize,
        color: node.fills[0].color,
      });
    } else if (node.type === 'RECTANGLE') {
      // Extract shape element
      designElements.push({
        type: 'shape',
        color: node.fills[0].color,
      });
    } else if (node.type === 'VECTOR') {
      // Extract image element
      const imageUrl = await getVectorImageUrl(node.id, accessToken);
      designElements.push({
        type: 'image',
        url: imageUrl,
      });
    }
  }

  return designElements;
}

async function getVectorImageUrl(nodeId, accessToken) {
  // Retrieve the vector image data for the node
  const response = await axios.get(
    `https://api.figma.com/v1/images/${nodeId}`,
    {
      headers: {
        'X-Figma-Token': accessToken,
      },
      params: {
        format: 'png',
      },
    }
  );
  return response.data.url;
}

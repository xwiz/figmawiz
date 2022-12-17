const fetch = require('node-fetch');

const API_KEY = 'YOUR_API_KEY';
const FILE_ID = 'YOUR_FILE_ID';
const PAGE_NAME = 'YOUR_PAGE_NAME';

async function extractDesignElements() {
  // Retrieve the node tree of the mobile screen
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_ID}/nodes`,
    {
      headers: {
        'X-Figma-Token': API_KEY,
      },
    }
  );
  const data = await response.json();

  // Find the page node with the specified name
  const pageNode = data.nodes.find(
    node => node.name === PAGE_NAME && node.type === 'PAGE'
  );

  // Extract the design elements from the page node
  const designElements = [];
  function extractElements(node) {
    if (node.type === 'TEXT' || node.type === 'SHAPE' || node.type === 'IMAGE') {
      designElements.push(node);
    } else if (node.type === 'GROUP' || node.type === 'FRAME') {
      node.children.forEach(child => extractElements(child));
    }
  }
  extractElements(pageNode);

  return designElements;
}

extractDesignElements().then(elements => console.log(elements));

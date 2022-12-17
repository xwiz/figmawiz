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
  const screenLinks = [];
  const designElements = [];
function extractElements(node) {
  if (node.type === 'TEXT' || node.type === 'SHAPE' || node.type === 'IMAGE') {
    // Extract the type, name, style, and other relevant properties of the element
    designElements.push({
      type: node.type,
      name: node.name,
      color: node.fills[0].color,
      backgroundColor: node.type === 'SHAPE' ? node.fills[0].color : '',
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      textAlign: node.style.textAlign,
      textDecoration: node.style.textDecoration,
      textTransform: node.style.textTransform,
      borderColor: node.strokes[0].color,
      borderWidth: node.strokes[0].weight,
      borderRadius: node.cornerRadius,
      imageUrl: node.type === 'IMAGE' ? node.images[0].url : null,
    });
  } else if (node.type === 'GROUP' || node.type === 'FRAME') {
    // Extract the layout and positioning properties of the element
    designElements.push({
      type: node.type,
      name: node.name,
      width: node.width,
      height: node.height,
      margin: node.absoluteBoundingBox.x + ' ' + node.absoluteBoundingBox.y,
      padding: node.relativeTransform[0][2] + ' ' + node.relativeTransform[1][2],
      flexDirection: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
      justifyContent: node.layoutAlign === 'MIN' ? 'flex-start' : 'center',
      alignItems: node.layoutAlign === 'MIN' ? 'flex-start' : 'center',
    });
    
    if (node.links.length > 0) {
      for (var link in node.links)  {
      // Extract the link destination ID and type (SCREEN or PAGE)
          screenLinks.push({
            nodeName: node.name,
            link: link,
            linkId: link.url.split('/')[5],
            linkType = link.url.split('/')[4]
          });
       }
     }

    // Recursively extract the elements inside the group or frame
    node.children.forEach(child => extractElements(child));
  }
}
  
  extractElements(pageNode);

  return designElements;
}

extractDesignElements().then(elements => console.log(elements));

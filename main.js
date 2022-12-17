async function generateFullCode(nodeId, layout = 'auto') {
  // Get the node or screen details from Figma
  const response = await figma.nodes.get({
    node_id: nodeId,
    include_children: true,
  });
  const node = response.node;

  // Extract the elements from the node or screen
  const elements = [];
  extractElements(node, elements);

  // Generate the code for the layout and elements
  const code = generateLayout(elements, layout);

  // Return the full code
  return code;
}

const fullCode = generateFullCode('ABCD1234', 'auto');
console.log(fullCode);

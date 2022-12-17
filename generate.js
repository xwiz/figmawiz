const MAPPING = {
  TEXT: (element) => {
    // Generate Flutter code for a text element
    return `Text(
  '${element.name}',
  style: TextStyle(
    color: Color(${element.color}),
    fontSize: ${element.fontSize}px,
    fontWeight: FontWeight.${element.fontWeight},
    textAlign: TextAlign.${element.textAlign},
    decoration: TextDecoration.${element.textDecoration},
    textTransform: TextTransform.${element.textTransform},
  ),
)`;
  },
  SHAPE: (element) => {
    // Generate Flutter code for a shape element
    return `Container(
  width: ${element.width}px,
  height: ${element.height}px,
  decoration: BoxDecoration(
    color: Color(${element.color}),
    border: Border.all(
      color: Color(${element.borderColor}),
      width: ${element.borderWidth}px,
    ),
    borderRadius: BorderRadius.circular(${element.borderRadius}px),
  ),
)`;
  },
  IMAGE: (element) => {
    // Generate Flutter code for an image element
    return `Image.network(
  '${element.imageUrl}',
  width: ${element.width}px,
  height: ${element.height}px,
)`;
  },
  GROUP: (element) => {
  // Generate Flutter code for a group element
  return `${element.type}(
  children: [
    ${extractElements(element.children)}
  ],
  width: ${element.width}px,
  height: ${element.height}px,
  margin: EdgeInsets.symmetric(
    horizontal: ${element.margin.split(' ')[0]}px,
    vertical: ${element.margin.split(' ')[1]}px,
  ),
  padding: EdgeInsets.symmetric(
    horizontal: ${element.padding.split(' ')[0]}px,
    vertical: ${element.padding.split(' ')[1]}px,
  ),
  flexDirection: ${element.flexDirection},
  justifyContent: ${element.justifyContent},
  alignItems: ${element.alignItems},
)`;
},
FRAME: (element) => {
  // Generate Flutter code for a frame element
  if (element.linkId && element.linkType) {
    // If the frame has a link, generate code for a navigation action
    return `GestureDetector(
  onTap: () => Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => ${element.linkType}${element.linkId}(),
    ),
  ),
  child: Container(
    width: ${element.width}px,
    height: ${element.height}px,
    child: Text(
      '${element.name}',
      style: TextStyle(
        color: Colors.white,
        fontSize: 18.0,
        fontWeight: FontWeight.bold,
      ),
    ),
    decoration: BoxDecoration(
      color: Colors.blue,
      borderRadius: BorderRadius.circular(10.0),
    ),
  ),
)`;
  } else {
    // If the frame does not have a link, generate code for a simple container
    return `Container(
  width: ${element.width}px,
  height: ${element.height}px,
  child: Text(
    '${element.name}',
    style: TextStyle(
      color: Colors.black,
      fontSize: 18.0,
    ),
  ),
)`;
  }
};


function generateCode(elements) {
  return elements.map(element => {
    // Use the appropriate mapping function based on the element type
    return MAPPING[element.type](element);
  }).join('\n');
}

const code = generateCode(extractedElements);
console.log(code);

function generateLayoutCode(elements, options = { autoLayout: true }) {
  let code = '';

  if (options.autoLayout) {
    // Automatically detect the appropriate layout based on the number and type of elements
    if (elements.length === 1) {
      // If there is only one element, use a single widget
      code += `${elements[0]}`;
    } else if (elements.every(element => element.type === 'TEXT')) {
      // If all elements are text, use a column of text widgets
      code += `Column(
  children: [
    ${elements.join(',\n')}
  ],
)`;
    } else {
      // If there are multiple elements of different types, use a grid of widgets
      code += `GridView.count(
  crossAxisCount: 2,
  children: [
    ${elements.join(',\n')}
  ],
)`;
    }
  } else {
    // Use the specified layout format
    code += `${options.format}(
  children: [
    ${elements.join(',\n')}
  ],
)`;
  }

  return code;
}

const layoutCode = generateLayoutCode(extractedElements);
console.log(layoutCode);

//const layoutCode = generateLayoutCode(extractedElements, {
//  autoLayout: false,
//  format: 'Row',
//});

function generateAssembledLayoutCode(elements) {
  // Generate the individual widget code for all elements
  const widgetCode = generateCode(elements);

  // Assemble the layout code using the generated widget code
  return `
import 'package:flutter/material.dart';

class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Screen'),
      ),
      body: Container(
        child: Column(
          children: [
            ${widgetCode}
          ],
        ),
      ),
    );
  }
}
`;
}

const assembledLayoutCode = generateAssembledLayoutCode(extractedElements);
console.log(assembledLayoutCode);


 

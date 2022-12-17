function generateCode(elements) {
  // Initialize the code variable
  let code = '';

  // Generate the code for each element
  elements.forEach(element => {
    switch (element.type) {
      case 'FRAME':
        code += generateFrameCode(element);
        break;
      case 'GROUP':
        code += generateGroupCode(element);
        break;
      case 'TEXT':
        code += generateTextCode(element);
        break;
      case 'SHAPE':
        code += generateShapeCode(element);
        break;
      case 'IMAGE':
        code += generateImageCode(element);
        break;
    }
  });

  return code;
}

function generateFrameCode(element) {
  // Determine whether to use Expanded or Flexible positioning
  const widget = element.width === 'auto' ? 'Expanded' : 'Flexible';

  // Generate the code for the frame
  let code = `
  ${widget}(
    child: ${element.linkType === 'SCREEN' ? 'Screen' : 'Page'}(
      id: '${element.linkId}',
    ),
  )`;

  // Add the layout and positioning properties
  code = addLayoutProperties(code, element);

  return code;
}

function generateGroupCode(element) {
  // Generate the code for the group
  let code = `
  Container(
    child: Column(
      children: [
        // Add the children of the group here
      ],
    ),
  )`;

  // Add the layout and positioning properties
  code = addLayoutProperties(code, element);

  return code;
}

function generateShapeCode(element) {
  // Generate the code for the shape
  let code = `
  Container(
    color: ${convertColor(element.color)},
    decoration: BoxDecoration(
      border: Border.all(
        color: ${convertColor(element.borderColor)},
        width: ${element.borderWidth},
      ),
      borderRadius: BorderRadius.circular(${element.borderRadius}),
    ),
  )`;

  // Add the layout and positioning properties
  code = addLayoutProperties(code, element);

  return code;
}

function generateImageCode(element) {
  // Generate the code for the image
  let code = `
  Image.network(
    '${element.imageUrl}',
  )`;

  // Add the layout and positioning properties
  code = addLayoutProperties(code, element);

  return code;
}


function generateTextCode(element) {
  // Generate the code for the text
  let code = `
  Text(
    '${element.name}',
    style: TextStyle(
      color: ${convertColor(element.color)},
      fontSize: ${element.fontSize},
      fontWeight: ${convertFontWeight(element.fontWeight)},
      textAlign: ${convertTextAlign(element.textAlign)},
      decoration: ${convertTextDecoration(element.textDecoration)},
      textTransform: ${convertTextTransform(element.textTransform)},
    ),
  )`;

  // Add the layout and positioning properties
  code = addLayoutProperties(code, element);

  return code;
}

function addLayoutProperties(code, element) {
  // Convert the margin and padding values
  const margin = convertMargin(element.margin);
  const padding = convertPadding(element.padding);

  // Add the layout and positioning properties
  code = `
  ${code}
  .expand(
    margin: ${margin},
    padding: ${padding},
    flexDirection: ${element.flexDirection},
    justifyContent: ${element.justifyContent},
    alignItems: ${element.alignItems},
  )`;

  return code;
}

function convertMargin(margin) {
  return 'EdgeInsets.all(' + margin.split(' ').join(', ') + ')';
}

function convertPadding(padding) {
  return 'EdgeInsets.all(' + padding.split(' ').join(', ') + ')';
}

function convertColor(color) {
  // Convert the color value to the corresponding Flutter code
  return `Colors.${color.toUpperCase()}`;
}

function convertFontWeight(fontWeight) {
  // Convert the font weight value to the corresponding Flutter code
  switch (fontWeight) {
    case 'NORMAL':
      return 'FontWeight.normal';
    case 'BOLD':
      return 'FontWeight.bold';
    case 'LIGHT':
      return 'FontWeight.light';
    default:
      return 'FontWeight.normal';
  }
}

function convertTextAlign(textAlign) {
  // Convert the text align value to the corresponding Flutter code
  switch (textAlign) {
    case 'LEFT':
      return 'TextAlign.left';
    case 'CENTER':
      return 'TextAlign.center';
    case 'RIGHT':
      return 'TextAlign.right';
    case 'JUSTIFY':
      return 'TextAlign.justify';
    default:
      return 'TextAlign.left';
  }
}

function convertTextDecoration(textDecoration) {
  switch (textDecoration) {
    case 'UNDERLINE':
      return 'TextDecoration.underline';
    case 'LINETHROUGH':
      return 'TextDecoration.lineThrough';
    case 'OVERLINE':
      return 'TextDecoration.overline';
    default:
      return 'TextDecoration.none';
  }
}

function convertTextTransform(textTransform) {
  switch (textTransform) {
    case 'UPPERCASE':
      return 'TextTransform.uppercase';
    case 'LOWERCASE':
      return 'TextTransform.lowercase';
    case 'CAPITALIZE':
      return 'TextTransform.capitalize';
    default:
      return 'TextTransform.none';
  }
}

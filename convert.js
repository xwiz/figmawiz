const elementMapping = {
  TEXT: (element) => Text(
    element.name,
    style: TextStyle(
      color: Color(int.parse(element.color.slice(1), radix: 16)),
      fontSize: element.fontSize,
      fontWeight: element.fontWeight,
      textAlign: element.textAlign,
      decoration: element.textDecoration,
      transform: element.textTransform,
    ),
  ),
  SHAPE: (element) => Container(
    width: element.width,
    height: element.height,
    margin: element.margin,
    padding: element.padding,
    color: Color(int.parse(element.color.slice(1), radix: 16)),
    decoration: BoxDecoration(
      border: Border.all(
        color: Color(int.parse(element.borderColor.slice(1), radix: 16)),
        width: element.borderWidth,
      ),
      borderRadius: BorderRadius.circular(element.borderRadius),
    ),
  ),
  IMAGE: (element) => Image.network(element.imageUrl),
  GROUP: (element) => Column(
    children: element.children.map(convertElement),
    mainAxisAlignment: element.justifyContent,
    crossAxisAlignment: element.alignItems,
  ),
  FRAME: (element) => Row(
    children: element.children.map(convertElement),
    mainAxisAlignment: element.justifyContent,
    crossAxisAlignment: element.alignItems,
  ),
};

function convertElement(element) {
  // Use the element mapping to convert the element into a Flutter widget
  return elementMapping[element.type](element);
}

// Convert the design elements into Flutter widgets
const widgets = designElements.map(convertElement);

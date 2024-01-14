export default function getClassNameFromHtmlClassAttribute(
  classAttribute: string
) {
  return classAttribute.trim().split('"')[1];
}

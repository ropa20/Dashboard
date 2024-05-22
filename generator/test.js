const fsPromise = require('fs').promises;
const fs = require('fs');
const generator = require(`../config/generator/organization.js`);

let theadValues = ``;
let inputValues = ``;
let validationObject = '';
let initialValue = '';

const getHead = (string) => {
  const head = string.replace('_', ' ');
  return head.charAt(0).toUpperCase() + head.substr(1).toLowerCase();
};

generator.parameters.forEach((param) => {
  // inputs
  if (param.type === 'String' || param.type === 'Number') {
    //initialValues
    initialValue += `${param.name}: '',\n`;
    if (!param.isUploadable) {
      theadValues += `{ head: "${getHead(param.name)}", key: "${param.name}" }, \n`
      inputValues += `{label: "${getHead(param.name)}", key: "${param.name}", type: "${param.type.toLowerCase()}"},\n`
    } else {
      inputValues += `{label: "${getHead(param.name)}", key: "${param.name}", type: "file"},\n`      
    }
  }

  // validation
  if (param.isRequired) {
    if (param.type === 'String') {
      validationObject += `${param.name}:yup.string().required('Please enter ${param.name}'),\n`;
    }
  }
});
const thead = `const thead = [\n${theadValues}]\n`
const initialValues = `const initialValues = {\n${initialValue}}\n`;
const inputFields = `const inputFields = [\n${inputValues}]\n`;
const validation = `export const ${generator.moduleName.toLowerCase()} = yup.object({\n${validationObject}}) \n`;

console.log(thead, inputFields, initialValues, validation);

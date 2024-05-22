const fsPromise = require('fs').promises;
const fs = require('fs');
let moduleName;
process.argv.forEach(function (val, index, array) {
  if (index === 2) {
    moduleName = val;
  }
});
const generator = require(`../config/generator/${moduleName}.js`);

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function main() {
  try {
    // Create model
    let model = await fsPromise.readFile('./generator/model.ts', 'utf8');
    let modelContent = replaceName(model);
    let newModel = fs.createWriteStream(
      `./src/models/${generator.moduleName.toLowerCase()}.model.ts`,
      { flags: 'w' },
    );
    newModel.write(modelContent);
    // Import model
    let importModel = await fsPromise.readFile(
      './src/imports/models.import.ts',
      'utf8',
    );
    const newImportModel = fs.createWriteStream(
      `./src/imports/models.import.ts`,
      { flags: 'w' },
    );
    let newImportString = importNewModel(importModel);
    newImportModel.write(replaceName(newImportString));

    let theadValues = ``;
    let inputValues = ``;
    let validationObject = '';
    let initialValue = '';
    let viewInputValues = '';

    const getHead = (string) => {
      const head = string.replace('_', ' ');
      return head.charAt(0).toUpperCase() + head.substr(1).toLowerCase();
    };

    generator.parameters.forEach((param) => {
      // inputs
      if (param.type === 'String' || param.type === 'Number' || param.type === 'Date') {
        //initialValues _IV_
        initialValue += `${param.name}: '',\n`;

        //inputFields _INF_
        if (!param.isUploadable) {
          if (param.ref) {
            theadValues += `{ head: "${getHead(param.name)}", key: "${getRefKey(
              param.name,
            )}", isNested: true }, \n`;
            inputValues += `{label: "${getHead(param.name)}", key: "${
              param.name
            }", type: "${param.ref}"},\n`;
            viewInputValues += `{label: "${getHead(
              param.name,
            )}", key: "${getRefKey(
              param.name,
            )}", type: "string", isNested: true},\n`;
          } else {
            theadValues += `{ head: "${getHead(param.name)}", key: "${
              param.name
            }" }, \n`;
            inputValues += `{label: "${getHead(param.name)}", key: "${
              param.name
            }", type: "${param.type.toLowerCase()}"},\n`;
            viewInputValues += `{label: "${getHead(param.name)}", key: "${
              param.name
            }", type: "string"},\n`;
          }
        } else {
          inputValues += `{label: "${getHead(param.name)}", key: "${
            param.name
          }", type: "file"},\n`;
          viewInputValues += `{label: "${getHead(param.name)}", key: "${
            param.name
          }", type: "file"},\n`;
        }
      }

      // validation _VAL_
      if (param.isRequired) {
        if (param.isUploadable) {
          validationObject += `${param.name}:yup.string().required('Please upload ${param.name}'),\n`;
        } else {
          validationObject += `${param.name}:yup.string().required('Please enter ${param.name}'),\n`;
        }
      }
    });
    const thead = `const thead = [\n${theadValues}]\n`;
    const initialValues = `const initialValue = {\n${initialValue}}\n`;
    const inputFields = `const inputFields: IAddValues[] = [\n${inputValues}]\n`;
    const viewInputFields = `const inputFields: IAddValues[] = [\n${viewInputValues}]\n`;
    const validation = `export const ${generator.moduleName.toLowerCase()} = yup.object({\n${validationObject}}) \n// _NV_`;

    // Create screens
    const screenDir = `./src/screens/${generator.moduleName.toLowerCase()}`;
    if (!fs.existsSync(screenDir)) {
      fs.mkdirSync(screenDir);
    }
    // Add screen
    let addScreen = await fsPromise.readFile(
      './generator/add.screen.tsx',
      'utf8',
    );
    let addScreenContent = replaceName(addScreen);
    let addScreenContent2 = addScreenContent.replace(
      new RegExp('_IV_', 'g'),
      initialValues,
    ); //string.replace(new RegExp('// _NMI_', 'g'), NMI);
    let addScreenContent3 = addScreenContent2.replace(
      new RegExp('_INF_', 'g'),
      inputFields,
    );
    let newAddScreen = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/add_${generator.moduleName.toLowerCase()}.screen.tsx`,
      { flags: 'w' },
    );
    newAddScreen.write(addScreenContent3);
    // Add styles
    let addScreenStyle = await fsPromise.readFile(
      './generator/add.screen.scss',
      'utf8',
    );
    let newAddScreenStyle = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/add_${generator.moduleName.toLowerCase()}.screen.scss`,
      { flags: 'w' },
    );
    newAddScreenStyle.write(addScreenStyle);

    // View screen
    let viewScreen = await fsPromise.readFile(
      './generator/view.screen.tsx',
      'utf8',
    );
    let viewScreenContent = replaceName(viewScreen);
    let viewScreenContent2 = viewScreenContent.replace(
      new RegExp('_INF_', 'g'),
      viewInputFields,
    );
    let newViewScreen = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/view_${generator.moduleName.toLowerCase()}.screen.tsx`,
      { flags: 'w' },
    );
    newViewScreen.write(viewScreenContent2);
    // View styles
    let viewScreenStyle = await fsPromise.readFile(
      './generator/view.screen.scss',
      'utf8',
    );
    let newViewScreenStyle = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/view_${generator.moduleName.toLowerCase()}.screen.scss`,
      { flags: 'w' },
    );
    newViewScreenStyle.write(viewScreenStyle);

    // Main screen
    let mainScreen = await fsPromise.readFile(
      './generator/main.screen.tsx',
      'utf8',
    );
    let mainScreenContent = replaceName(mainScreen);
    let mainScreenContent2 = mainScreenContent.replace(
      new RegExp('_TH_', 'g'),
      thead,
    );
    let newMainScreen = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/${generator.moduleName.toLowerCase()}.screen.tsx`,
      { flags: 'w' },
    );
    newMainScreen.write(mainScreenContent2);
    // Main styles
    let mainScreenStyle = await fsPromise.readFile(
      './generator/main.screen.scss',
      'utf8',
    );
    let mainScreenStyleContent = replaceName(mainScreenStyle);
    let mainViewScreenStyle = fs.createWriteStream(
      `./src/screens/${generator.moduleName.toLowerCase()}/${generator.moduleName.toLowerCase()}.screen.scss`,
      { flags: 'w' },
    );
    mainViewScreenStyle.write(mainScreenStyleContent);

    // Yup validation
    let validationFile = await fsPromise.readFile(
      './src/utils/validation.utils.ts',
      'utf8',
    );
    const newValidationFile = fs.createWriteStream(
      './src/utils/validation.utils.ts',
      'utf8',
      {
        flags: 'w',
      },
    );
    let addValidation = validationFile.replace(
      new RegExp('// _NV_', 'g'),
      validation,
    );
    newValidationFile.write(replaceName(addValidation));

    // App route
    let appFile = await fsPromise.readFile('./src/App.tsx', 'utf8');
    const newAppFile = fs.createWriteStream('./src/App.tsx', 'utf8', {
      flags: 'w',
    });
    let newAppImportString = addNewRoute(appFile);
    newAppFile.write(replaceName(newAppImportString));

    // Add link in sidebar
    const navItem = `{\n  icon: '${generator.moduleName.toLowerCase()}',\n link: '/${generator.moduleName.toLowerCase()}', label: '${
      generator.moduleName
    }'},\n // _NAV_`;
    let sidebarFile = await fsPromise.readFile(
      './src/common_components/ui/sidebar/sidebar.ui.tsx',
      'utf8',
    );
    let sidebarContent = sidebarFile.replace(
      new RegExp('// _NAV_', 'g'),
      navItem,
    );
    const newSidebarFile = fs.createWriteStream(
      './src/common_components/ui/sidebar/sidebar.ui.tsx',
      'utf8',
      {
        flags: 'w',
      },
    );
    newSidebarFile.write(sidebarContent);

    // Redux
    const redux = await fsPromise.readFile('./generator/redux.ts', 'utf-8');
    const reduxContent = replaceName(redux);
    const newReduxFile = await fs.createWriteStream(
      `./src/store/reducers/${generator.moduleName.toLowerCase()}.reducer.ts`,
      'utf-8',
      { flags: 'w' },
    );
    newReduxFile.write(reduxContent);
    reduxHelper();
  } catch (error) {
    console.log(error);
  }
}

function replaceName(string) {
  let str = string.replace(new RegExp('_MN_', 'g'), generator.moduleName);
  str = str.replace(
    new RegExp('_MNS_', 'g'),
    generator.moduleName.toLowerCase(),
  );
  str = str.replace(
    new RegExp('_MNC_', 'g'),
    generator.moduleName.toUpperCase(),
  );
  str = str.replace('// @ts-nocheck', '');
  return str;
}

function replaceViewWrap(string, viewWrap) {
  let str = string.replace(new RegExp('_VW_', 'g'), viewWrap);
  return str;
}

function defineRoute(string) {
  let moduleName = generator.moduleName.toLowerCase();
  let NR = `import ${moduleName}Route from "./routes/v1/${moduleName}.route";\n//_NR_`;
  let NRD = `app.use("/api/v1/${moduleName}", ${moduleName}Route);\n//_NRD_`;

  let str = string.replace(new RegExp('//_NR_', 'g'), NR);
  str = str.replace(new RegExp('//_NRD_', 'g'), NRD);
  return str;
}

function addModelObject(string, object) {
  string = string.replace(new RegExp('_MO_', 'g'), object);
  return string;
}

function addSearchQuery(string, object) {
  string = string.replace(new RegExp('_MSEARCH_', 'g'), object);
  return string;
}

function addInterface(string, interface) {
  string = string.replace(new RegExp('_IM_', 'g'), interface.module);
  string = string.replace(new RegExp('_IMC_', 'g'), interface.create);
  string = string.replace(new RegExp('_IMG_', 'g'), interface.get);
  string = string.replace(new RegExp('_IME_', 'g'), interface.edit);
  return string;
}

function addValidation(string, validation) {
  string = string.replace(new RegExp('_VC_', 'g'), validation.create);
  string = string.replace(new RegExp('_VE_', 'g'), validation.edit);
  return string;
}

function addTest(string, test) {
  string = string.replace(new RegExp('_TCB_', 'g'), test.create);
  string = string.replace(new RegExp('_TEB_', 'g'), test.edit);
  string = string.replace(new RegExp('_TEK_', 'g'), test.editKey);
  return string;
}

function addRandomTypes({ type, subType, ref }) {
  let value;
  if (type.toLowerCase() === 'string') {
    value = '"qwertyuiop"';
    if (ref) {
      value = '"623980a44794ef59b9024c15"';
    }
  } else if (type.toLowerCase() === 'number') {
    value = 1234567890;
  } else if (type.toLowerCase() === 'date') {
    value = new Date();
  } else if (type.toLowerCase() === 'array') {
    if (subType.toLowerCase() === 'string') {
      value = '["qwerty", "uiop"]';
    } else if (subType.toLowerCase() === 'number') {
      value = '[12345, 67890]';
    }
  }
  return value;
}

function importNewModel(string) {
  let moduleName = generator.moduleName.toLowerCase();
  let NMI = `import ${moduleName} from "models/${moduleName}.model";\n// _NMI_`;
  let NM = `${moduleName},\n  // _NM_`;

  let str = string.replace(new RegExp('// _NMI_', 'g'), NMI);
  str = str.replace(new RegExp('// _NM_', 'g'), NM);
  return str;
}

function addNewRoute(string) {
  let moduleName = generator.moduleName.toLowerCase();
  let NSI = `import Add${generator.moduleName} from 'screens/${moduleName}/add_${moduleName}.screen';
  import View${generator.moduleName} from 'screens/${moduleName}/view_${moduleName}.screen';
  import ${generator.moduleName} from 'screens/${moduleName}/${moduleName}.screen';\n// _NSI_`;

  const NR = `<Route path="/${moduleName}" element={<Main><${generator.moduleName} /></Main>}></Route>\n
  <Route path="/view_${moduleName}/:id" element={<Main><View${generator.moduleName} /></Main>}></Route>\n
  <Route path="/edit_${moduleName}/:id" element={<Main><Add${generator.moduleName} /></Main>}></Route>\n
  <Route path="/add_${moduleName}" element={<Main><Add${generator.moduleName} /></Main>}></Route>\n_NR_`;

  let str = string.replace(new RegExp('// _NSI_', 'g'), NSI);
  let str1 = str.replace('{/*', '');
  let str2 = str1.replace('*/}', '');
  str = str.replace(new RegExp('_NR_', 'g'), NR);
  return str;
}

function addConstantValues(content) {
  let addIn;
}

const reduxHelper = async () => {
  let Name = generator.moduleName;
  let NAME = generator.moduleName.toUpperCase();
  let name = generator.moduleName.toLowerCase();

  // Redux Actions
  const reduxAction = `export const set${Name} = (payload: object) => {
    store.dispatch({
      type: GET_${NAME},
      payload: payload
    })
  }
  
  export const setMany${Name} = (payload: any[]) => {
    store.dispatch({
      type: GET_MANY_${NAME},
      payload: payload
    })
  }
  
  // _RA_`;

  const reduxActionImport = `GET_${NAME}, 
  GET_MANY_${NAME},
  // _RTI_
  `;

  const reduxTypes = `export const GET_${NAME} = "GET_${NAME}"\nexport const GET_MANY_${NAME} = "GET_MANY_${NAME}";\n// _RT_`;
  const reduxActionFile = await fsPromise.readFile(
    './src/utils/redux.utils.ts',
    'utf-8',
  );
  const reduxActionFileContent = reduxActionFile.replace(
    new RegExp('// _RA_', 'g'),
    reduxAction,
  );
  const reduxActionFileContent2 = reduxActionFileContent.replace(
    new RegExp('// _RTI_', 'g'),
    reduxActionImport,
  );
  const newReduxActionFile = await fs.createWriteStream(
    `./src/utils/redux.utils.ts`,
    'utf-8',
    { flags: 'w' },
  );
  newReduxActionFile.write(reduxActionFileContent2);

  const types = await fsPromise.readFile('./src/utils/types.utils.ts', 'utf-8');
  const typesContent = types.replace(new RegExp('// _RT_', 'g'), reduxTypes);
  const newTypes = await fs.createWriteStream(
    `./src/utils/types.utils.ts`,
    'utf-8',
    { flags: 'w' },
  );
  newTypes.write(typesContent);

  // Root reducer definition
  const rootDefinition = `${name}: ${name}Reducer,\n// _RD_`;
  const rootDefinitionImport = `import ${name}Reducer from './${name}.reducer'; \n// _RI_`;
  const rootReducer = await fsPromise.readFile(
    './src/store/reducers/root.reducer.ts',
    'utf-8',
  );
  const rootReducerContent = rootReducer.replace(
    new RegExp('// _RD_', 'g'),
    rootDefinition,
  );
  const rootReducerContent2 = rootReducerContent.replace(
    new RegExp('// _RI_', 'g'),
    rootDefinitionImport,
  );
  const newRootReducer = await fs.createWriteStream(
    './src/store/reducers/root.reducer.ts',
    'utf-8',
    { flags: 'w' },
  );
  newRootReducer.write(rootReducerContent2);
};
const getRefKey = (key) => {
  const keys = {
    address: 'address.address',
    user: 'user.username',
    store_incharge: 'store_incharge.username',
    store: 'store.name',
    driver: 'driver.name',
    hub: 'hub.name',
    status: 'status.status',
    vehicle: 'vehicle.id',
    organization: 'organization.name',
    booking: 'booking.id',
  };
  return keys[key] || key;
};
main();

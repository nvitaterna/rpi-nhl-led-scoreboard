// import all json files from ../data
// get all possible values for the different fields recursively. Track undefined fields and group array values.
// If there are less than 10 unique values, include them in the output. If there are more than 10 unique values, ignore them.

import fs from 'fs';
import path from 'path';

interface FieldInfo {
  possibleValues?: string[];
  canBeUndefined: boolean;
  type: string;
  arrayElementTypes?: Set<string>;
  arrayElementValues?: Record<string, FieldInfo>;
}

const dataDir = path.join(process.cwd(), 'data');

const getValueType = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const analyzeValue = (
  value: any,
  fieldPath: string,
  analysis: Record<string, FieldInfo>,
) => {
  if (!analysis[fieldPath]) {
    analysis[fieldPath] = {
      canBeUndefined: false,
      type: 'unknown',
      possibleValues: [],
    };
  }

  const fieldInfo = analysis[fieldPath];

  if (value === undefined || value === null) {
    fieldInfo.canBeUndefined = true;
    return;
  }

  const valueType = getValueType(value);

  // Track the primary type
  if (fieldInfo.type === 'unknown') {
    fieldInfo.type = valueType;
  } else if (fieldInfo.type !== valueType) {
    fieldInfo.type = 'mixed';
  }

  if (Array.isArray(value)) {
    if (!fieldInfo.arrayElementTypes) {
      fieldInfo.arrayElementTypes = new Set();
      fieldInfo.arrayElementValues = {};
    }

    value.forEach((item, index) => {
      const itemType = getValueType(item);
      fieldInfo.arrayElementTypes!.add(itemType);

      if (itemType === 'object' && item !== null) {
        // Analyze objects in arrays recursively
        analyzeObject(item, `${fieldPath}[].`, analysis);
      } else if (itemType !== 'object') {
        // For primitive values in arrays, collect possible values
        const arrayValuePath = `${fieldPath}[]`;
        if (!fieldInfo.arrayElementValues![arrayValuePath]) {
          fieldInfo.arrayElementValues![arrayValuePath] = {
            canBeUndefined: false,
            type: itemType,
            possibleValues: [],
          };
        }

        if (
          fieldInfo.arrayElementValues![arrayValuePath].possibleValues!.length <
          10
        ) {
          const stringValue = String(item);
          if (
            !fieldInfo.arrayElementValues![
              arrayValuePath
            ].possibleValues!.includes(stringValue)
          ) {
            fieldInfo.arrayElementValues![arrayValuePath].possibleValues!.push(
              stringValue,
            );
          }
        }
      }
    });
  } else if (valueType === 'object') {
    analyzeObject(value, `${fieldPath}.`, analysis);
  } else {
    // For primitive values, collect possible values if reasonable
    if (!fieldInfo.possibleValues) {
      fieldInfo.possibleValues = [];
    }

    if (fieldInfo.possibleValues.length < 10) {
      const stringValue = String(value);
      if (!fieldInfo.possibleValues.includes(stringValue)) {
        fieldInfo.possibleValues.push(stringValue);
      }
    } else if (fieldInfo.possibleValues.length === 10) {
      // Clear values if we exceed the limit
      fieldInfo.possibleValues = undefined;
    }
  }
};

const analyzeObject = (
  obj: any,
  pathPrefix: string,
  analysis: Record<string, FieldInfo>,
) => {
  if (obj === null || obj === undefined) return;

  Object.keys(obj).forEach((key) => {
    const fieldPath = `${pathPrefix}${key}`;
    analyzeValue(obj[key], fieldPath, analysis);
  });
};

const getPossibleValues = async () => {
  const files = fs.readdirSync(dataDir);

  const allData = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const filePath = path.join(dataDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContents);
    });

  const analysis: Record<string, FieldInfo> = {};

  allData.forEach((data) => {
    analyzeObject(data, '', analysis);
  });

  // Convert analysis to output format
  const output: Record<string, any> = {};

  Object.keys(analysis).forEach((fieldPath) => {
    const fieldInfo = analysis[fieldPath];
    const result: any = {
      type: fieldInfo.type,
      canBeUndefined: fieldInfo.canBeUndefined,
    };

    if (fieldInfo.possibleValues && fieldInfo.possibleValues.length > 0) {
      result.possibleValues = fieldInfo.possibleValues;
    }

    if (fieldInfo.arrayElementTypes) {
      result.arrayElementTypes = Array.from(fieldInfo.arrayElementTypes);

      if (fieldInfo.arrayElementValues) {
        result.arrayElementValues = {};
        Object.keys(fieldInfo.arrayElementValues).forEach((path) => {
          const elementInfo = fieldInfo.arrayElementValues![path];
          result.arrayElementValues[path] = {
            type: elementInfo.type,
            canBeUndefined: elementInfo.canBeUndefined,
            ...(elementInfo.possibleValues &&
              elementInfo.possibleValues.length > 0 && {
                possibleValues: elementInfo.possibleValues,
              }),
          };
        });
      }
    }

    output[fieldPath] = result;
  });

  await fs.promises.writeFile(
    path.join(process.cwd(), 'possible-values.json'),
    JSON.stringify(output, null, 2),
  );

  return output;
};

getPossibleValues().then((output) => {
  console.log('Possible values:', output);
});

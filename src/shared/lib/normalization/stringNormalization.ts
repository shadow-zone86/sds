import pkg from 'lodash';

const stringNormalization = (value: unknown): string | undefined => {
  const { isString } = pkg;

  if (isString(value)) {
    return value.toLowerCase().trim();
  }

  return undefined;
};

export { stringNormalization };

import React from 'react';

class TypeHelper extends React.Component {

  constructor() {
    super({});
  }

  static isString = (value: any): boolean => (typeof value === 'string' || value instanceof String);
  static toNumber = (value: any): number => value ? Number(value || 0) : value;
}

export default TypeHelper;

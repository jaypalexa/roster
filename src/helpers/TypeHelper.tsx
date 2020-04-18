import React from 'react';

class TypeHelper extends React.Component {

  constructor() {
    super({});
  }

  static toNumber = (value: any): number => {
    return Number(value || 0);
  };
}

export default TypeHelper;

import React from 'react';

class Constants extends React.Component {
  static INPUT_NUMBER_PATTERN = Object.freeze({
    ZERO_DECIMAL_PLACES :'\\d+',
    TWO_DECIMAL_PLACES:'^\\d+\\.?\\d{0,2}$'
  })
}

export default Constants;

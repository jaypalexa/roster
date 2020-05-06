import React from 'react';

class RosterConstants extends React.Component {
  static INPUT_NUMBER_PATTERN = Object.freeze({
    ZERO_DECIMAL_PLACES :'\\d+',
    TWO_DECIMAL_PLACES:'^\\d+\\.?\\d{0,2}$',
  });
  static ERROR = Object.freeze({
    GENERIC :'ERROR (see browser console for details)',
  });
}

export default RosterConstants;

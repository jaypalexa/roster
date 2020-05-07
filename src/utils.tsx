export const sortByProperty = (propertyName: string) => {
  const value = (x: any) => x[propertyName];
  return (a: any, b: any) => {
    const value_a = value(a);
    const value_b = value(b);
    return (((value_a > value_b) as any) - ((value_b > value_a) as any));
  }
}

export const toNumber = (value: any): number => value ? Number(value || 0) : value;

export const constants = Object.freeze({
    ERROR: Object.freeze({
      GENERIC :'ERROR (see browser console for details)',
    }),
    INPUT_NUMBER_PATTERN: Object.freeze({
      ZERO_DECIMAL_PLACES :'\\d+',
      TWO_DECIMAL_PLACES:'^\\d+\\.?\\d{0,2}$',
    }),
  })

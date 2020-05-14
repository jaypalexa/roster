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
});

export const handleModalKeyDownEvent = (e: KeyboardEvent) => {
  if (e.keyCode === 9) { // TAB KEY
    const dlg = document.querySelector('.modal') as HTMLElement;
    let focusable = dlg.querySelectorAll('input,button,select,textarea');
    if (focusable.length) {
      let first = focusable[0] as HTMLElement;
      let last = focusable[focusable.length - 1] as HTMLElement;
      if (e.shiftKey) {
        if (e.target === first) { // shift-tab pressed on first input in dialog
          last.focus();
          e.preventDefault();
        }
      } else {
        if (e.target === last) { // tab pressed on last input in dialog
          first.focus();
          e.preventDefault();
        }
      }
    }
  }
};

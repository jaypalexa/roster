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

/* focus trap to prevent leaving modal dialog when tabbing around */
export const handleModalKeyDownEvent = (e: KeyboardEvent) => {
  if (e.keyCode === 9) { // TAB KEY
    const modalDialog = document.querySelector('.modal') as HTMLElement;
    const focusableElements = modalDialog.querySelectorAll('input,button,select,textarea');
    if (focusableElements.length) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      if (e.shiftKey) {
        if (e.target === firstElement) { // shift-tab pressed on first input in dialog
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (e.target === lastElement) { // tab pressed on last input in dialog
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }
};

export const isIphone = /(iPhone)/i.test(navigator.userAgent);
export const iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
export const isSafari = !!navigator.userAgent.match(/Version\/[\\d\\.]+.*Safari/);

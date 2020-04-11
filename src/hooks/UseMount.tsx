// import { EffectCallback, useEffect } from 'react';
import { useEffect } from 'react';

// const useEffectOnce = (effect: EffectCallback) => {
//   useEffect(effect, []);
// };

const useMount = (fn: () => void) => {
  // useEffectOnce(() => {
  //   fn();
  // });
  // useEffect(() => {
  //   fn();
  // }), [];
  useEffect(fn, []);
};

export default useMount;
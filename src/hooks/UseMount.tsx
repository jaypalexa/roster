import { useEffect } from 'react';
 
const useMount = (fn: () => void) => { 
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  useEffect(fn, []); 
}; 
 
export default useMount;
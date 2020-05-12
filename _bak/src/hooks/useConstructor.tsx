import { useState } from 'react'; 

const useConstructor = (callback = () => {}) => { 
  const [hasBeenCalled, setHasBeenCalled] = useState(false); 
  if (hasBeenCalled) return; 
  callback(); 
  setHasBeenCalled(true); 
} 
 
export default useConstructor;

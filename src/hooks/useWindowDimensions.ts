import { useEffect, useState } from "react";

const useWindowDimensions = () => {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  
  useEffect(() => {
    if (window) {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  }, []) 
  
  return {
    width,
    height
  }
}

export default useWindowDimensions;
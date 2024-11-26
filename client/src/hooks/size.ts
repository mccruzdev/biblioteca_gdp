import { useEffect, useState } from "react";

export function useSize(domObject: {
  innerWidth: number;
  innerHeight: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}) {
  const [width, setWidth] = useState<number>(domObject.innerWidth);
  const [height, setHeight] = useState<number>(domObject.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(domObject.innerWidth);
      setHeight(domObject.innerHeight);
    };

    domObject.addEventListener("resize", handleResize);

    return () => domObject.removeEventListener("resize", handleResize);
  }, [domObject]);

  return { width, height };
}

export function useWindowSize() {
  return useSize(window);
}

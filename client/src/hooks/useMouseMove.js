import { useState } from "react";

const useMouseMove = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  };

  return { mousePos, handleMouseMove };
};

export default useMouseMove;
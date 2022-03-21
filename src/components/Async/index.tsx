import { useEffect, useState } from "react";

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
    }, 1000);

    setTimeout(() => {
      setIsButtonInvisible(true);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Hello world!</h1>

      {isButtonVisible && <button>Button</button>}

      {!isButtonInvisible && <button>Not Button</button>}
    </div>
  );
}

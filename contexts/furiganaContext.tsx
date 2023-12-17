import { ReactNode, createContext } from "react";
import { useState } from "react";

type FuriganaStatus = true | false;
export type FuriganaContextType = {
  status: FuriganaStatus;
  toggleStatus: (status: FuriganaStatus) => void;
};

export const FuriganaContext = createContext<FuriganaContextType | null>(null);

type Props = {
  children: ReactNode;
};

const FuriganaProvider: React.FC<Props> = ({ children }) => {
  const [furiganaStatus, setFuriganaStatus] = useState(true);

  return (
    <FuriganaContext.Provider
      value={{ status: furiganaStatus, toggleStatus: setFuriganaStatus }}
    >
      {children}
    </FuriganaContext.Provider>
  );
};

export default FuriganaProvider;

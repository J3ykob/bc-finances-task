import { createContext, Dispatch, SetStateAction } from "react";

const MetamaskContext = createContext<{
    provider: any,
    setProvider: Dispatch<SetStateAction<any>> | (() => void)
}>({
    provider: null,
    setProvider: () => {},
});

export default MetamaskContext;
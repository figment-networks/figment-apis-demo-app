import { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
    const [ appState, setAppState ] = useState({
        flowId: null,
        account: null,
        pubkey: null,
        secret: null,
        payload: {
            raw: null,
            signed: null,
        }
    })

    return (
        <AppStateContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    return useContext(AppStateContext);
}
import { useState, useEffect } from "react";

const initialState = {
  loaded: false,
  accountId: null,
  publicKey: null,
  secretKey: null,
  available: null,
  staked: null,
};

export default function useAppState() {
  const [_appState, _setAppState] = useState({ ...initialState });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("staking") || "{}");
    _setAppState({ ...savedState, loaded: true });
  }, []);

  function clearAppState() {
    localStorage.removeItem("staking");
    _setAppState({ ...initialState, loaded: true });
  }

  function setAppState(data = {}) {
    const update = { ..._appState, ...data };
    _setAppState(update);

    const { accountId, publicKey, secretKey } = update;
    localStorage.setItem(
      "staking",
      JSON.stringify({ accountId, publicKey, secretKey })
    );
  }

  return { appState: _appState, setAppState, clearAppState };
}

import { useState, useEffect } from "react";

const initialState = {
  loaded: false,
  accountAddress: null,
  publicKey: null,
  privateKey: null,
  available: null,
  staked: null,
  latestBlock: null,
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

    const { accountAddress, publicKey, privateKey } = update;
    localStorage.setItem(
      "staking",
      JSON.stringify({ accountAddress, publicKey, privateKey })
    );
  }

  return { appState: _appState, setAppState, clearAppState };
}

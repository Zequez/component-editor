import { useState } from "./external.js";

const localStoragePrefix = "components_editor_";

export function usePersistentState(
  key,
  initialValue,
  encoder = (v) => v,
  decoder = (v) => v
) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(`${localStoragePrefix}${key}`);

    function tryParse() {
      try {
        return decoder(JSON.parse(item));
      } catch (e) {
        return initialValue;
      }
    }

    return item
      ? tryParse()
      : typeof initialValue === "function"
      ? initialValue()
      : initialValue;
  });
  return [
    storedValue,
    (val) => {
      const resultingVal = typeof val === "function" ? val(storedValue) : val;
      localStorage.setItem(
        `${localStoragePrefix}${key}`,
        typeof resultingVal === "undefined"
          ? ""
          : JSON.stringify(encoder(resultingVal))
      );
      setStoredValue(val);
    },
  ];
}

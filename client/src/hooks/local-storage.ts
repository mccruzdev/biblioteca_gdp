"use client";
import { useState, useEffect, useCallback } from "react";

interface Props<T> {
  initial: T | null;
  key: string;
}

export interface LocalStorageEx<T> {
  data: T | null;
  clear: () => void;
  getItem: () => T | null;
  setItem: (value: T) => void;
  removeItem: () => void;
}

export function useLocalStorage<T>(props: Props<T>): LocalStorageEx<T> {
  const isClient = typeof window !== "undefined";

  const parseItem = useCallback(
    (value: string | null): T | null => {
      try {
        if (
          typeof value === "string" &&
          !value.startsWith("{") &&
          !value.startsWith("[")
        ) {
          return value as unknown as T;
        }
        return value ? (JSON.parse(value) as T) : props.initial;
      } catch {
        return props.initial;
      }
    },
    [props.initial]
  );

  const getStoredItem = useCallback((): T | null => {
    if (!isClient) return props.initial;
    return parseItem(localStorage.getItem(props.key));
  }, [isClient, parseItem, props]);

  const [data, setData] = useState<T | null>(getStoredItem);

  useEffect(() => {
    setData(getStoredItem());
  }, [getStoredItem]);

  const getItem = (): T | null => {
    const item = getStoredItem();
    setData(item);
    return item;
  };

  const setItem = (value: T): void => {
    const stringValue =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value);
    localStorage.setItem(props.key, stringValue);
    setData(value);
  };

  const removeItem = (): void => {
    localStorage.removeItem(props.key);
    setData(props.initial);
  };

  const clear = (): void => {
    localStorage.clear();
    setData(props.initial);
  };

  return {
    data,
    clear,
    getItem,
    setItem,
    removeItem,
  };
}

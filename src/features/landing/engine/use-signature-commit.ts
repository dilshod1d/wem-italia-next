"use client";

import { useCallback, useRef } from "react";

export function useSignatureCommit<Key extends string = string>() {
  const signaturesRef = useRef<Partial<Record<Key, string>>>({});

  return useCallback(
    (key: Key, signature: string, commit: () => void) => {
      if (signaturesRef.current[key] === signature) {
        return false;
      }

      signaturesRef.current[key] = signature;
      commit();
      return true;
    },
    [],
  );
}

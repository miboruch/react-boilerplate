import { useState } from "react";
import { useDidUpdate } from "@better-hooks/lifecycle";

import { ServerErrorType } from "api/api.types";
import { UseShowContentReturnType } from "./use-show-content.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useShowContent<T extends { data: any; loading: boolean; error?: ServerErrorType | null }>(
  { data, loading, error }: T,
  permission?: boolean,
): UseShowContentReturnType {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useDidUpdate(
    () => {
      setInitialLoading(false);
    },
    [loading],
    true,
  );

  function checkPayloadData() {
    if (data?.results) {
      return Boolean(data?.results.length);
    }

    if (Array.isArray(data)) {
      return Boolean(data?.length);
    }

    return Boolean(data);
  }

  const hasPayload = checkPayloadData();
  const isPermissionError = permission === false || error?.statusCode === 403;
  const isLoading = loading || initialLoading;

  const showLoader = isLoading && !error;

  const showContent = !error && !isLoading && !isPermissionError && hasPayload;
  const showNoContent = Boolean(!isLoading && !error && data && !hasPayload && !isPermissionError);
  const showError = Boolean(!isLoading && error && !hasPayload && !isPermissionError);
  const showPagination = hasPayload && !showError && !showNoContent && !isPermissionError;
  const showPermissionError = isPermissionError;

  return {
    showContent,
    showNoContent,
    showError,
    showLoader,
    showPagination,
    showPermissionError,
  };
}

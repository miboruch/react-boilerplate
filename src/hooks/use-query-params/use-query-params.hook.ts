import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDidUpdate } from "@better-hooks/lifecycle";
import queryString from "query-string";

import { Nullable, NullableKeys } from "types";

export type QueryParam = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryParam | QueryParam[]>;

export type UseQueryParamsProps<Query> = { initialValues: Query };

const options = {
  arrayFormat: "comma",
  skipEmptyString: true,
} as queryString.ParseOptions;

export const useQueryParams = <Query extends QueryParams>(config?: UseQueryParamsProps<Query>) => {
  const navigate = useNavigate();
  const { initialValues } = config || {};

  const location = useLocation();

  const initialValue = (queryString.parse(location.search) || initialValues) as Query;

  const [query, setQuery] = useState<Query>(initialValue);

  useDidUpdate(
    () => {
      setQuery((prev) => ({ ...prev, ...queryString.parse(location.search) }));
    },
    [location.search],
    true,
  );

  function setQueryParams(value: Query) {
    const currentQuery = queryString.parse(location.search);
    const newQuery = { ...currentQuery, ...value };

    const stringifiedValue = queryString.stringify(newQuery, options);
    navigate(`${location.pathname}?${stringifiedValue}`, { replace: true });
  }

  function resetQueryParams() {
    setQuery({} as Query);
    navigate(`${location.pathname}`, { replace: true });
  }

  function setQueryParam<D extends keyof Query>(param: D, value: Nullable<Query[D]>) {
    const newQuery = { ...query };

    newQuery[param] = value as Query[D];

    const stringifiedValue = queryString.stringify(newQuery, options);

    navigate(`${location.pathname}?${stringifiedValue}`, { replace: true });
  }

  function updateQueryParams(values: Partial<Query>) {
    const newQuery = { ...query, ...values };

    const stringifiedValue = queryString.stringify(newQuery, options);
    navigate(`${location.pathname}?${stringifiedValue}`, { replace: true });
  }

  function stringify(queryParams: Query | QueryParams): string {
    const str = queryString.stringify(queryParams, options);
    const mark = str ? "?" : "";
    return mark + str;
  }

  const removeQuery = (key: string) => {
    const prevQuery = { ...query };
    delete prevQuery[key];

    const queries = queryString.stringify(prevQuery, options);
    navigate(`${location.pathname}?${queries}`, { replace: true });
  };

  const removeQueries = (keys: string[]) => {
    const prevQuery = { ...query };
    keys.forEach((key) => delete prevQuery[key]);

    const queries = queryString.stringify(prevQuery, options);
    navigate(`${location.pathname}?${queries}`, { replace: true });
  };

  return {
    query: query as NullableKeys<Query>,
    search: location.search,
    stringify,
    setQueryParams,
    setQueryParam,
    updateQueryParams,
    resetQueryParams,
    removeQuery,
    removeQueries,
  };
};

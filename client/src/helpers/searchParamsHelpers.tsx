const addParam = (
  searchParams: URLSearchParams,
  newParam: string,
  value: string
) => {
  var newParams = {};
  searchParams.set(newParam, value);
  searchParams.forEach(
    (value: string, key: string) => (newParams = { ...newParams, [key]: value })
  );
  return newParams;
};

const removeParam = (searchParams: URLSearchParams, removeParam: string) => {
  var newParams = {};
  searchParams.delete(removeParam);
  searchParams.forEach(
    (value: string, key: string) => (newParams = { ...newParams, [key]: value })
  );
  return newParams;
};

export { addParam, removeParam };


export const createRes = (status: Status, dataOrError: unknown,code:number=200) => {
  if (status === "success") return { status, data: dataOrError };
  if (status === "error" || status === "fail")
    return { status, data: null,code, error: dataOrError };

  throw new Error("Unhandled Status: " + status);
};


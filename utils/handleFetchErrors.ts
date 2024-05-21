import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function handleFetchErrors(
  error: FetchBaseQueryError | SerializedError
) {
  let errMsg: string;

  if ("status" in error) {
    errMsg = "error" in error ? error.error : JSON.stringify(error.data);
  } else {
    errMsg = error.message;
  }

  return errMsg;
}

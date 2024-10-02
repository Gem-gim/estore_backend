import React from "react";
import { ClipLoader } from "react-spinners";

export default function Loading({ loading }: { loading: boolean }) {
  return (
    <div>
      {" "}
      {loading ? (
        <ClipLoader
          className="fixed inset-0 m-auto z-20"
          size={100}
          color="#3c38ca"
        />
      ) : (
        ""
      )}
    </div>
  );
}

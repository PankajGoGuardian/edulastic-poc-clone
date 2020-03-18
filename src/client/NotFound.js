import react, { useEffect } from "react";

export default function NotFound({ history }) {
  useEffect(() => {
    history.replace("/");
  }, []);

  return null;
}

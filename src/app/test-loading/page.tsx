import { Suspense } from "react";
import { TestLoadingClient } from "./TestLoadingClient";

export default function TestLoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestLoadingClient />
    </Suspense>
  );
}

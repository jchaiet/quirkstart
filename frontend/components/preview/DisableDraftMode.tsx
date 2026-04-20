"use client";
import { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { disableDraftMode } from "@/app/actions";

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  const disable = () =>
    startTransition(async () => {
      await disableDraftMode();
      router.refresh();
    });

  if (isInIframe) return;

  return (
    <div style={{ backgroundColor: "orange", padding: "0.5rem" }}>
      {pending ? (
        "Disabling draft mode..."
      ) : (
        <button
          style={{ padding: "0 0.25rem" }}
          type="button"
          onClick={disable}
        >
          Disable draft mode
        </button>
      )}
    </div>
  );
}

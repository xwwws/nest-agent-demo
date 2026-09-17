"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "online" | "offline";

/**
 * 探测后端是否可用。
 * 这是公开接口，不需要 token，所以直接用 fetch（路径同样由 rewrites 代理）
 */
export default function ApiStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let alive = true;
    fetch("/api/backend/health")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(() => {
        if (alive) setStatus("online");
      })
      .catch(() => {
        if (alive) setStatus("offline");
      });
    return () => {
      alive = false;
    };
  }, []);

  const config: Record<Status, { dot: string; text: string; label: string }> = {
    checking: { dot: "bg-gray-400", text: "text-gray-500", label: "检测后端…" },
    online: { dot: "bg-green-500", text: "text-green-700", label: "后端已连接 (:9500)" },
    offline: { dot: "bg-red-500", text: "text-red-700", label: "后端未启动 (:9500)" },
  };
  const current = config[status];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
      <span className={`size-2 rounded-full ${current.dot}`} />
      <span className={current.text}>{current.label}</span>
    </span>
  );
}

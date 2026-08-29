"use client"
import { useState, useEffect } from "react";

export default function Home() {
  const [health, setHealth] = useState<any>('');
  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message));
  }, []);
  return (
    <>
      <h1>{health}</h1>
    </>
  );
}

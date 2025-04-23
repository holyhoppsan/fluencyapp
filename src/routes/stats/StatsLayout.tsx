import { Outlet } from "react-router-dom";

export default function StatsLayout() {
  return (
    <div>
      <h2>📊 Stats</h2>
      <Outlet />
    </div>
  );
}

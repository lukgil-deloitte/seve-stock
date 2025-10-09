import { useState } from "react";

export const MainFrame = () => {
  const [cheapestDay, setCheapestDay] = useState<string>();

  async function getCheapestDayClick() {
    const cheapestDay = await window.electron.getCheapestDay();
    setCheapestDay(cheapestDay);
  }



  return (
    <div>
      <span>{cheapestDay}</span>
      <button onClick={getCheapestDayClick}>Find cheapest day</button>
    </div>
  );
};
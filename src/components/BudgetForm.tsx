import { useState, ChangeEvent, useMemo, FormEvent } from "react";
import { useBudget } from "../hooks/useBudget";

export default function BudgetForm() {
  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setBudget(e.target.valueAsNumber);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "add-budget", payload: { budget } });
  };

  const notIsValid = useMemo(() => isNaN(budget) || budget == 0, [budget]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-5">
        <label
          htmlFor="budget"
          className="text-4xl text-blue-600 font-bold text-center"
        >
          Establece tu presupuesto
        </label>
        <input
          type="number"
          name="budget"
          id="budget"
          value={budget}
          placeholder="Define tu presupuesto"
          className="w-full bg-white border border-gray-200 p-2"
          onChange={handleChange}
        />
      </div>
      <input
        type="submit"
        value="Definir presupuesto"
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={notIsValid}
      />
    </form>
  );
}

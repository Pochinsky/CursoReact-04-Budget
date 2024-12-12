import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import type { DraftExpense, Value } from "../types";
import Error from "./Error";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });
  const [error, setError] = useState("");

  const { dispatch, state } = useBudget();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value,
    });
  };

  const handleChangeDate = (value: Value) => {
    setExpense({ ...expense, date: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    // update
    if (state.editingId)
      dispatch({
        type: "udpate-expense",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    // create
    else dispatch({ type: "add-expense", payload: { expense } });
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });
  };

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (currentExpense) => currentExpense.id === state.editingId
      )[0];
      setExpense(editingExpense);
    }
  }, [state.editingId]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500">
        Nuevo gasto
      </legend>
      {error && <Error>{error}</Error>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre del gasto
        </label>
        <input
          type="text"
          name="expenseName"
          id="expenseName"
          placeholder="Ej: Arriendo"
          value={expense.expenseName}
          className="bg-slate-100 p-2"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="Ej: 250000"
          value={expense.amount}
          className="bg-slate-100 p-2"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoría
        </label>
        <select
          name="category"
          id="category"
          value={expense.category}
          className="bg-slate-100 p-2"
          onChange={handleChange}
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-xl">
          Fecha del gasto
        </label>
        <DatePicker
          value={expense.date}
          className="bg-slate-100 p-2 border-0"
          onChange={handleChangeDate}
        />
      </div>
      <input
        type="submit"
        value={state.editingId ? "Guardar cambios" : "Registrar gasto"}
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
      />
    </form>
  );
}

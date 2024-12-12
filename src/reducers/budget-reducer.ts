import { v4 as uuidv4 } from "uuid";
import { DraftExpense, Expense } from "../types";

export type BudgetActions =
  | { type: "add-budget"; payload: { budget: number } }
  | { type: "close-modal" }
  | { type: "show-modal" }
  | { type: "add-expense"; payload: { expense: DraftExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } }
  | { type: "udpate-expense"; payload: { expense: Expense } }
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
  | { type: "reset-app" };

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
};

const initialBudget = (): number => {
  const localStorageBudget = localStorage.getItem("budget");
  return localStorageBudget ? +localStorageBudget : 0;
};

const initialExpenses = (): Expense[] => {
  const localStorageExpenses = localStorage.getItem("expenses");
  return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: initialExpenses(),
  editingId: "",
};

const createExpense = (draftExpenes: DraftExpense): Expense => ({
  ...draftExpenes,
  id: uuidv4(),
});

export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions
) => {
  if (action.type === "add-budget") {
    return { ...state, budget: action.payload.budget };
  }
  if (action.type === "show-modal") {
    return { ...state, modal: true };
  }
  if (action.type === "close-modal") {
    return { ...state, modal: false, editingId: "" };
  }
  if (action.type === "add-expense") {
    const expense = createExpense(action.payload.expense);
    return { ...state, expenses: [...state.expenses, expense], modal: false };
  }
  if (action.type === "remove-expense") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      ),
    };
  }
  if (action.type === "udpate-expense") {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense
      ),
      modal: false,
      editingId: "",
    };
  }
  if (action.type === "get-expense-by-id") {
    return { ...state, editingId: action.payload.id, modal: true };
  }
  if (action.type === "reset-app") {
    return {
      ...state,
      budget: 0,
      expenses: [],
    };
  }
  return state;
};

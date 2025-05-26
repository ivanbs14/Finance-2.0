"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  records as initialRecords,
  expenses as initialExpenses,
  foreignDonations as initialForeignDonations,
  users as initialUsers,
  churches as initialChurches,
} from "@/lib/data"
import type { Record, Expense, ForeignDonation, User, Church } from "@/lib/data"

interface StoreContextType {
  records: Record[]
  expenses: Expense[]
  foreignDonations: ForeignDonation[]
  users: User[]
  churches: Church[]
  addRecord: (record: Omit<Record, "id" | "date">) => void
  updateRecord: (id: string, record: Partial<Omit<Record, "id">>) => void
  deleteRecord: (id: string) => void
  addExpense: (expense: Omit<Expense, "id" | "date">) => void
  updateExpense: (id: string, expense: Partial<Omit<Expense, "id">>) => void
  deleteExpense: (id: string) => void
  addForeignDonation: (donation: Omit<ForeignDonation, "id" | "date">) => void
  updateForeignDonation: (id: string, donation: Partial<Omit<ForeignDonation, "id">>) => void
  deleteForeignDonation: (id: string) => void
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, user: Partial<Omit<User, "id">>) => void
  deleteUser: (id: string) => void
  addChurch: (church: Omit<Church, "id" | "createdAt">) => void
  updateChurch: (id: string, church: Partial<Omit<Church, "id" | "createdAt">>) => void
  deleteChurch: (id: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [foreignDonations, setForeignDonations] = useState<ForeignDonation[]>(initialForeignDonations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [churches, setChurches] = useState<Church[]>(initialChurches);

  // Carregar do localStorage após o primeiro render (client-side)
  useEffect(() => {
    const storedRecords = localStorage.getItem("records");
    if (storedRecords) setRecords(JSON.parse(storedRecords));

    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));

    const storedForeignDonations = localStorage.getItem("foreignDonations");
    if (storedForeignDonations) setForeignDonations(JSON.parse(storedForeignDonations));

    const storedUsers = localStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedChurches = localStorage.getItem("churches");
    if (storedChurches) setChurches(JSON.parse(storedChurches));
  }, []);

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("foreignDonations", JSON.stringify(foreignDonations));
  }, [foreignDonations]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("churches", JSON.stringify(churches));
  }, [churches]);

  // Funções para manipular registros
  const addRecord = (record: Omit<Record, "id" | "date">) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setRecords((prev) => [...prev, newRecord])
  }

  const updateRecord = (id: string, record: Partial<Omit<Record, "id">>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...record } : r)))
  }

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  // Funções para manipular despesas
  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setExpenses((prev) => [...prev, newExpense])
  }

  const updateExpense = (id: string, expense: Partial<Omit<Expense, "id">>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...expense } : e)))
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  // Funções para manipular doações estrangeiras
  const addForeignDonation = (donation: Omit<ForeignDonation, "id" | "date">) => {
    const newDonation = {
      ...donation,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setForeignDonations((prev) => [...prev, newDonation])
  }

  const updateForeignDonation = (id: string, donation: Partial<Omit<ForeignDonation, "id">>) => {
    setForeignDonations((prev) => prev.map((d) => (d.id === id ? { ...d, ...donation } : d)))
  }

  const deleteForeignDonation = (id: string) => {
    setForeignDonations((prev) => prev.filter((d) => d.id !== id))
  }

  // Funções para manipular usuários
  const addUser = (user: Omit<User, "id">) => {
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
    }
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = (id: string, user: Partial<Omit<User, "id">>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...user } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  // Funções para manipular igrejas
  const addChurch = (church: Omit<Church, "id" | "createdAt">) => {
    const newChurch = {
      ...church,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setChurches((prev) => [...prev, newChurch])
  }

  const updateChurch = (id: string, church: Partial<Omit<Church, "id" | "createdAt">>) => {
    setChurches((prev) => prev.map((c) => (c.id === id ? { ...c, ...church } : c)))
  }

  const deleteChurch = (id: string) => {
    setChurches((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <StoreContext.Provider
      value={{
        records,
        expenses,
        foreignDonations,
        users,
        churches,
        addRecord,
        updateRecord,
        deleteRecord,
        addExpense,
        updateExpense,
        deleteExpense,
        addForeignDonation,
        updateForeignDonation,
        deleteForeignDonation,
        addUser,
        updateUser,
        deleteUser,
        addChurch,
        updateChurch,
        deleteChurch,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Hook personalizado para usar o contexto de dados
export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider")
  }
  return context
}

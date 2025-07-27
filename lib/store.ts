import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PaymentMethod = "Cash" | "Check" | "Card" | "Transfer" | "Other"
export type Category = "Tithes" | "Offerings" | "Donations" | "Other"
export type Currency = "BRL" | "USD" | "EUR" | "GBP" | "Other"

export interface Record {
  id: string
  serviceDescription: string
  countedBy: string
  name: string
  amount: number
  category: Category
  paymentMethod: PaymentMethod
  createdAt?: Date
}

export interface Expense {
  id: string
  serviceDescription: string
  amount: number
  createdAt?: Date
}

export interface ForeignDonation {
  id: string
  name: string
  amount: number
  currency: Currency
  paymentMethod: PaymentMethod
  description: string
  createdAt?: Date
}

// Dados de exemplo para registros de doações
const sampleRecords: Record[] = [
  {
    id: "rec-1",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "João da Silva",
    amount: 150.0,
    category: "Tithes",
    paymentMethod: "Cash",
  },
  {
    id: "rec-2",
    serviceDescription: "Culto de Quarta",
    countedBy: "Pedro Santos",
    name: "Ana Souza",
    amount: 75.5,
    category: "Offerings",
    paymentMethod: "Transfer",
  },
  {
    id: "rec-3",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "Carlos Ferreira",
    amount: 200.0,
    category: "Donations",
    paymentMethod: "Card",
  },
  {
    id: "rec-4",
    serviceDescription: "Evento Especial",
    countedBy: "Pedro Santos",
    name: "Mariana Costa",
    amount: 500.0,
    category: "Donations",
    paymentMethod: "Check",
  },
  {
    id: "rec-5",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "Roberto Alves",
    amount: 100.0,
    category: "Tithes",
    paymentMethod: "Cash",
  },
]

// Dados de exemplo para despesas
const sampleExpenses: Expense[] = [
  {
    id: "exp-1",
    serviceDescription: "Conta de Luz",
    amount: 350.0,
  },
  {
    id: "exp-2",
    serviceDescription: "Conta de Água",
    amount: 120.0,
  },
  {
    id: "exp-3",
    serviceDescription: "Material de Limpeza",
    amount: 200.0,
  },
  {
    id: "exp-4",
    serviceDescription: "Manutenção do Ar Condicionado",
    amount: 450.0,
  },
]

// Dados de exemplo para doações estrangeiras
const sampleForeignDonations: ForeignDonation[] = [
  {
    id: "for-1",
    name: "Igreja Parceira EUA",
    amount: 1000.0,
    currency: "USD",
    paymentMethod: "Transfer",
    description: "Doação para projeto social",
  },
  {
    id: "for-2",
    name: "Missionário na Europa",
    amount: 800.0,
    currency: "EUR",
    paymentMethod: "Transfer",
    description: "Apoio para construção",
  },
]

interface StoreState {
  records: Record[]
  expenses: Expense[]
  foreignDonations: ForeignDonation[]
  addRecord: (record: Omit<Record, "id" | "date">) => void
  updateRecord: (id: string, record: Partial<Omit<Record, "id">>) => void
  deleteRecord: (id: string) => void
  addExpense: (expense: Omit<Expense, "id" | "date">) => void
  updateExpense: (id: string, expense: Partial<Omit<Expense, "id">>) => void
  deleteExpense: (id: string) => void
  addForeignDonation: (donation: Omit<ForeignDonation, "id" | "date">) => void
  updateForeignDonation: (id: string, donation: Partial<Omit<ForeignDonation, "id">>) => void
  deleteForeignDonation: (id: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Inicializar com dados de exemplo
      records: sampleRecords,
      expenses: sampleExpenses,
      foreignDonations: sampleForeignDonations,

      addRecord: (record) =>
        set((state) => ({
          records: [...state.records, { ...record, id: crypto.randomUUID(), date: new Date().toISOString() }],
        })),

      updateRecord: (id, record) =>
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, ...record } : r)),
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: crypto.randomUUID(), date: new Date().toISOString() }],
        })),

      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addForeignDonation: (donation) =>
        set((state) => ({
          foreignDonations: [
            ...state.foreignDonations,
            { ...donation, id: crypto.randomUUID(), date: new Date().toISOString() },
          ],
        })),

      updateForeignDonation: (id, donation) =>
        set((state) => ({
          foreignDonations: state.foreignDonations.map((d) => (d.id === id ? { ...d, ...donation } : d)),
        })),

      deleteForeignDonation: (id) =>
        set((state) => ({
          foreignDonations: state.foreignDonations.filter((d) => d.id !== id),
        })),
    }),
    {
      name: "church-donation-storage",
    },
  ),
)

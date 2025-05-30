/**
 * DADOS SIMULADOS (MOCK)
 *
 * Este arquivo contém todos os dados simulados para a aplicação.
 * Em um ambiente de produção, estes dados viriam de uma API ou banco de dados.
 */

// Tipos de dados
export type PaymentMethod = "Cash" | "Check" | "Card" | "Transfer" | "Other"
export type Category = "Tithes" | "Offering" | "Donations" | "Other"
export type Currency = "BRL" | "USD" | "EUR" | "GBP" | "Other"
export type UserRole = "shepherd" | "tesoureiro" | "admin"

// Interfaces
export interface User {
  id: string
  name: string
  email: string
  password: string // Em produção, nunca armazene senhas em texto puro
  role: UserRole
  churchId?: string,
  churchName?: string
}

export interface Church {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: string
}

export interface Record {
  id: string
  serviceDescription: string
  countedBy: string
  name: string
  amount: number
  category: Category
  paymentMethod: PaymentMethod
  date: string
}

export interface Expense {
  id: string
  serviceDescription: string
  amount: number
  date: string
}

export interface ForeignDonation {
  id: string
  name: string
  amount: number
  currency: Currency
  paymentMethod: PaymentMethod
  description: string
  date: string
}

// Igrejas simuladas
export const churches: Church[] = [
  {
    id: "1",
    name: "Igreja Comunidade da Fé",
    address: "Rua Exemplo, 123, Centro",
    phone: "(11) 1234-5678",
    email: "contato@igrejacomunidade.com",
    createdAt: new Date(2020, 1, 15).toISOString(),
  },
  {
    id: "2",
    name: "Catedral da Esperança",
    address: "Av. Principal, 456, Jardim Novo",
    phone: "(11) 8765-4321",
    email: "contato@catedraldasesperanca.com",
    createdAt: new Date(2021, 3, 10).toISOString(),
  },
]

// Usuários simulados
export const users: User[] = [
  {
    id: "1",
    name: "Shepherd João Silva",
    email: "shepherd@igreja.com",
    password: "igreja123", // Em produção, use senhas hash
    role: "shepherd",
    churchName: "Igreja Comunidade da Fé",
    churchId: "1",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@igreja.com",
    password: "maria123", // Em produção, use senhas hash
    role: "tesoureiro",
    churchName: "Igreja Comunidade da Fé",
    churchId: "1",
  },
  {
    id: "3",
    name: "Shepherd Carlos Mendes",
    email: "carlos@catedral.com",
    password: "carlos123", // Em produção, use senhas hash
    role: "shepherd",
    churchName: "Catedral da Esperança",
    churchId: "2",
  },
]

// Dados de exemplo para registros de doações
export const records: Record[] = [
  {
    id: "rec-1",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "João da Silva",
    amount: 150.0,
    category: "Tithes",
    paymentMethod: "Cash",
    date: new Date(2025, 5, 15).toISOString(),
  },
  {
    id: "rec-2",
    serviceDescription: "Culto de Quarta",
    countedBy: "Pedro Santos",
    name: "Ana Souza",
    amount: 75.5,
    category: "Offering",
    paymentMethod: "Transfer",
    date: new Date(2025, 5, 18).toISOString(),
  },
  {
    id: "rec-3",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "Carlos Ferreira",
    amount: 200.0,
    category: "Donation",
    paymentMethod: "Card",
    date: new Date(2025, 5, 22).toISOString(),
  },
  {
    id: "rec-4",
    serviceDescription: "Evento Especial",
    countedBy: "Pedro Santos",
    name: "Mariana Costa",
    amount: 500.0,
    category: "Donation",
    paymentMethod: "Check",
    date: new Date(2025, 5, 25).toISOString(),
  },
  {
    id: "rec-5",
    serviceDescription: "Culto de Domingo",
    countedBy: "Maria Oliveira",
    name: "Roberto Alves",
    amount: 100.0,
    category: "Tithes",
    paymentMethod: "Cash",
    date: new Date(2025, 5, 29).toISOString(),
  },
]

// Dados de exemplo para despesas
export const expenses: Expense[] = [
  {
    id: "exp-1",
    serviceDescription: "Conta de Luz",
    amount: 350.0,
    date: new Date(2025, 5, 10).toISOString(),
  },
  {
    id: "exp-2",
    serviceDescription: "Conta de Água",
    amount: 120.0,
    date: new Date(2025, 5, 12).toISOString(),
  },
  {
    id: "exp-3",
    serviceDescription: "Material de Limpeza",
    amount: 200.0,
    date: new Date(2025, 5, 20).toISOString(),
  },
  {
    id: "exp-4",
    serviceDescription: "Manutenção do Ar Condicionado",
    amount: 450.0,
    date: new Date(2025, 5, 22).toISOString(),
  },
]

// Dados de exemplo para doações estrangeiras
export const foreignDonations: ForeignDonation[] = [
  {
    id: "for-1",
    name: "Igreja Parceira EUA",
    amount: 1000.0,
    currency: "USD",
    paymentMethod: "Transfer",
    description: "Doação para projeto social",
    date: new Date(2025, 5, 15).toISOString(),
  },
  {
    id: "for-2",
    name: "Missionário na Europa",
    amount: 800.0,
    currency: "EUR",
    paymentMethod: "Transfer",
    description: "Apoio para construção",
    date: new Date(2025, 5, 25).toISOString(),
  },
]

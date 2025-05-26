"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { ExpensesList } from "@/components/expenses-list"
import { EditExpenseModal } from "@/components/edit-expense-modal"

const expenseSchema = z.object({
  serviceDescription: z.string().min(1, { message: "Descrição do serviço é obrigatória" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

export default function AddExpensePage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      serviceDescription: "",
      amount: undefined,
    },
  })

  const onSubmit = (data: ExpenseFormValues) => {
    addExpense(data)
    toast({
      title: "Despesa adicionada",
      description: `Despesa de R$ ${data.amount.toFixed(2)} registrada com sucesso.`,
    })
    reset()
  }

  const handleEdit = (id: string) => {
    const expense = expenses.find((e) => e.id === id)
    if (expense) {
      setEditingExpense(id)
      setIsEditing(true)
    }
  }

  const handleUpdate = (id: string, data: ExpenseFormValues) => {
    updateExpense(id, data)
    setIsEditing(false)
    setEditingExpense(null)
    toast({
      title: "Despesa atualizada",
      description: "Despesa atualizada com sucesso.",
    })
  }

  const handleDelete = (id: string) => {
    deleteExpense(id)
    toast({
      title: "Despesa excluída",
      description: "Despesa excluída com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-muted-foreground">Record church expenses and expenditures</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New expense</CardTitle>
          <CardDescription>Fill in the fields below to add a new expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Description Service</Label>
                <Input
                  id="serviceDescription"
                  placeholder="Ex: Building Maintenance"
                  {...register("serviceDescription")}
                />
                {errors.serviceDescription && (
                  <p className="text-sm text-red-500">{errors.serviceDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Value</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      <ExpensesList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />

      {isEditing && editingExpense && (
        <EditExpenseModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(data) => handleUpdate(editingExpense, data)}
          defaultValues={expenses.find((e) => e.id === editingExpense) || undefined}
        />
      )}
    </div>
  )
}

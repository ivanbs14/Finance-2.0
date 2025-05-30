"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Cookies from "js-cookie";
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
import { Expense } from "@/lib/data";
import api from "@/services/apiService";

const expenseSchema = z.object({
  serviceDescription: z.string().min(1, { message: "Descrição do serviço é obrigatória" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

export default function AddExpensePage() {
  const { user } = useAuth()
  const token = Cookies.get('token');
  const { expenses, addExpense, updateExpense, deleteExpense } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const { toast } = useToast()
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])

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

  const onSubmit = async (data: ExpenseFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        // Envia os dados para a API
        const resp = await api.post("/expenses", dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Novo registro:", resp.data);
        fetchExpenses();
        toast({
          title: "Expense adicionado",
          description: `Expense de R$ ${data.amount.toFixed(2)} registrada com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar Expense:", error);
      }

      reset();
    }
  }

  const updatedRecord = async (id: string, data: ExpenseFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        // Envia os dados para a API
        const resp = await api.patch(`/expenses/${id}`, dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Expense edited:", resp.data);
        fetchExpenses();
        toast({
          title: "Expense edited",
          description: `Expense com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar Expense:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    const expense = allExpenses.find((e) => e.id === id)
    if (expense) {
      setEditingExpense(id)
      setIsEditing(true)
    }
  }

  const handleUpdate = (id: string, data: ExpenseFormValues) => {
    updatedRecord(id, data)
    setIsEditing(false)
    setEditingExpense(null)
    toast({
      title: "Despesa atualizada",
      description: "Despesa atualizada com sucesso.",
    })
  }

  const deletedExpense = async (id: string) => {
    if (token) {
      try {
        const response = await api.delete(`/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchExpenses();
        toast({
          title: "Despesa excluída",
          description: "Despesa excluída com sucesso.",
        })
      } catch (error) {
        console.error("Erro ao deletar registros:", error);
      }
    }
  }

  const fetchExpenses = async () => {
    if (user && token) {
      try {
        const response = await api.get(`/expenses?churchId=${user.churchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("expenses:", response.data);
        setAllExpenses(response.data);
      } catch (error) {
        console.error("Erro ao buscar expenses:", error);
      }
    }
  }

  useEffect(() => {
      fetchExpenses();
  }, [])

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

      <ExpensesList expenses={allExpenses} onEdit={handleEdit} onDelete={(id) => deletedExpense(id)} />

      {isEditing && editingExpense && (
        <EditExpenseModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(data) => handleUpdate(editingExpense, data)}
          defaultValues={allExpenses.find((e) => e.id === editingExpense) || undefined}
        />
      )}
    </div>
  )
}

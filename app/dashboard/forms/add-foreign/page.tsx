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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStore, type Currency, type PaymentMethod } from "@/lib/store"
import { ForeignDonationsList } from "@/components/foreign-donations-list"
import { EditForeignDonationModal } from "@/components/edit-foreign-donation-modal"
import { Expense, ForeignDonation } from "@/lib/data"
import api from "@/services/apiService";

const foreignDonationSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
  currency: z.enum(["BRL", "USD", "EUR", "GBP", "Other"]),
  paymentMethod: z.enum(["Cash", "Check", "Card", "Transfer", "Other"]),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
})

type ForeignDonationFormValues = z.infer<typeof foreignDonationSchema>

export default function AddForeignPage() {
  const { user } = useAuth()
  const token = Cookies.get('token');
  const { foreignDonations, addForeignDonation, updateForeignDonation, deleteForeignDonation } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingDonation, setEditingDonation] = useState<string | null>(null)
  const { toast } = useToast()
  const [allforeing, setAllForeign] = useState<ForeignDonation[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ForeignDonationFormValues>({
    resolver: zodResolver(foreignDonationSchema),
    defaultValues: {
      name: "",
      amount: undefined,
      currency: "USD",
      paymentMethod: "Cash",
      description: "",
    },
  })

  const onSubmit = async (data: ForeignDonationFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        // Envia os dados para a API
        const resp = await api.post("/foreign", dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Novo Doação:", resp.data);
        fetchForeigns();
        toast({
          title: "Doação adicionado",
          description: `Doação de R$ ${data.amount.toFixed(2)} registrada com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar Doação:", error);
      }

      reset();
    }
  }

  const updatedForeign = async (id: string, data: ForeignDonationFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        const resp = await api.patch(`/foreign/${id}`, dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Doação edited:", resp.data);
        fetchForeigns();
        toast({
          title: "Doação edited",
          description: ` registrada com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar Doação:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    const donation = allforeing.find((d) => d.id === id)
    if (donation) {
      setEditingDonation(id)
      setIsEditing(true)
    }
  }

  const handleUpdate = (id: string, data: ForeignDonationFormValues) => {
    updatedForeign(id, data)
    setIsEditing(false)
    setEditingDonation(null)

  }

  const handleDelete = (id: string) => {
    deletedForeign(id)

  }

  const deletedForeign = async (id: string) => {
    if (token) {
      try {
        const response = await api.delete(`/foreign/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchForeigns();
        toast({
          title: "Doação estrangeira excluída",
          description: "Doação excluída com sucesso.",
        })
      } catch (error) {
        console.error("Erro ao deletar registros:", error);
      }
    }
  }

  useEffect(() => {
      fetchForeigns();
  }, [])

  const fetchForeigns = async () => {
    if (user && token) {
      try {
        const response = await api.get(`/foreign?churchId=${user.churchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Doação:", response.data);
        setAllForeign(response.data);
      } catch (error) {
        console.error("Erro ao buscar Doação:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Foreign Donation</h1>
        <p className="text-muted-foreground">Record donations in foreign currency</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Foreign Donation</CardTitle>
          <CardDescription>
            Fill in the fields below to add a new donation in foreign currency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Donor name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Value</Label>
                <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Coin</Label>
                <Select defaultValue="EUR" onValueChange={(value) => setValue("currency", value as Currency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">Pound Sterling (GBP)</SelectItem>
                    <SelectItem value="BRL">Brazilian Real (BRL)</SelectItem>
                    <SelectItem value="Other">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  defaultValue="Cash"
                  onValueChange={(value) => setValue("paymentMethod", value as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Donation details" {...register("description")} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <Button type="submit" className="w-full">
              Add Donation
            </Button>
          </form>
        </CardContent>
      </Card>

      <ForeignDonationsList donations={allforeing} onEdit={handleEdit} onDelete={handleDelete} />

      {isEditing && editingDonation && (
        <EditForeignDonationModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(data) => handleUpdate(editingDonation, data)}
          defaultValues={allforeing.find((d) => d.id === editingDonation) || undefined}
        />
      )}
    </div>
  )
}

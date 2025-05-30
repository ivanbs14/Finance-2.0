"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import { Record } from "@/lib/store"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store-context"
import { RecordsList } from "@/components/records-list"
import { EditRecordModal } from "@/components/edit-record-modal"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Category, PaymentMethod } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import api from "@/services/apiService"
import { set } from "date-fns"

const recordSchema = z.object({
  serviceDescription: z.string().min(1, { message: "Descrição do serviço é obrigatória" }),
  countedBy: z.string().min(1, { message: "Nome de quem contou é obrigatório" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
  category: z.enum(["Tithes", "Offering", "Donations", "Other"]),
  paymentMethod: z.enum(["Cash", "Check", "Card", "Transfer", "Other"]),
  createdAt: z.string().optional(),
})

type RecordFormValues = z.infer<typeof recordSchema>

export default function AddRecordPage() {
  const { user } = useAuth()
  const token = Cookies.get('token');
  const { records, addRecord, updateRecord, deleteRecord } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingRecord, setEditingRecord] = useState<string | null>(null)
  const { toast } = useToast()
  const [allRecords, setAllRecords] = useState<Record[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      serviceDescription: "",
      countedBy: "",
      name: "",
      amount: undefined,
      category: "Offering",
      paymentMethod: "Cash",
    },
  })

  const onSubmit = async (data: RecordFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        // Envia os dados para a API
        const resp = await api.post("/records", dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Novo registro:", resp.data);
        fetchRecords();
        toast({
          title: "Registro adicionado",
          description: `Doação de R$ ${data.amount.toFixed(2)} registrada com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar registro:", error);
      }

      reset();
    }
  };

  const updatedRecord = async (id: string, data: RecordFormValues) => {
    if (user && token) {
      const dataAll = { ...data, churchId: user.churchId };

      try {
        // Envia os dados para a API
        const resp = await api.patch(`/records/${id}`, dataAll, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Record edited:", resp.data);
        fetchRecords();
        toast({
          title: "Record edited",
          description: ` registrada com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao adicionar registro:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    const record = allRecords.find((r) => r.id === id)
    console.log("Registro encontrado:", record)
    if (record) {
      setValue("serviceDescription", record.serviceDescription)
      setValue("countedBy", record.countedBy)
      setValue("name", record.name)
      setValue("amount", record.amount)
      setValue("category", record.category)
      setValue("paymentMethod", record.paymentMethod)
      setEditingRecord(id)
      setIsEditing(true)
    }
  }

  const handleUpdate = (id: string, data: RecordFormValues) => {
    updatedRecord(id, data)
    setIsEditing(false)
    setEditingRecord(null)
    toast({
      title: "Registro atualizado",
      description: "Doação atualizada com sucesso.",
    })
  }

  const handleDelete = (id: string) => {
    deletedRecord(id)
    console.log("Registro excluído:", id)
    toast({
      title: "Registro excluído",
      description: "Doação excluída com sucesso.",
    })
  }

  const deletedRecord = async (id: string) => {
    if (token) {
      try {
        const response = await api.delete(`/records/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchRecords();
      } catch (error) {
        console.error("Erro ao deletar registros:", error);
      }
    }
  }

  useEffect(() => {
      fetchRecords();
  }, [])

  const fetchRecords = async () => {
    if (user && token) {
      try {
        const response = await api.get(`/records?churchId=${user.churchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Registros:", response.data);
        setAllRecords(response.data);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Add Record" description="Record member donations and contributions" />

      <Card>
        <CardHeader>
          <CardTitle>New Registration</CardTitle>
          <CardDescription>Fill in the fields below to add a new record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Service Description</Label>
                <Input id="serviceDescription" placeholder="Ex: Sunday Service" {...register("serviceDescription")} />
                {errors.serviceDescription && (
                  <p className="text-sm text-red-500">{errors.serviceDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="countedBy">Told By</Label>
                <Input id="countedBy" placeholder="Name of the person who told the story" {...register("countedBy")} />
                {errors.countedBy && <p className="text-sm text-red-500">{errors.countedBy.message}</p>}
              </div>
            </div>

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
                <Label htmlFor="category">Categoria</Label>
                <Select defaultValue="Offering" onValueChange={(value) => setValue("category", value as Category)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tithes">Tithe</SelectItem>
                    <SelectItem value="Offering">Offer</SelectItem>
                    <SelectItem value="Donations">Donation</SelectItem>
                    <SelectItem value="Other">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  defaultValue="Cash"
                  onValueChange={(value) => setValue("paymentMethod", value as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Money</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Other">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Add Transations
            </Button>
          </form>
        </CardContent>
      </Card>

      <RecordsList records={allRecords} onEdit={handleEdit} onDelete={handleDelete} />

      {isEditing && editingRecord && (
        <EditRecordModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={(data) => handleUpdate(editingRecord, data)}
          defaultValues={allRecords.find((r) => r.id === editingRecord) || undefined}
        />
      )}
    </div>
  )
}

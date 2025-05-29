"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Category, PaymentMethod, Record } from "@/lib/store"

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

interface EditRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: RecordFormValues) => void
  defaultValues?: Record
}

export function EditRecordModal({ isOpen, onClose, onSave, defaultValues }: EditRecordModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      serviceDescription: "",
      countedBy: "",
      name: "",
      amount: 0,
      category: "Offering",
      paymentMethod: "Cash",
      createdAt: new Date().toISOString(),
    },
  })

  useEffect(() => {
    if (defaultValues) {
      setValue("serviceDescription", defaultValues.serviceDescription)
      setValue("countedBy", defaultValues.countedBy)
      setValue("name", defaultValues.name)
      setValue("amount", defaultValues.amount)
      setValue("category", defaultValues.category)
      setValue("paymentMethod", defaultValues.paymentMethod)
      setValue("createdAt", defaultValues.createdAt ? new Date(defaultValues.createdAt).toISOString() : new Date().toISOString())
    }
  }, [defaultValues, setValue])

  const onSubmit = (data: RecordFormValues) => {
    onSave(data)
    console.log("Record updated:", { ...data, id: defaultValues?.id })
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] text-white">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-serviceDescription">Description Service</Label>
              <Input
                id="edit-serviceDescription"
                placeholder="Ex: Sunday Service"
                {...register("serviceDescription")}
              />
              {errors.serviceDescription && <p className="text-sm text-red-500">{errors.serviceDescription.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-countedBy">Told By</Label>
              <Input id="edit-countedBy" placeholder="Name of the person" {...register("countedBy")} />
              {errors.countedBy && <p className="text-sm text-red-500">{errors.countedBy.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" placeholder="Donor name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Value</Label>
              <Input id="edit-amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                defaultValue={defaultValues?.category}
                onValueChange={(value) => setValue("category", value as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selection category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tithes">Tithe</SelectItem>
                  <SelectItem value="Offering">Offering</SelectItem>
                  <SelectItem value="Donations">Donation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-paymentMethod">Payment Method</Label>
              <Select
                defaultValue={defaultValues?.paymentMethod}
                onValueChange={(value) => setValue("paymentMethod", value as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um método" />
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

          <DialogFooter>
            <Button type="button" variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

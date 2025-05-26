"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Expense } from "@/lib/store"

const expenseSchema = z.object({
  serviceDescription: z.string().min(1, { message: "Descrição do serviço é obrigatória" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface EditExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ExpenseFormValues) => void
  defaultValues?: Expense
}

export function EditExpenseModal({ isOpen, onClose, onSave, defaultValues }: EditExpenseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      serviceDescription: "",
      amount: 0,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      setValue("serviceDescription", defaultValues.serviceDescription)
      setValue("amount", defaultValues.amount)
    }
  }, [defaultValues, setValue])

  const onSubmit = (data: ExpenseFormValues) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] text-white">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-serviceDescription">Description Service</Label>
            <Input
              id="edit-serviceDescription"
              placeholder="Ex: Building Maintenance"
              {...register("serviceDescription")}
            />
            {errors.serviceDescription && <p className="text-sm text-red-500">{errors.serviceDescription.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Value</Label>
            <Input id="edit-amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
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

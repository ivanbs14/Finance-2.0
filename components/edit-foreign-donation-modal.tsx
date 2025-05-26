"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Currency, PaymentMethod, ForeignDonation } from "@/lib/store"

const foreignDonationSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo" }),
  currency: z.enum(["BRL", "USD", "EUR", "GBP", "Other"]),
  paymentMethod: z.enum(["Cash", "Check", "Card", "Transfer", "Other"]),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
})

type ForeignDonationFormValues = z.infer<typeof foreignDonationSchema>

interface EditForeignDonationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ForeignDonationFormValues) => void
  defaultValues?: ForeignDonation
}

export function EditForeignDonationModal({ isOpen, onClose, onSave, defaultValues }: EditForeignDonationModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ForeignDonationFormValues>({
    resolver: zodResolver(foreignDonationSchema),
    defaultValues: {
      name: "",
      amount: 0,
      currency: "USD",
      paymentMethod: "Cash",
      description: "",
    },
  })

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name)
      setValue("amount", defaultValues.amount)
      setValue("currency", defaultValues.currency)
      setValue("paymentMethod", defaultValues.paymentMethod)
      setValue("description", defaultValues.description)
    }
  }, [defaultValues, setValue])

  const onSubmit = (data: ForeignDonationFormValues) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] text-white">
        <DialogHeader>
          <DialogTitle>Edit Foreign Donation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
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
              <Label htmlFor="edit-currency">Coin</Label>
              <Select
                defaultValue={defaultValues?.currency}
                onValueChange={(value) => setValue("currency", value as Currency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Coin" />
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
              <Label htmlFor="edit-paymentMethod">Payment Method</Label>
              <Select
                defaultValue={defaultValues?.paymentMethod}
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
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" placeholder="Donation details" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
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

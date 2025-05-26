"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import type { ForeignDonation } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ForeignDonationsListProps {
  donations: ForeignDonation[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ForeignDonationsList({ donations, onEdit, onDelete }: ForeignDonationsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "GBP":
        return "£"
      case "BRL":
        return "R$"
      default:
        return ""
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "Cash":
        return "Cash"
      case "Check":
        return "Check"
      case "Card":
        return "Card"
      case "Transfer":
        return "Transfer"
      case "Other":
        return "Other"
      default:
        return method
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Foreign Donations</CardTitle>
          <CardDescription>List of all donations in foreign currency</CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No foreign donations found</p>
              <p className="text-sm text-muted-foreground">Add a new donation using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Coin</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{format(new Date(donation.date), "yyyy/MM/dd")}</TableCell>
                      <TableCell>{donation.name}</TableCell>
                      <TableCell>{donation.currency}</TableCell>
                      <TableCell>{getPaymentMethodLabel(donation.paymentMethod)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{donation.description}</TableCell>
                      <TableCell className="text-right">
                        {getCurrencySymbol(donation.currency)} {donation.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="default" size="icon" onClick={() => onEdit(donation.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="icon" onClick={() => confirmDelete(donation.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this donation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

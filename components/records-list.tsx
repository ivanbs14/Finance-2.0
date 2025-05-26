"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import type { Record } from "@/lib/store"
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

interface RecordsListProps {
  records: Record[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function RecordsList({ records, onEdit, onDelete }: RecordsListProps) {
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "Tithe":
        return "Tithe"
      case "Offering":
        return "Offering"
      case "Donation":
        return "Donation"
      case "Other":
        return "Other"
      default:
        return category
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
          <CardTitle>Records</CardTitle>
          <CardDescription>List of all records</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No records found</p>
              <p className="text-sm text-muted-foreground">Add a new record using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "yyyy/MM/dd")}</TableCell>
                      <TableCell>{record.serviceDescription}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{getCategoryLabel(record.category)}</TableCell>
                      <TableCell>{getPaymentMethodLabel(record.paymentMethod)}</TableCell>
                      <TableCell className="text-right">{record.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="default" size="icon" onClick={() => onEdit(record.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="icon" onClick={() => confirmDelete(record.id)}>
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
              Are you sure you want to delete this record? This action cannot be undone.
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

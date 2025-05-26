"use client"

import { use, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRangePicker } from "@/components/date-range-picker"
import { useStore } from "@/lib/store"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { Download } from "lucide-react"

type StrictDateRange = {
  from: Date
  to: Date
};

export default function AllGiversPage() {
  const { records, expenses, foreignDonations } = useStore()
  const [dateRange, setDateRange] = useState<StrictDateRange>({
  from: new Date(),
  to: new Date()
});

  function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

    // Filter data based on date range
  const filteredRecords = dateRange
    ? records.filter((record) => {
        const recordDate = normalizeDate(new Date(dateRange.from))
        const from = normalizeDate(dateRange.from)
        const to = normalizeDate(dateRange.to)
        return recordDate >= from && recordDate <= to
      })
  : records

  const filteredExpenses = dateRange
    ? expenses.filter((expense) => {
        const expenseDate = normalizeDate(new Date(dateRange.from))
        const from = normalizeDate(dateRange.from)
        const to = normalizeDate(dateRange.to)
        return expenseDate >= from && expenseDate <= to
      })
  : expenses

  const filteredForeignDonations = dateRange
    ? foreignDonations.filter((donation) => {
        const donationDate = normalizeDate(new Date(dateRange.from))
        const from = normalizeDate(dateRange.from)
        const to = normalizeDate(dateRange.to)
        return donationDate >= from && donationDate <= to
      })
  : foreignDonations

  // Calculate totals
  const totalRecords = filteredRecords.reduce((sum, record) => sum + record.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalForeign = filteredForeignDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const grandTotal = totalRecords - totalExpenses + totalForeign

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Relatório de Doações e Despesas", 14, 22)

    // Add date range if selected
    if (dateRange) {
      doc.setFontSize(12)
      doc.text(`Período: ${format(dateRange.from, "dd/MM/yyyy")} até ${format(dateRange.to, "dd/MM/yyyy")}`, 14, 30)
    }

    // Add records table
    doc.setFontSize(14)
    doc.text("Registros de Doações", 14, 40)

    // @ts-ignore
    doc.autoTable({
      startY: 45,
      head: [["Date", "Service", "Name", "Category", "Method", "Value"]],
      body: filteredRecords.map((record) => [
        format(new Date(record.date), "yyyy/MM/dd"),
        record.serviceDescription,
        record.name,
        record.category,
        record.paymentMethod,
        `${record.amount.toFixed(2)}`,
      ]),
      foot: [["", "", "", "", "Total:", `${totalRecords.toFixed(2)}`]],
    })

    // Add expenses table
    const expensesY = (doc as any).lastAutoTable.finalY + 10
    doc.text("Expenses", 14, expensesY)

    // @ts-ignore
    doc.autoTable({
      startY: expensesY + 5,
      head: [["date", "Description", "Value"]],
      body: filteredExpenses.map((expense) => [
        format(new Date(expense.date), "yyyy/MM/dd"),
        expense.serviceDescription,
        `R$ ${expense.amount.toFixed(2)}`,
      ]),
      foot: [["", "Total:", `${totalExpenses.toFixed(2)}`]],
    })

    // Add foreign donations table
    const foreignY = (doc as any).lastAutoTable.finalY + 10
    doc.text("Foreign Donations", 14, foreignY)

    // @ts-ignore
    doc.autoTable({
      startY: foreignY + 5,
      head: [["Date", "name", "Coin", "Method", "Description", "Value"]],
      body: filteredForeignDonations.map((donation) => [
        format(new Date(donation.date), "yyyy/MM/dd"),
        donation.name,
        donation.currency,
        donation.paymentMethod,
        donation.description.substring(0, 20) + (donation.description.length > 20 ? "..." : ""),
        `${donation.currency} ${donation.amount.toFixed(2)}`,
      ]),
      foot: [["", "", "", "", "Total:", `${totalForeign.toFixed(2)}`]],
    })

    // Add summary
    const summaryY = (doc as any).lastAutoTable.finalY + 10
    doc.text("Summary", 14, summaryY)

    // @ts-ignore
    doc.autoTable({
      startY: summaryY + 5,
      body: [
        ["Total Donations:", `${totalRecords.toFixed(2)}`],
        ["Total Expenses:", `${totalExpenses.toFixed(2)}`],
        ["Total Foreign Donations::", `${totalForeign.toFixed(2)}`],
        ["Total Balance:", `${grandTotal.toFixed(2)}`],
      ],
    })

    // Add signature fields
    const signatureY = (doc as any).lastAutoTable.finalY + 20
    doc.line(20, signatureY, 90, signatureY)
    doc.line(120, signatureY, 190, signatureY)

    doc.text("Responsible Signature", 30, signatureY + 10)
    doc.text("Responsible Signature", 140, signatureY + 10)

    // Save the PDF
    doc.save("relatorio-doacoes.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Records</h1>
          <p className="text-muted-foreground">View and export all donation and expense records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button onClick={exportToPDF} className="gap-2 border-2 rounded-md">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Records</CardTitle>
            <CardDescription>Total: {totalRecords.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No records found</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "yyyy/MM/dd")}</TableCell>
                        <TableCell>{record.serviceDescription}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{record.paymentMethod}</TableCell>
                        <TableCell className="text-right">{record.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Total: {totalExpenses.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No expenses found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(new Date(expense.date), "yyyy/MM/dd")}</TableCell>
                        <TableCell>{expense.serviceDescription}</TableCell>
                        <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foreign Donations</CardTitle>
            <CardDescription>Total: {totalForeign.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredForeignDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No foreign donations found</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForeignDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{format(new Date(donation.date), "yyyy/MM/dd")}</TableCell>
                        <TableCell>{donation.name}</TableCell>
                        <TableCell>{donation.currency}</TableCell>
                        <TableCell>{donation.paymentMethod}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{donation.description}</TableCell>
                        <TableCell className="text-right">
                          {donation.currency} {donation.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sumary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total de Donations:</span>
                <span>{totalRecords.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total de Expenses:</span>
                <span>{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total Foreign Donations:</span>
                <span>{totalForeign.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold">Total Balance:</span>
                <span className="text-lg font-bold">{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="h-0.5 w-full bg-gray-300 mb-2"></div>
                <span className="text-sm text-muted-foreground">Responsible Signature</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-0.5 w-full bg-gray-300 mb-2"></div>
                <span className="text-sm text-muted-foreground">Responsible Signature</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

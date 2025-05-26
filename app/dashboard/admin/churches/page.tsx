"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const churchSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
})

type ChurchFormValues = z.infer<typeof churchSchema>

export default function ChurchesPage() {
  const { churches, addChurch, updateChurch, deleteChurch } = useStore()
  const [isAddingChurch, setIsAddingChurch] = useState(false)
  const [isEditingChurch, setIsEditingChurch] = useState(false)
  const [editingChurchId, setEditingChurchId] = useState<string | null>(null)
  const [deletingChurchId, setDeletingChurchId] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ChurchFormValues>({
    resolver: zodResolver(churchSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  })

  const onSubmit = (data: ChurchFormValues) => {
    addChurch(data)
    toast({
      title: "Igreja adicionada",
      description: `${data.name} foi adicionada com sucesso.`,
    })
    setIsAddingChurch(false)
    reset()
  }

  const handleEdit = (id: string) => {
    const church = churches.find((c) => c.id === id)
    if (church) {
      setValue("name", church.name)
      setValue("address", church.address)
      setValue("phone", church.phone)
      setValue("email", church.email)
      setEditingChurchId(id)
      setIsEditingChurch(true)
    }
  }

  const handleUpdate = (data: ChurchFormValues) => {
    if (editingChurchId) {
      updateChurch(editingChurchId, data)
      toast({
        title: "Igreja atualizada",
        description: `${data.name} foi atualizada com sucesso.`,
      })
      setIsEditingChurch(false)
      setEditingChurchId(null)
      reset()
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingChurchId(id)
  }

  const handleDelete = () => {
    if (deletingChurchId) {
      deleteChurch(deletingChurchId)
      toast({
        title: "Igreja excluída",
        description: "Igreja foi excluída com sucesso.",
      })
      setDeletingChurchId(null)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Gerenciar Igrejas" description="Adicione, edite e remova igrejas do sistema" />

      <div className="flex justify-end">
        <Button
          onClick={() => {
            reset()
            setIsAddingChurch(true)
          }}
          className="bg-secondary hover:bg-secondary-700 text-white gap-2"
        >
          <Building className="h-4 w-4" />
          Add Church
        </Button>
      </div>

      <Card className="border-gray-600 bg-cathedral-card">
        <CardHeader className="">
          <CardTitle className="text-white">Churches</CardTitle>
          <CardDescription className="text-gray-400">List of all registered churches</CardDescription>
        </CardHeader>
        <CardContent>
          {churches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-400">No church found</p>
              <p className="text-sm text-gray-500">Click on "Add Church" to register a new church</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-600">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Address</TableHead>
                    <TableHead className="text-gray-300">Phone</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Date Created</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {churches.map((church) => (
                    <TableRow key={church.id} className="border-gray-600">
                      <TableCell className="text-white">{church.name}</TableCell>
                      <TableCell className="text-white">{church.address}</TableCell>
                      <TableCell className="text-white">{church.phone}</TableCell>
                      <TableCell className="text-white">{church.email}</TableCell>
                      <TableCell className="text-white">{format(new Date(church.createdAt), "yyyy/MM/dd")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(church.id)}
                            className="text-gray-400 hover:text-white hover:bg-primary-700/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(church.id)}
                            className="text-gray-400 hover:text-white hover:bg-primary-700/50"
                          >
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

      {/* Modal para adicionar igreja */}
      <Dialog open={isAddingChurch} onOpenChange={setIsAddingChurch}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>Add Church</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the fields below to add a new church
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name Church"
                {...register("name")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.name && <p className="text-sm text-white">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Full Address"
                {...register("address")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.address && <p className="text-sm text-white">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="(00) 0000-0000"
                {...register("phone")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.phone && <p className="text-sm text-white">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@church.com"
                {...register("email")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.email && <p className="text-sm text-white">{errors.email.message}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => setIsAddingChurch(false)}
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar igreja */}
      <Dialog open={isEditingChurch} onOpenChange={setIsEditingChurch}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>Edit Church</DialogTitle>
            <DialogDescription className="text-gray-400">Update church information below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="edit-name"
                placeholder="Name Church"
                {...register("name")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.name && <p className="text-sm text-white">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-gray-300">
                Address
              </Label>
              <Input
                id="edit-address"
                placeholder="Full address"
                {...register("address")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.address && <p className="text-sm text-white">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-gray-300">
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                placeholder="(00) 0000-0000"
                {...register("phone")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.phone && <p className="text-sm text-white">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="contato@church.com"
                {...register("email")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.email && <p className="text-sm text-white">{errors.email.message}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => setIsEditingChurch(false)}
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir igreja */}
      <AlertDialog open={!!deletingChurchId} onOpenChange={(open) => !open && setDeletingChurchId(null)}>
        <AlertDialogContent className="text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this church? This action cannot be undone and will affect all users
              associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

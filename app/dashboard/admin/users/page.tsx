"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
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
import { DashboardHeader } from "@/components/dashboard-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import type { UserRole } from "@/lib/data"

const userSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["shepherd", "tesoureiro", "admin"]),
  churchId: z.string().min(1, { message: "Igreja é obrigatória" }),
})

type UserFormValues = z.infer<typeof userSchema>

export default function UsersPage() {
  const { users, churches, addUser, updateUser, deleteUser } = useStore()
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "tesoureiro",
      churchId: "",
    },
  })

  const onSubmit = (data: UserFormValues) => {
    // Encontrar o nome da igreja
    const church = churches.find((c) => c.id === data.churchId)
    const churchName = church ? church.name : "Igreja Desconhecida"

    // Adicionar usuário com o nome da igreja
    addUser({
      ...data,
      churchName,
    })

    toast({
      title: "Usuário adicionado",
      description: `${data.name} foi adicionado com sucesso.`,
    })

    setIsAddingUser(false)
    reset()
  }

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      setValue("name", user.name)
      setValue("email", user.email)
      setValue("password", user.password) // Em produção, não faça isso
      setValue("role", user.role)
      setValue("churchId", user.churchId || "")
      setEditingUserId(id)
      setIsEditingUser(true)
    }
  }

  const handleUpdate = (data: UserFormValues) => {
    if (editingUserId) {
      // Encontrar o nome da igreja
      const church = churches.find((c) => c.id === data.churchId)
      const churchName = church ? church.name : "Igreja Desconhecida"

      // Atualizar usuário com o nome da igreja
      updateUser(editingUserId, {
        ...data,
        churchName,
      })

      toast({
        title: "Usuário atualizado",
        description: `${data.name} foi atualizado com sucesso.`,
      })

      setIsEditingUser(false)
      setEditingUserId(null)
      reset()
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingUserId(id)
  }

  const handleDelete = () => {
    if (deletingUserId) {
      deleteUser(deletingUserId)
      toast({
        title: "Usuário excluído",
        description: "Usuário foi excluído com sucesso.",
      })
      setDeletingUserId(null)
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "shepherd":
        return "Shepherd"
      case "tesoureiro":
        return "Treasurer"
      case "admin":
        return "Administrator"
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Manage Users" description="Add, edit and remove users from the system" />

      <div className="flex justify-end">
        <Button
          onClick={() => {
            reset()
            setIsAddingUser(true)
          }}
          className="bg-secondary hover:bg-secondary-700 text-white gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Users
        </Button>
      </div>

      <Card className="border-gray-600 bg-cathedral-card">
        <CardHeader className="">
          <CardTitle className="text-white">Users</CardTitle>
          <CardDescription className="text-gray-400">List of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-400">No users found</p>
              <p className="text-sm text-gray-500">Click on "Add User" to register a new user</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-600">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Function</TableHead>
                    <TableHead className="text-gray-300">Church</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-600">
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell className="text-white">{getRoleLabel(user.role)}</TableCell>
                      <TableCell className="text-white">{user.churchName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user.id)}
                            className="text-gray-400 hover:text-white hover:bg-primary-700/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(user.id)}
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

      {/* Modal para adicionar usuário */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the fields below to add a new user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Nome completo"
                {...register("name")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.name && <p className="text-sm text-white">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                {...register("email")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.email && <p className="text-sm text-white">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.password && <p className="text-sm text-white">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">
                Function
              </Label>
              <Select defaultValue="tesoureiro" onValueChange={(value) => setValue("role", value as UserRole)}>
                <SelectTrigger className="border-gray-600 bg-secondary focus:border-white text-white">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent className="bg-cathedral-card border-gray-600">
                  <SelectItem value="shepherd" className="text-white hover:bg-primary-700/50">
                    Shepherd
                  </SelectItem>
                  <SelectItem value="tesoureiro" className="text-white hover:bg-primary-700/50">
                    Treasurer
                  </SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-primary-700/50">
                    Administrator
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-white">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="churchId" className="text-gray-300">
                Church
              </Label>
              <Select defaultValue="" onValueChange={(value) => setValue("churchId", value)}>
                <SelectTrigger className="border-gray-600 bg-secondary focus:border-white text-white">
                  <SelectValue placeholder="Select a church" />
                </SelectTrigger>
                <SelectContent className="bg-cathedral-card border-gray-600">
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id} className="text-white hover:bg-primary-700/50">
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.churchId && <p className="text-sm text-white">{errors.churchId.message}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => setIsAddingUser(false)}
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para editar usuário */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">Please update user information below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-gray-300">
                Name
              </Label>
              <Input
                id="edit-name"
                placeholder="Nome completo"
                {...register("name")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.name && <p className="text-sm text-white">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@exemp.com"
                {...register("email")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.email && <p className="text-sm text-white">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-gray-300">
                Senha
              </Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="******"
                {...register("password")}
                className="border-gray-600 bg-secondary focus:border-white text-white"
              />
              {errors.password && <p className="text-sm text-white">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-gray-300">
                Function
              </Label>
              <Select defaultValue="tesoureiro" onValueChange={(value) => setValue("role", value as UserRole)}>
                <SelectTrigger className="border-gray-600 bg-secondary focus:border-white text-white">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent className="bg-cathedral-card border-gray-600">
                  <SelectItem value="shepherd" className="text-white hover:bg-primary-700/50">
                    Shepherd
                  </SelectItem>
                  <SelectItem value="tesoureiro" className="text-white hover:bg-primary-700/50">
                    Treasurer
                  </SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-primary-700/50">
                    Administrator
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-white">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-churchId" className="text-gray-300">
                Church
              </Label>
              <Select defaultValue="" onValueChange={(value) => setValue("churchId", value)}>
                <SelectTrigger className="border-gray-600 bg-secondary focus:border-gray text-white">
                  <SelectValue placeholder="Select Church" />
                </SelectTrigger>
                <SelectContent className="bg-cathedral-card border-gray-600">
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id} className="text-white hover:bg-primary-700/50">
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.churchId && <p className="text-sm text-white">{errors.churchId.message}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="default"
                onClick={() => setIsEditingUser(false)}
                className="border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir usuário */}
      <AlertDialog open={!!deletingUserId} onOpenChange={(open) => !open && setDeletingUserId(null)}>
        <AlertDialogContent className="text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

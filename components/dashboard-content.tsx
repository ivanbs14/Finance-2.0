"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import api from "@/services/apiService"
import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import { Church } from "@/lib/data"

interface DashboardContentProps {
  
}

const ChurchModel: Church = {
  id: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  createdAt: "",
}

export function DashboardContent({ }: DashboardContentProps) {
  const { user } = useAuth()
  const token = Cookies.get('token');
  const { records, expenses, foreignDonations } = useStore()
  const [church, setChurch] = useState<Church>(ChurchModel);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const resp = await api.get(`/church/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User data:", resp.data);
        setChurch(resp.data);
/*         const [recordsData, expensesData, foreignData] = await Promise.all([
          api.get(`/records?churchId=${user.churchId}`),
          api.get(`/expenses?churchId=${user.churchId}`),
          api.get(`/foreign-donations?churchId=${user.churchId}`)
        ]);

        records.setRecords(recordsData.data);
        expenses.setExpenses(expensesData.data);
        foreignDonations.setForeignDonations(foreignData.data); */
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [user]);


  const totalRecords = records.reduce((sum, record) => sum + record.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalForeign = foreignDonations.reduce((sum, foreign) => sum + foreign.amount, 0)
  const balance = totalRecords - totalExpenses + totalForeign

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Donations</CardTitle>
            <div className="h-4 w-4 rounded-full bg-secondary text-white flex items-center justify-center">
              <span className="text-xs">$</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalRecords.toFixed(2)}</div>
            <p className="text-xs text-gray-400">{records.length} records</p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Expenses</CardTitle>
            <div className="h-4 w-4 rounded-full bg-secondary text-white flex items-center justify-center">
              <span className="text-xs">-</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-gray-400">{expenses.length} records</p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Donations Foreigners</CardTitle>
            <div className="h-4 w-4 rounded-full bg-secondary text-white flex items-center justify-center">
              <span className="text-xs">€</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalForeign.toFixed(2)}</div>
            <p className="text-xs text-gray-400">{foreignDonations.length} records</p>
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Balance</CardTitle>
            <div className="h-4 w-4 rounded-full bg-secondary text-white flex items-center justify-center">
              <span className="text-xs">=</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{balance.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Balance current</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="">
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Latest transactions recorded in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 && expenses.length === 0 && foreignDonations.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No transactions recorded yet</p>
            ) : (
              <div className="space-y-4">
                {/* Mostrar as últimas transações aqui */}
                <p className="text-center text-gray-400">Use forms to add transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-600 bg-cathedral-card">
          <CardHeader className="">
            <CardTitle className="text-white">Church Information</CardTitle>
            <CardDescription className="text-gray-400">Church details and contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="font-medium">Name: </span> 
                <span>{church.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address: </span>
                <span>{church.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone Number: </span>
                <span>{church.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email: </span>
                <span>{church.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

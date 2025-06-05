"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTransactions } from "@/hooks/use-transactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionTable } from "./transaction-table"
import { TransactionForm } from "./transaction-form"
import type { TransactionFilter } from "@/types"
import { LogOut, Plus } from "lucide-react"
import { formatToRupiah } from "@/lib/utils"

export function Dashboard() {
  const { user, logout } = useAuth()
  const { getTodayTotal } = useTransactions()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<TransactionFilter>({})
  const [todayTotal, setTodayTotal] = useState<number>(0)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    getTodayTotal().then((total) => {
      if (total !== undefined) setTodayTotal(total)
    })
  }, [])

  const refreshTotal = () => {
    getTodayTotal().then((total) => {
      if (total !== undefined) setTodayTotal(total)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Transaksi</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role})
              </p>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Transaksi Hari Ini</CardTitle>
              <CardDescription>Total nilai transaksi untuk hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatToRupiah(todayTotal)}</div>
            </CardContent>
          </Card>
        </div>

        {user?.role === "super_admin" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Kelola Transaksi</h2>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Transaksi
              </Button>
            </div>

            {showForm &&
              <TransactionForm
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                  setShowForm(false)
                  refreshTotal()
                }}
              />
            }

            <TransactionTable filter={filter} onFilterChange={setFilter}  />
          </div>
        )}

        {user?.role === "guest" && (
          <Card>
            <CardHeader>
              <CardTitle>Akses Terbatas</CardTitle>
              <CardDescription>
                Sebagai guest, Anda hanya dapat melihat total transaksi hari ini. Hubungi administrator untuk akses
                lebih lanjut.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  )
}

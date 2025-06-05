"use client"

import { useEffect, useState } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import type { TransactionFilter, Transaction } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Trash2, Search } from "lucide-react"
import { TransactionForm } from "./transaction-form"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { formatToRupiah } from "@/lib/utils"

interface TransactionTableProps {
  filter: TransactionFilter
  onFilterChange: (filter: TransactionFilter) => void
}

export function TransactionTable({ filter, onFilterChange }: TransactionTableProps) {
  const { filterTransactions, deleteTransaction, isLoading } = useTransactions()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(filterTransactions(filter))
  const transactions = useSelector((state: RootState) => state.transactions.list)

  useEffect(() => {
    if (transactions && transactions.length >= 1) {
      setFilteredTransactions(transactions)
    }
  }, [transactions])

  useEffect(() => {
    const filteredData = filterTransactions(filter)
    setFilteredTransactions(filteredData);
  }, [filter])

  const handleDelete = async () => {
    if (deletingTransaction) {
      await deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-filter">Tanggal</Label>
              <Input
                id="date-filter"
                type="date"
                value={filter.date || ""}
                onChange={(e) => onFilterChange({ ...filter, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-filter">Nama Transaksi</Label>
              <Input
                id="name-filter"
                placeholder="Cari nama transaksi..."
                value={filter.name || ""}
                onChange={(e) => onFilterChange({ ...filter, name: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onFilterChange({})}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.name}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatToRupiah(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingTransaction(transaction)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeletingTransaction(transaction)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">Tidak ada transaksi yang ditemukan</div>
          )}
        </CardContent>
      </Card>

      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => setEditingTransaction(null)}
        />
      )}

      <Dialog open={!!deletingTransaction} onOpenChange={() => setDeletingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus transaksi &quot;{deletingTransaction?.name}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTransaction(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

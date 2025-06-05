"use client"

import type React from "react"

import { useState } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import type { Transaction } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatIDRInput } from "@/lib/utils"

interface TransactionFormProps {
  transaction?: Transaction
  onClose: () => void
  onSuccess: () => void
}

export function TransactionForm({ transaction, onClose, onSuccess }: TransactionFormProps) {
  const { createTransaction, updateTransaction, isLoading } = useTransactions()
  const [formData, setFormData] = useState({
    name: transaction?.name || "",
    amount: transaction?.amount || 0,
    date: transaction?.date || new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
  })
  const [amountDisplay, setAmountDisplay] = useState("0")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (transaction) {
        await updateTransaction(transaction.id, formData)
      } else {
        await createTransaction(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const { raw, display } = formatIDRInput(input)
  
    setFormData({ ...formData, amount: raw })
    setAmountDisplay(display)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Edit informasi transaksi di bawah ini." : "Masukkan informasi transaksi baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Transaksi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountDisplay}
                onChange={handleAmountChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

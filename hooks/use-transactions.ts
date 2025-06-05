"use client"

import { useEffect, useState } from "react"
import type { Transaction, TransactionFilter } from "@/types"
import { useDispatch } from "react-redux"
import { addTransactionRdx, deleteTransactionRdx, setTransactionsRdx, updateTransactionRdx } from "@/features/transactionSlice"
import { useAuth } from "@/contexts/auth-context"


const API_BASE_URL = 'http://localhost:8000/api'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem("token")
  const { user } = useAuth()

  const dispatch = useDispatch()

  useEffect(() => {
    if (token && user?.role === "super_admin") {
      getTransactions(undefined, token).catch(error => {
        console.error(error.message)
      })
    }
  }, [token])

  const getTodayTotal = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/today-total`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
  
      if (!response.ok) {
        throw new Error('Get today total failed')
      }
  
      const data = await response.json()
      return data.total
    } catch (error) {
      console.error(error)
    }
  }

  const getTransactions = async (filter?: TransactionFilter, token?: string) => {
    setIsLoading(true)
  
    const queryParams = new URLSearchParams()
    if (filter?.date) queryParams.append('date', filter.date)
    if (filter?.name) queryParams.append('name', filter.name)
  
    const queryString = queryParams.toString()
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const response = await fetch(`${API_BASE_URL}/transactions?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
  
      if (!response.ok) {
        throw new Error('Get transaction failed')
      }
  
      const data = await response.json()
      setTransactions(data.data)
      dispatch(setTransactionsRdx(data.data))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTransactions = (filter: TransactionFilter) => {
    return transactions.filter((transaction) => {
      if (filter.date && transaction.date !== filter.date) {
        return false
      }
      if (filter.name && !transaction.name.toLowerCase().includes(filter.name.toLowerCase())) {
        return false
      }
      return true
    })
  }

  const createTransaction = async (form: Omit<Transaction, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true)
    const newTransaction: Transaction = {
      ...form,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Create transaction failed')
      }

      setTransactions((prev) => [newTransaction, ...prev])
      dispatch(addTransactionRdx(newTransaction))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTransaction = async (id: string, form: Partial<Transaction>) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Update transaction failed')
      }

      const data = await response.json()

      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...form, updated_at: new Date().toISOString() } : t)))
      dispatch(updateTransactionRdx(data))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error('Delete transaction failed')
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id))
      dispatch(deleteTransactionRdx(id))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    transactions,
    isLoading,
    getTodayTotal,
    filterTransactions,
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}

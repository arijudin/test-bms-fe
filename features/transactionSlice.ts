// store/features/transactionSlice.ts
import { Transaction } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TransactionState {
  list: Transaction[]
}

const initialState: TransactionState = {
  list: [],
}

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionsRdx: (state, action: PayloadAction<Transaction[]>) => {
      state.list = action.payload
    },
    addTransactionRdx: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload)
    },
    updateTransactionRdx: (state, action: PayloadAction<Transaction>) => {
      const updatedTransaction = state.list.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload, updated_at: new Date().toISOString() } : t))
      state.list = updatedTransaction
    },
    deleteTransactionRdx: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.list = state.list.filter(transaction => transaction.id !== action.payload)
    },
  },
})

export const { setTransactionsRdx, addTransactionRdx, updateTransactionRdx, deleteTransactionRdx } = transactionSlice.actions
export default transactionSlice.reducer

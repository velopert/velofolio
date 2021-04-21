import client from '../client'

export async function deleteBacktest(id: number) {
  await client.delete(`/api/backtests/${id}`)
  return true
}

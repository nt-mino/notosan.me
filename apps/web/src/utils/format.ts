/**
 * 日付文字列をJST基準のドット区切りに変換
 * @example '2024-01-14T15:00:00.000Z' → '2024.01.15' (JST)
 * @example '2024-01-15' → '2024.01.15'
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const y = jst.getUTCFullYear()
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0')
  const d = String(jst.getUTCDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

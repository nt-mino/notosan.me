/**
 * 日付文字列をドット区切りに変換
 * @example '2024-01-15' → '2024.01.15'
 */
export const formatDate = (dateString: string) => dateString.replace(/-/g, '.')

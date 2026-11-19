import * as v from 'valibot'

export const contactSchema = v.object({
  lastName: v.pipe(
    v.string(),
    v.nonEmpty('姓を入力してください'),
    v.maxLength(50, '姓は50文字以内で入力してください'),
  ),
  firstName: v.pipe(
    v.string(),
    v.nonEmpty('名を入力してください'),
    v.maxLength(50, '名は50文字以内で入力してください'),
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty('メールアドレスを入力してください'),
    v.email('メールアドレスの形式が正しくありません'),
  ),
  company: v.pipe(
    v.string(),
    v.nonEmpty('会社名を入力してください'),
    v.maxLength(100, '会社名は100文字以内で入力してください'),
  ),
  category: v.pipe(
    v.string(),
    v.nonEmpty('種別を選択してください'),
    v.picklist(
      ['product', 'support', 'advisor', 'speaking', 'interview', 'other'],
      '種別を選択してください',
    ),
  ),
  message: v.pipe(
    v.string(),
    v.nonEmpty('お問い合わせ内容を入力してください'),
    v.maxLength(5000, 'お問い合わせ内容は5000文字以内で入力してください'),
  ),
})

export type ContactInput = v.InferInput<typeof contactSchema>

export const categoryLabels: Record<string, string> = {
  product: '新規・既存プロダクト開発の相談',
  support: '技術支援',
  advisor: '技術顧問・アドバイザリー',
  speaking: '講演・登壇依頼',
  interview: '取材・インタビュー',
  other: 'その他',
}

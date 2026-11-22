import * as v from 'valibot'

export const appLabels: Record<string, string> = {
  agentidraw: 'Agentidraw',
  penmark: 'Penmark',
  calmux: 'calmux',
}

export const appRequestSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('お名前を入力してください'),
    v.maxLength(100, 'お名前は100文字以内で入力してください'),
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty('メールアドレスを入力してください'),
    v.email('メールアドレスの形式が正しくありません'),
  ),
  app: v.picklist(Object.keys(appLabels), 'アプリを選んでください'),
})

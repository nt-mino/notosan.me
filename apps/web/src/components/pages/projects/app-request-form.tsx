import { api } from '@/lib/rpc'
import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  app: string
}

export default function AppRequestForm({ app }: Props) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      app,
    }

    try {
      const response = await api['app-request'].$post({ json: data })
      // エラーページなど JSON でない応答は、共通の文言で知らせる
      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.success) {
        throw new Error(
          result && 'error' in result ? result.error : '送信に失敗しました',
        )
      }

      setFormState('success')
      form.reset()
    } catch (error) {
      setFormState('error')
      setErrorMessage(
        error instanceof Error ? error.message : '送信に失敗しました',
      )
    }
  }

  const isSubmitting = formState === 'submitting'

  if (formState === 'success') {
    return (
      <p data-done role="status">
        申し込みを受け付けました。アカウントを発行して、ログイン用のリンクをメールでお送りします。
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="r-name">お名前</label>
        <input
          id="r-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="r-mail">登録用のメールアドレス</label>
        <input
          id="r-mail"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          disabled={isSubmitting}
        />
      </div>
      <button className="send" type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中…' : '申し込む'}
      </button>
      {formState === 'error' && (
        <p data-error role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

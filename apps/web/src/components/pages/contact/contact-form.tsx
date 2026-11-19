import { useState } from 'react'
import { api } from '@/lib/rpc'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Category {
  value: string
  label: string
}

interface Props {
  categories: Category[]
}

export default function ContactForm({ categories }: Props) {
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
      company: String(formData.get('company') ?? ''),
      category: String(formData.get('category') ?? ''),
      message: String(formData.get('message') ?? ''),
    }

    try {
      const response = await api.contact.$post({ json: data })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error('error' in result ? result.error : '送信に失敗しました')
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

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="f-name">お名前</label>
        <input
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="f-mail">メールアドレス</label>
        <input
          id="f-mail"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="f-org">会社名</label>
        <input
          id="f-org"
          name="company"
          type="text"
          autoComplete="organization"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="f-type">種別</label>
        <select id="f-type" name="category" required disabled={isSubmitting}>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-body">内容</label>
        <textarea id="f-body" name="message" required disabled={isSubmitting} />
      </div>
      <button className="send" type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中…' : '送信する'}
      </button>
      {formState === 'success' && (
        <p data-done role="status">
          送信しました。内容を確認して、2〜3 営業日以内にお返事します。
        </p>
      )}
      {formState === 'error' && (
        <p data-error role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

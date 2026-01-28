import { useState } from 'react'
import { api } from '@/lib/rpc'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      lastName: formData.get('last_name') as string,
      firstName: formData.get('first_name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      category: formData.get('category') as string,
      message: formData.get('message') as string,
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

  if (formState === 'success') {
    return (
      <div className="relative bg-white border border-noto-border rounded-xl p-8 md:p-12 text-center overflow-hidden">
        {/* 背景のアクセント */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-noto-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* コンテンツ */}
        <div className="relative">
          {/* アイコン - メール */}
          <div className="mb-6 inline-flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center animate-[fadeUp_0.6s_ease-out]"
            >
              <svg
                className="w-9 h-9 text-emerald-600 animate-[fadeUp_0.5s_ease-out_0.2s_both]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
          </div>

          {/* テキスト */}
          <h3
            className="font-serif text-2xl md:text-[1.75rem] font-medium mb-4 text-noto-text animate-[fadeUp_0.5s_ease-out_0.2s_both]"
          >
            お問い合わせありがとうございます
          </h3>
          <p className="text-[0.9375rem] text-noto-text-muted leading-relaxed mb-8 max-w-sm mx-auto animate-[fadeUp_0.5s_ease-out_0.35s_both]">
            内容を確認のうえ、<span className="font-medium text-noto-text">2〜3営業日以内</span>にご返信いたします。
            <br />
            しばらくお待ちください。
          </p>

          {/* 区切り線 */}
          <div className="flex items-center gap-4 mb-8 animate-[fadeUp_0.5s_ease-out_0.45s_both]">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-noto-border to-transparent" />
          </div>

          {/* ボタン */}
          <div className="animate-[fadeUp_0.5s_ease-out_0.5s_both]">
            <button
              type="button"
              onClick={() => setFormState('idle')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm text-noto-text-muted border border-noto-border rounded-lg transition-all duration-200 hover:text-noto-accent hover:border-noto-accent hover:bg-noto-accent/5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              新しいお問い合わせ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-noto-border rounded-xl p-6 md:p-10"
    >
      {formState === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* お名前 */}
      <div className="mb-6">
        <span className="block text-[0.8125rem] font-medium mb-2 text-noto-text">
          お名前<span className="text-red-500 ml-1 text-xs">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="last_name"
            placeholder="姓"
            required
            disabled={formState === 'submitting'}
            className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text placeholder:text-noto-text-muted transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
          />
          <input
            type="text"
            name="first_name"
            placeholder="名"
            required
            disabled={formState === 'submitting'}
            className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text placeholder:text-noto-text-muted transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
          />
        </div>
      </div>

      {/* メールアドレス */}
      <div className="mb-6">
        <label
          className="block text-[0.8125rem] font-medium mb-2 text-noto-text"
          htmlFor="email"
        >
          メールアドレス<span className="text-red-500 ml-1 text-xs">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          required
          disabled={formState === 'submitting'}
          className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text placeholder:text-noto-text-muted transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
        />
      </div>

      {/* 会社名 */}
      <div className="mb-6">
        <label
          className="block text-[0.8125rem] font-medium mb-2 text-noto-text"
          htmlFor="company"
        >
          会社名<span className="text-red-500 ml-1 text-xs">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          placeholder="株式会社〇〇"
          required
          disabled={formState === 'submitting'}
          className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text placeholder:text-noto-text-muted transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
        />
      </div>

      {/* 種別 */}
      <div className="mb-6">
        <label
          className="block text-[0.8125rem] font-medium mb-2 text-noto-text"
          htmlFor="category"
        >
          種別<span className="text-red-500 ml-1 text-xs">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            required
            disabled={formState === 'submitting'}
            defaultValue=""
            className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text appearance-none cursor-pointer pr-10 transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
          >
            <option value="" disabled>
              選択してください
            </option>
            <option value="product">新規・既存プロダクト開発の相談</option>
            <option value="support">技術支援</option>
            <option value="advisor">技術顧問・アドバイザリー</option>
            <option value="speaking">講演・登壇依頼</option>
            <option value="interview">取材・インタビュー</option>
            <option value="other">その他</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="M6 8L1 3h10z" fill="#737373" />
            </svg>
          </div>
        </div>
      </div>

      {/* お問い合わせ内容 */}
      <div className="mb-8">
        <label
          className="block text-[0.8125rem] font-medium mb-2 text-noto-text"
          htmlFor="message"
        >
          お問い合わせ内容<span className="text-red-500 ml-1 text-xs">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="ご依頼内容やご相談内容をご記入ください"
          required
          disabled={formState === 'submitting'}
          className="w-full px-4 py-3.5 text-[0.9375rem] border border-noto-border rounded-md bg-noto-bg text-noto-text placeholder:text-noto-text-muted min-h-[180px] resize-y leading-relaxed transition-all duration-200 focus:outline-none focus:border-noto-accent focus:ring-[3px] focus:ring-noto-accent/10 disabled:opacity-50"
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-[0.9375rem] font-medium text-white bg-noto-accent rounded-md transition-all duration-200 hover:bg-[#2e4660] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState === 'submitting' ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            送信中...
          </>
        ) : (
          '送信する'
        )}
      </button>

      {/* 注意書き */}
      <p className="mt-6 pt-6 border-t border-noto-border text-xs text-noto-text-muted leading-relaxed">
        ※
        内容によってはご返信できない場合がございます。あらかじめご了承ください。
        <br />※ 個人情報は本お問い合わせへの対応以外には使用いたしません。
      </p>
    </form>
  )
}

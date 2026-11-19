import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

const skills = [
  {
    label: 'Frontend',
    values: 'TypeScript / React / Next.js / Astro / Remix / Tanstack',
  },
  {
    label: 'Backend',
    values: 'Node.js / Express / Nest.js / Hono / Elysia / Python',
  },
  {
    label: 'Infrastructure',
    values: 'Vercel / GCP / Supabase / Firebase / Cloudflare',
  },
  {
    label: 'Tools',
    values: 'Cursor / Claude Code / Linear / Notion / Figma / microCMS',
  },
]

export function SkillsTerminal() {
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [visibleLines, setVisibleLines] = useState<number[]>([])

  const onRun = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setIsComplete(false)
    setVisibleLines([])

    skills.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i])
      }, i * 200)
    })

    setTimeout(
      () => {
        setIsComplete(true)
        setIsRunning(false)
      },
      skills.length * 200 + 300,
    )
  }, [isRunning])

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-[#3a3a3a]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27ca40]" />
        <span className="ml-2 text-xs text-[#888] font-mono">skills.sh</span>
        <button
          type="button"
          onClick={onRun}
          className={cn(
            'ml-auto px-3.5 py-1.5 rounded text-[0.6875rem] font-medium text-white transition-all duration-200 hover:-translate-y-px',
            isRunning ? 'bg-[#e67e22]' : 'bg-noto-accent hover:bg-[#4a6a94]',
          )}
        >
          {isComplete ? '✓ Done' : isRunning ? '⏳ Loading...' : '▶ Run'}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5">
        {!isRunning && visibleLines.length === 0 && (
          <div className="flex items-start">
            <span className="font-mono text-xs sm:text-sm text-[#6b7280] whitespace-nowrap">
              &gt; Runボタンをクリックしてスキルを表示する
              <span className="ml-0.5 text-[#5a9] animate-[blink_1s_step-end_infinite]">
                |
              </span>
            </span>
          </div>
        )}

        {visibleLines.length > 0 && (
          <div className="space-y-0">
            {skills.map((skill, i) => (
              <div
                key={skill.label}
                className={cn(
                  'font-mono text-[0.8125rem] leading-[1.8] transition-all duration-300',
                  visibleLines.includes(i)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1',
                )}
              >
                <span className="text-[#5a9]">{skill.label}:</span>
                <span className="text-[#9ca3af] ml-2">{skill.values}</span>
              </div>
            ))}

            {isComplete && (
              <div className="mt-4 pt-3 border-t border-[#3a3a3a] text-[#5a9] text-xs font-mono animate-[fadeUp_0.3s_ease]">
                Thank you!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

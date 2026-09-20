import type { Traits } from '../../shared/suspects.ts'

const HAIR: Record<Traits['hairColor'], string> = {
  black: '#1c1c22', blonde: '#e6c56a', red: '#c0532b', grey: '#b9bcc4', brown: '#6a4226', blue: '#2f7df0',
}
const COAT: Record<Traits['coat'], string> = {
  red: '#c8352f', green: '#3f7d4a', navy: '#1f2f5e', yellow: '#d8b23a', purple: '#6a3d8f', brown: '#7a5233',
  black: '#1a1a1e', white: '#ecebe6', orange: '#e57f2a', teal: '#1f8c86', pink: '#e08aa8', grey: '#6f737c',
}
const SKIN: Record<Traits['skin'], string> = {
  light: '#f1d3b7', tan: '#d7a877', brown: '#a86b3f', dark: '#5d3b22',
}

interface Props {
  traits: Traits
  size?: number
  className?: string
}

/** A lineup portrait composed from trait layers. viewBox 100 x 120. */
export function Avatar({ traits: t, size = 96, className }: Props) {
  const hair = HAIR[t.hairColor]
  const coat = COAT[t.coat]
  const skin = SKIN[t.skin]
  const ink = '#15161a'

  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} className={className} aria-hidden="true">
      {/* hair behind head */}
      {t.hair === 'long' && <path d="M22 50 Q20 100 30 108 L70 108 Q80 100 78 50 Z" fill={hair} />}
      {t.hair === 'bun' && <circle cx="50" cy="22" r="10" fill={hair} />}
      {t.hair === 'curly' && (
        <g fill={hair}>
          {[22, 31, 40, 49, 58, 67, 76].map((x, i) => <circle key={x} cx={x + 1} cy={30 - (i % 2) * 5 - (i === 3 ? 3 : 0)} r="9" />)}
          <circle cx="24" cy="46" r="7" />
          <circle cx="76" cy="46" r="7" />
        </g>
      )}

      {/* coat / shoulders */}
      <path d="M8 120 Q10 88 34 84 L50 92 L66 84 Q90 88 92 120 Z" fill={coat} />
      {t.coat === 'white' && <path d="M8 120 Q10 88 34 84 L50 92 L66 84 Q90 88 92 120 Z" fill="none" stroke="#c9c8c2" strokeWidth="1.5" />}
      {/* shirt V */}
      <path d="M40 86 L50 100 L60 86 Z" fill="#f4f3ee" />

      {/* accessories at chest */}
      {t.accessory === 'tie' && <path d="M50 92 L46 96 L48 112 L50 116 L52 112 L54 96 Z" fill="#b3312f" />}
      {t.accessory === 'bowtie' && <path d="M50 92 L40 87 L40 98 Z M50 92 L60 87 L60 98 Z" fill="#b3312f" />}
      {t.accessory === 'scarf' && (
        <g fill="#b9463c">
          <path d="M28 84 Q50 98 72 84 L72 92 Q50 106 28 92 Z" />
          <rect x="56" y="90" width="10" height="24" rx="3" />
        </g>
      )}
      {t.accessory === 'necklace' && (
        <g fill="none" stroke="#e5c15c" strokeWidth="1.5">
          <path d="M40 88 Q50 100 60 88" />
          <circle cx="50" cy="100" r="3" fill="#e5c15c" />
        </g>
      )}
      {t.accessory === 'flower' && (
        <g>
          <circle cx="68" cy="96" r="5" fill="#e4577a" />
          <circle cx="68" cy="96" r="2" fill="#f5d55a" />
        </g>
      )}

      {/* neck + head */}
      <rect x="43" y="72" width="14" height="16" fill={skin} />
      <ellipse cx="50" cy="52" rx="24" ry="28" fill={skin} />
      <circle cx="26" cy="54" r="4" fill={skin} />
      <circle cx="74" cy="54" r="4" fill={skin} />
      {t.accessory === 'earring' && <circle cx="74" cy="60" r="2.5" fill="none" stroke="#e5c15c" strokeWidth="1.5" />}

      {/* hair in front */}
      {t.hair === 'short' && <path d="M26 46 Q26 22 50 22 Q74 22 74 46 Q66 36 50 36 Q34 36 26 46 Z" fill={hair} />}
      {t.hair === 'long' && <path d="M26 50 Q24 20 50 20 Q76 20 74 50 Q68 34 50 34 Q32 34 26 50 Z" fill={hair} />}
      {t.hair === 'bun' && <path d="M26 46 Q26 24 50 24 Q74 24 74 46 Q66 38 50 38 Q34 38 26 46 Z" fill={hair} />}
      {t.hair === 'curly' && <path d="M27 44 Q30 26 50 26 Q70 26 73 44 Q66 36 50 36 Q34 36 27 44 Z" fill={hair} />}
      {t.hair === 'mohawk' && <path d="M42 30 L46 6 L50 22 L54 6 L58 30 Q50 26 42 30 Z" fill={hair} />}
      {t.hair === 'bald' && <ellipse cx="42" cy="30" rx="5" ry="2.5" fill="#fff" opacity="0.25" />}

      {/* eyes */}
      <circle cx="41" cy="52" r="2.2" fill={ink} />
      <circle cx="59" cy="52" r="2.2" fill={ink} />
      {/* nose */}
      <path d="M50 54 L47 62 L53 62" fill="none" stroke={ink} strokeWidth="1.2" opacity="0.6" />

      {/* facial hair */}
      {t.facialHair === 'moustache' && <path d="M40 65 Q50 60 60 65 Q50 68 40 65 Z" fill={hair} />}
      {t.facialHair === 'goatee' && <path d="M44 70 Q50 82 56 70 Q50 74 44 70 Z" fill={hair} />}
      {t.facialHair === 'beard' && <path d="M27 56 Q30 84 50 84 Q70 84 73 56 Q66 74 50 74 Q34 74 27 56 Z" fill={hair} />}
      {/* mouth */}
      <path d="M44 69 Q50 72 56 69" fill="none" stroke={ink} strokeWidth="1.4" />
      {t.accessory === 'pipe' && (
        <g>
          <path d="M56 70 L72 78" stroke="#5a3a22" strokeWidth="2.5" />
          <rect x="70" y="72" width="8" height="8" rx="2" fill="#5a3a22" />
        </g>
      )}

      {/* glasses */}
      {t.glasses === 'round' && (
        <g fill="none" stroke={ink} strokeWidth="1.6">
          <circle cx="41" cy="52" r="7" />
          <circle cx="59" cy="52" r="7" />
          <path d="M48 52 L52 52" />
        </g>
      )}
      {t.glasses === 'square' && (
        <g fill="none" stroke={ink} strokeWidth="2.2">
          <rect x="33" y="46" width="15" height="12" rx="1.5" />
          <rect x="52" y="46" width="15" height="12" rx="1.5" />
          <path d="M48 52 L52 52" />
        </g>
      )}
      {t.glasses === 'sunglasses' && (
        <g fill={ink}>
          <path d="M32 46 h17 v6 q0 7 -8.5 7 q-8.5 0 -8.5 -7 Z" />
          <path d="M51 46 h17 v6 q0 7 -8.5 7 q-8.5 0 -8.5 -7 Z" />
          <rect x="48" y="47" width="4" height="2" />
        </g>
      )}
      {t.glasses === 'monocle' && (
        <g fill="none" stroke="#c9a24a" strokeWidth="1.8">
          <circle cx="59" cy="52" r="7.5" />
          <path d="M64 58 Q70 70 66 84" strokeWidth="1" />
        </g>
      )}

      {/* headphones */}
      {t.accessory === 'headphones' && (
        <g>
          <path d="M24 52 Q24 18 50 18 Q76 18 76 52" fill="none" stroke="#2a2a30" strokeWidth="3.5" />
          <rect x="19" y="46" width="9" height="16" rx="3" fill="#2a2a30" />
          <rect x="72" y="46" width="9" height="16" rx="3" fill="#2a2a30" />
        </g>
      )}

      {/* hats */}
      {t.hat === 'fedora' && (
        <g fill="#4b3a2e">
          <path d="M28 36 Q30 14 50 14 Q70 14 72 36 Z" />
          <rect x="18" y="34" width="64" height="6" rx="3" />
          <rect x="30" y="30" width="40" height="4" fill="#2a2119" />
        </g>
      )}
      {t.hat === 'beanie' && (
        <g fill="#6d4aa8">
          <path d="M26 40 Q26 14 50 14 Q74 14 74 40 Z" />
          <rect x="24" y="36" width="52" height="8" rx="3" fill="#8a67c9" />
          <circle cx="50" cy="13" r="4" fill="#8a67c9" />
        </g>
      )}
      {t.hat === 'cap' && (
        <g fill="#2f6fd1">
          <path d="M26 38 Q26 16 50 16 Q74 16 74 38 Z" />
          <path d="M20 40 Q50 44 76 40 L78 44 Q50 50 18 44 Z" fill="#245aab" />
        </g>
      )}
      {t.hat === 'beret' && (
        <g fill="#8c2f39">
          <path d="M22 34 Q26 12 60 14 Q80 18 76 32 Q50 40 22 34 Z" />
          <rect x="56" y="12" width="4" height="4" rx="1" />
        </g>
      )}
      {t.hat === 'tophat' && (
        <g fill="#141418">
          <rect x="30" y="0" width="40" height="34" rx="2" />
          <rect x="20" y="32" width="60" height="6" rx="3" />
          <rect x="30" y="26" width="40" height="4" fill="#5a4a2a" />
        </g>
      )}
    </svg>
  )
}

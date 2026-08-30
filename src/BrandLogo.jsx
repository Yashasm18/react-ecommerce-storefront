import React from 'react';

/**
 * WordsOfVamshi Signature Brand Logo
 * 
 * Crafted to match the reference calligraphy signature style:
 * - Fluid handwritten cursive script
 * - Artistic feather quill pen integrated at the tail
 * - Flowing ink swoosh underline flourish
 */
export default function BrandLogo({
  variant = 'navbar', // 'navbar' | 'footer' | 'signature' | 'hero' | 'profile'
  withSwash = true,   // show signature flourish underline
  withQuill = true,   // show feather quill pen
  text = 'Words of Vamshi',
  onClick,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`brand-signature-logo brand-${variant} ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="brand-logo-main-row">
        {/* Calligraphy Signature Script */}
        <span className="brand-signature-text">
          <span className="brand-word-words">Words</span>
          <span className="brand-word-of">of</span>
          <span className="brand-word-vamshi">
            Vamshi
            <span className="brand-heart-accent" aria-hidden="true">♥</span>
          </span>
        </span>

        {/* Feather Quill Pen Icon (matches reference photo silhouette) */}
        {withQuill && (
          <span className="brand-quill-container" aria-hidden="true">
            <svg
              className="brand-quill-feather"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer feather vanes with organic slits */}
              <path
                d="M52 4C44 14 32 23 23 30C22 27.5 18 25.5 15 25.5C22.5 19 35.5 10 52 4Z"
                fill="currentColor"
              />
              <path
                d="M48 8C39 19 25 32 16 41C15 39 12 37.8 9.5 38.5C15.5 30.5 28.5 18.5 48 8Z"
                fill="currentColor"
              />
              <path
                d="M37 20C28 31 18 43 10.5 50C9.6 48.6 7.8 47.7 5.5 48C11 40 22.5 28.5 37 20Z"
                fill="currentColor"
              />
              {/* Central Quill Stem / Spine */}
              <path
                d="M53 3C40 17 26 35 9 52L5 57C6.2 55.8 7.6 54.4 9.5 53.5C12.5 51.8 26.5 34 53 3Z"
                fill="var(--accent, #F5A623)"
              />
              {/* Quill Nib */}
              <path
                d="M5 57L2.5 60L7 58.5L5 57Z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Signature Flourish Underline Swoosh */}
      {withSwash && (
        <div className="brand-swash-row" aria-hidden="true">
          <svg
            viewBox="0 0 240 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="brand-swash-svg"
          >
            {/* Main flowing underline that sweeps under the name */}
            <path
              d="M10 16C55 24 120 25 185 18C208 15.5 224 11 232 13C223 15.5 198 20.5 168 22.5C108 26.5 55 24 10 16Z"
              fill="currentColor"
            />
            {/* Elegant flourish tail curve at the end (mimicking author signature stroke) */}
            <path
              d="M228 12.5C232 13.8 236 15.2 235 17C233 19 227 18.5 222 17.2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

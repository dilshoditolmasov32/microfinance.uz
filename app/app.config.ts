const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'ink',
      error: 'brand',
    },

    button: {
      slots: {
        base: 'group/button rounded-lg font-bold justify-center whitespace-nowrap transition-[color,background-color,border-color,box-shadow,scale] duration-200 ease-smooth active:not-disabled:scale-[0.98]',
        trailingIcon: 'transition-transform duration-200 ease-smooth group-hover/button:translate-x-0.5',
      },
      variants: {
        size: {
          md: { base: 'h-10 px-4 text-sm gap-2', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
          lg: { base: 'h-11 px-5 text-[0.9375rem] gap-2', leadingIcon: 'size-5', trailingIcon: 'size-5' },
          xl: { base: 'h-13 px-6 text-base gap-2.5', leadingIcon: 'size-5', trailingIcon: 'size-5' },
        },
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: `shadow-sm hover:bg-brand-700 active:bg-brand-800 ${focusRing}` },
        { color: 'neutral', variant: 'outline', class: `bg-white ring-ink-200 hover:bg-ink-50 hover:ring-ink-300 ${focusRing}` },
        { color: 'neutral', variant: 'solid', class: focusRing },
        { size: 'md', square: true, class: 'w-10' },
        { size: 'lg', square: true, class: 'w-11' },
        { size: 'xl', square: true, class: 'w-13' },
      ],
    },

    badge: {
      slots: { base: 'rounded-full font-bold' },
      compoundVariants: [
        { color: 'primary', variant: 'subtle', class: 'text-brand-700' },
      ],
    },

    slider: {
      slots: {
        root: 'cursor-pointer',
        thumb: 'cursor-grab active:cursor-grabbing',
      },
    },

    accordion: {
      slots: {
        trigger: `text-base font-bold text-highlighted ${focusRing}`,
      },
    },
  },
})

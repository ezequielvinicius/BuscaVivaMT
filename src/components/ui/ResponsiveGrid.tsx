import React from 'react'

/**
 * Grid responsivo para cards de pessoas
 */
export function PersonGrid({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`
      grid gap-4
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      2xl:grid-cols-5
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * Layout responsivo para detalhes
 */
export function DetailLayout({ 
  sidebar, 
  main, 
  className = '' 
}: {
  sidebar: React.ReactNode
  main: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      <aside className="lg:w-1/3 order-2 lg:order-1">
        {sidebar}
      </aside>
      <main className="lg:w-2/3 order-1 lg:order-2">
        {main}
      </main>
    </div>
  )
}

/**
 * Container responsivo principal
 */
export function PageContainer({ 
  children, 
  maxWidth = 'max-w-7xl',
  className = '' 
}: {
  children: React.ReactNode
  maxWidth?: string
  className?: string
}) {
  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Stack responsivo para formulários
 */
export function FormStack({ 
  children, 
  spacing = 'space-y-6',
  className = '' 
}: {
  children: React.ReactNode
  spacing?: string
  className?: string
}) {
  return (
    <div className={`${spacing} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Botões responsivos com breakpoints
 */
export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  className = '' 
}: {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical' | 'responsive'
  className?: string
}) {
  const orientationClasses = {
    horizontal: 'flex flex-row space-x-3',
    vertical: 'flex flex-col space-y-3',
    responsive: 'flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3'
  }

  return (
    <div className={`${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  )
}

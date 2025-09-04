import { describe, it, expect } from 'vitest'

describe('Setup de Testes', () => {
  it('deve configurar vitest corretamente', () => {
    expect(true).toBe(true)
  })

  it('deve ter acesso às globals do vitest', () => {
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
    expect(expect).toBeDefined()
  })

  it('deve mockar APIs corretamente', () => {
    expect(global.ResizeObserver).toBeDefined()
    expect(global.URL.createObjectURL).toBeDefined()
  })
})

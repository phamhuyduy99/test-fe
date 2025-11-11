import { renderHook, act } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import useTestCaculateHook from './useTestCaculate.hook'

describe('useTestCaculateHook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    expect(result.current.unitType).toBe('%')
    expect(result.current.value).toBe('0')
    expect(typeof result.current.setUnitType).toBe('function')
    expect(typeof result.current.setValue).toBe('function')
  })

  test('should change unit type correctly', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    act(() => {
      result.current.setUnitType('px')
    })
    
    expect(result.current.unitType).toBe('px')
  })

  test('should adjust value to 100 when switching from px to % with value > 100', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    // Set value to 150 and unit to px
    act(() => {
      result.current.setValue('150')
      result.current.setUnitType('px')
    })
    
    // Switch to % - should adjust to 100
    act(() => {
      result.current.setUnitType('%')
    })
    
    expect(result.current.unitType).toBe('%')
    expect(result.current.value).toBe('100')
  })

  test('should not adjust value when switching from px to % with value <= 100', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    act(() => {
      result.current.setValue('50')
      result.current.setUnitType('px')
    })
    
    act(() => {
      result.current.setUnitType('%')
    })
    
    expect(result.current.unitType).toBe('%')
    expect(result.current.value).toBe('50')
  })

  test('should handle non-numeric values when switching units', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    act(() => {
      result.current.setValue('abc')
      result.current.setUnitType('px')
    })
    
    // When switching to % with non-numeric value, it should remain as is
    act(() => {
      result.current.setUnitType('%')
    })
    
    expect(result.current.unitType).toBe('%')
    expect(result.current.value).toBe('abc')
  })

  test('should update value correctly', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    act(() => {
      result.current.setValue('75')
    })
    
    expect(result.current.value).toBe('75')
  })

  test('should handle decimal values correctly', () => {
    const { result } = renderHook(() => useTestCaculateHook())
    
    act(() => {
      result.current.setValue('99.5')
      result.current.setUnitType('px')
    })
    
    act(() => {
      result.current.setUnitType('%')
    })
    
    expect(result.current.unitType).toBe('%')
    expect(result.current.value).toBe('99.5') // Should not adjust since 99.5 <= 100
  })
})
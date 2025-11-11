import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)

    // Kiểm tra cơ bản - không dùng toBeInTheDocument
    expect(screen.getByText('Unit')).toBeDefined()
    expect(screen.getByText('Value')).toBeDefined()
  })
})
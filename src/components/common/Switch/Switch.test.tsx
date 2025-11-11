import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Switch from './Switch'
import '@testing-library/jest-dom'

describe('Switch Component', () => {
    test('renders with correct unit active', () => {
        render(<Switch unit="%" onUnitChange={vi.fn()} />)

        // Kiểm tra cả hai button đều được render
        expect(screen.getByText('%')).toBeInTheDocument()
        expect(screen.getByText('px')).toBeInTheDocument()

        // Kiểm tra button % có class active
        const buttons = document.querySelectorAll('.unit-selector button')
        expect(buttons[0]).toHaveClass('active')
        expect(buttons[1]).not.toHaveClass('active')
    })

    test('renders with px unit active', () => {
        render(<Switch unit="px" onUnitChange={vi.fn()} />)

        const buttons = document.querySelectorAll('.unit-selector button')
        expect(buttons[1]).toHaveClass('active')
        expect(buttons[0]).not.toHaveClass('active')
    })

    test('calls onUnitChange with correct unit when buttons are clicked', async () => {
        const user = userEvent.setup()
        const mockOnUnitChange = vi.fn()
        render(<Switch unit="%" onUnitChange={mockOnUnitChange} />)

        const buttons = document.querySelectorAll('.unit-selector button')

        // Click px button
        await user.click(buttons[1])
        expect(mockOnUnitChange).toHaveBeenCalledWith('px')
        expect(mockOnUnitChange).toHaveBeenCalledTimes(1)

        // Click % button
        await user.click(buttons[0])
        expect(mockOnUnitChange).toHaveBeenCalledWith('%')
        expect(mockOnUnitChange).toHaveBeenCalledTimes(2)
    })

    test('has correct structure and styling', () => {
        render(<Switch unit="%" onUnitChange={vi.fn()} />)

        const container = document.querySelector('.unit-selector')
        expect(container).toBeInTheDocument()
        expect(container).toHaveClass('w-[140px]', 'h-8', 'flex')

        // CÁCH 1: Tìm separator bằng cách lấy phần tử con thứ 2 (div separator)
        const separator = container?.children[1] // children[0] = button %, children[1] = div separator, children[2] = button px
        expect(separator).toBeInTheDocument()
        expect(separator).toHaveClass('h-full', 'w-[4px]', 'bg-[#212121]')

        // CÁCH 2: Tìm bằng vị trí trong container
        // const buttons = container?.querySelectorAll('button')
        // const separator = buttons?.[0]?.nextElementSibling
        // expect(separator).toBeInTheDocument()
        // expect(separator).toHaveClass('h-full', 'w-[4px]', 'bg-[#212121]')
    })

    test('buttons have correct text styling', () => {
        render(<Switch unit="%" onUnitChange={vi.fn()} />)

        const percentText = screen.getByText('%')
        const pxText = screen.getByText('px')

        expect(percentText).toHaveClass('text-xs', 'text-[#f9f9f9]')
        expect(pxText).toHaveClass('text-xs', 'text-[#f9f9f9]')
    })
})
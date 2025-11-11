import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import TestCaculate from './TestCaculate'
import '@testing-library/jest-dom'

// Mock child components với implementation đơn giản
vi.mock('../../components/common/Switch/Switch', () => ({
    default: vi.fn(({ unit, onUnitChange }) => (
        <div className="unit-selector w-[140px] h-8 flex">
            <button
                onClick={() => onUnitChange('%')}
            >
                %
            </button>
            <div className="h-full w-[4px] bg-[#212121]" />
            <button
                onClick={() => onUnitChange('px')}
            >
                px
            </button>
            <span>Current: {unit}</span>
        </div>
    ))
}))

vi.mock('../../components/common/InputPicker/InputPicker', () => ({
    default: vi.fn(({ unit }) => (
        <div>
            <span>InputPicker - Unit: {unit}</span>
            <input defaultValue="0" />
        </div>
    ))
}))

describe('TestCaculate Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('renders all static elements correctly', () => {
        render(<TestCaculate />)

        // Kiểm tra các phần tử cơ bản
        expect(screen.getByText('Unit')).toBeInTheDocument()
        expect(screen.getByText('Value')).toBeInTheDocument()

        // Kiểm tra container chính bằng className
        const container = document.querySelector('.flex.flex-col.gap-4')
        expect(container).toBeInTheDocument()
    })

    test('renders child components with correct initial props', () => {
        render(<TestCaculate />)

        // Switch component should be rendered với unit ban đầu là '%'
        const switchComponent = document.querySelector('.unit-selector')
        expect(switchComponent).toBeInTheDocument()
        expect(screen.getByText('Current: %')).toBeInTheDocument()

        // InputPicker component should be rendered
        expect(screen.getByText('InputPicker - Unit: %')).toBeInTheDocument()
    })

    test('updates unit state when Switch component triggers onUnitChange', async () => {
        const user = userEvent.setup()
        render(<TestCaculate />)

        // Ban đầu unit là '%'
        expect(screen.getByText('Current: %')).toBeInTheDocument()

        // Click px button - lấy button thứ 2 (px)
        const buttons = document.querySelectorAll('.unit-selector button')
        await user.click(buttons[1])

        // Unit should change to 'px'
        expect(screen.getByText('Current: px')).toBeInTheDocument()

        // InputPicker should receive the new unit
        expect(screen.getByText('InputPicker - Unit: px')).toBeInTheDocument()
    })

    test('maintains consistent unit state across both components', async () => {
        const user = userEvent.setup()
        render(<TestCaculate />)

        const buttons = document.querySelectorAll('.unit-selector button')

        // Switch to px
        await user.click(buttons[1])

        // Both components should reflect the same unit
        expect(screen.getByText('Current: px')).toBeInTheDocument()
        expect(screen.getByText('InputPicker - Unit: px')).toBeInTheDocument()

        // Switch back to %
        await user.click(buttons[0])

        // Both components should reflect %
        expect(screen.getByText('Current: %')).toBeInTheDocument()
        expect(screen.getByText('InputPicker - Unit: %')).toBeInTheDocument()
    })

    test('has correct responsive layout structure', () => {
        render(<TestCaculate />)

        // Check flex layout for rows
        const unitElements = screen.getAllByText('Unit')
        const unitRow = unitElements[0].closest('.flex.gap-2.w-full.items-center.justify-start')

        const valueElements = screen.getAllByText('Value')
        const valueRow = valueElements[0].closest('.flex.gap-2.w-full.items-center.justify-start')

        expect(unitRow).toBeInTheDocument()
        expect(valueRow).toBeInTheDocument()
    })

    test('label elements have correct styling', () => {
        render(<TestCaculate />)

        // Sử dụng phần tử đầu tiên cho mỗi label
        const unitElements = screen.getAllByText('Unit')
        const valueElements = screen.getAllByText('Value')

        const unitLabel = unitElements[0].closest('div')
        const valueLabel = valueElements[0].closest('div')

        expect(unitLabel).toHaveClass('text-[#aaaaaa]', 'w-[100px]', 'h-[36px]', 'py-2', 'flex')
        expect(valueLabel).toHaveClass('text-[#aaaaaa]', 'w-[100px]', 'h-[36px]', 'py-2', 'flex')

        // Check span styling inside labels
        expect(unitElements[0]).toHaveClass('text-xs', 'h-[20px]', 'items-center')
        expect(valueElements[0]).toHaveClass('text-xs', 'h-[20px]', 'items-center')
    })
})
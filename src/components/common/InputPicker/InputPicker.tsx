import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import './InputPicker.css';
import subtractIcon from './../../../../public/iconInputPicker/subtract.svg'
import addIcon from './../../../../public/iconInputPicker/add.svg'

type Unit = '%' | 'px';

interface InputPickerProps {
    unit: Unit;
}

const InputPicker: React.FC<InputPickerProps> = ({ unit }) => {
    const [value, setValue] = useState<string>('0');
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [tooltipMessage, setTooltipMessage] = useState<string>('');
    const [tooltipType, setTooltipType] = useState<'min' | 'max' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const decrementTooltipRef = useRef<HTMLDivElement>(null);
    const incrementTooltipRef = useRef<HTMLDivElement>(null);
    const prevUnitRef = useRef<Unit>(unit);
    const previousValidValueRef = useRef<string>('0');

    // Xử lý làm sạch giá trị
    const sanitizeValue = (input: string): string => {
        if (input === '') return '';

        return input
            .replace(/,/g, '.')
            .replace(/[^\d.]/g, '')
            .replace(/(\..*)\./g, '$1');
    };

    // Kiểm tra giá trị hợp lệ và cập nhật tooltip
    const validateValue = (currentValue: string): { isValid: boolean; message: string; type?: 'min' | 'max' } => {
        if (currentValue === '') {
            return { isValid: false, message: '' };
        }

        const numValue = parseFloat(currentValue);

        if (isNaN(numValue)) {
            return { isValid: false, message: '' };
        }

        if (numValue <= 0) {
            return { isValid: false, message: 'Value must greater than 0', type: 'min' };
        }

        if (unit === '%' && numValue > 100) {
            return { isValid: false, message: 'Value must smaller than 100', type: 'max' };
        }

        return { isValid: true, message: '' };
    };

    // Lấy giá trị hợp lệ gần nhất
    const getNearestValidValue = (currentValue: string): string => {
        if (currentValue === '') return '0';

        const numValue = parseFloat(currentValue);

        if (isNaN(numValue)) {
            return previousValidValueRef.current;
        }

        if (numValue <= 0) {
            return '0';
        }

        if (unit === '%' && numValue > 100) {
            return '100';
        }

        // Nếu giá trị hợp lệ, cập nhật previousValidValue
        previousValidValueRef.current = numValue.toString();
        return numValue.toString();
    };

    // Xử lý khi mất focus
    const handleBlur = (): void => {
        const cleaned = sanitizeValue(value);

        // Tìm giá trị hợp lệ gần nhất khi blur
        const nearestValidValue = getNearestValidValue(cleaned);

        // Nếu giá trị không hợp lệ, hiển thị tooltip
        const validation = validateValue(cleaned);
        if (!validation.isValid && validation.message) {
            setTooltipMessage(validation.message);
            setTooltipType(validation.type || null);
            setShowTooltip(true);

            // Tự động ẩn tooltip sau 2 giây
            setTimeout(() => {
                setShowTooltip(false);
            }, 2000);
        } else {
            setShowTooltip(false);
            setTooltipType(null);
        }

        // Cập nhật giá trị hợp lệ
        setValue(nearestValidValue);
    };

    // Xử lý khi focus
    const handleFocus = (): void => {
        const validation = validateValue(value);
        if (!validation.isValid && validation.message) {
            setTooltipMessage(validation.message);
            setTooltipType(validation.type || null);
            setShowTooltip(true);
        }
    };

    // Xử lý thay đổi input
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            setValue('');
            const validation = validateValue('');
            if (!validation.isValid && validation.message) {
                setTooltipMessage(validation.message);
                setTooltipType(validation.type || null);
                setShowTooltip(true);
            }
            return;
        }

        const validPattern = /^[0-9.,]*$/;
        if (validPattern.test(inputValue)) {
            setValue(inputValue);
            const validation = validateValue(inputValue);
            if (!validation.isValid && validation.message) {
                setTooltipMessage(validation.message);
                setTooltipType(validation.type || null);
                setShowTooltip(true);
            } else {
                // Nếu giá trị hợp lệ, cập nhật previousValidValue
                previousValidValueRef.current = inputValue;
                setShowTooltip(false);
                setTooltipType(null);
            }
        }
    };

    // Xử lý sự kiện bàn phím
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (e.ctrlKey || e.metaKey) {
            return;
        }

        const isNumber = /^[0-9]$/.test(e.key);
        const isDotOrComma = e.key === '.' || e.key === ',';
        const isAllowedKey = allowedKeys.includes(e.key);

        if (!isNumber && !isDotOrComma && !isAllowedKey) {
            e.preventDefault();
        }

        // Xử lý khi nhấn Enter (tương tự blur)
        if (e.key === 'Enter') {
            inputRef.current?.blur();
        }
    };

    // Xử lý sự kiện paste
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const cleaned = sanitizeValue(pastedText);
        setValue(cleaned);
        const validation = validateValue(cleaned);
        if (!validation.isValid && validation.message) {
            setTooltipMessage(validation.message);
            setTooltipType(validation.type || null);
            setShowTooltip(true);
        } else {
            previousValidValueRef.current = cleaned;
            setShowTooltip(false);
            setTooltipType(null);
        }
    };

    // Xử lý tăng/giảm giá trị
    const handleIncrement = (): void => {
        const numValue = parseFloat(value) || 0;
        const newValue = unit === '%'
            ? Math.min(numValue + 1, 100)
            : numValue + 1;
        setValue(newValue.toString());
        previousValidValueRef.current = newValue.toString();
        const validation = validateValue(newValue.toString());
        if (!validation.isValid && validation.message) {
            setTooltipMessage(validation.message);
            setTooltipType(validation.type || null);
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
            setTooltipType(null);
        }
    };

    const handleDecrement = (): void => {
        const numValue = parseFloat(value) || 0;
        const newValue = Math.max(numValue - 1, 0);
        setValue(newValue.toString());
        previousValidValueRef.current = newValue.toString();
        const validation = validateValue(newValue.toString());
        if (!validation.isValid && validation.message) {
            setTooltipMessage(validation.message);
            setTooltipType(validation.type || null);
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
            setTooltipType(null);
        }
    };

    // Kiểm tra điều kiện disable buttons
    const isDecrementDisabled: boolean = (parseFloat(value) || 0) <= 0;
    const isIncrementDisabled: boolean = unit === '%' && (parseFloat(value) || 0) >= 100;

    // Đóng tooltip khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                (decrementTooltipRef.current && !decrementTooltipRef.current.contains(event.target as Node)) &&
                (incrementTooltipRef.current && !incrementTooltipRef.current.contains(event.target as Node)) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)
            ) {
                setShowTooltip(false);
                setTooltipType(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Xử lý khi unit thay đổi từ px sang % và giá trị > 100
    useEffect(() => {
        // Kiểm tra nếu unit thay đổi từ px sang %
        if (prevUnitRef.current === 'px' && unit === '%') {
            const numValue = parseFloat(value);

            // Nếu giá trị hiện tại lớn hơn 100, tự động chuyển về 100
            if (!isNaN(numValue) && numValue > 100) {
                setValue('100');
                previousValidValueRef.current = '100';
            }
        }

        // Cập nhật previous unit
        prevUnitRef.current = unit;
    }, [unit, value]);

    return (
        <div className="input-picker w-[140px] h-9">
            <div className="input-controls">
                <div className="control-btn-wrapper">
                    <button
                        onClick={handleDecrement}
                        disabled={isDecrementDisabled}
                        className="control-btn flex items-center justify-center"
                        type="button"
                    >
                        <img src={subtractIcon} alt="" />
                    </button>

                    {/* Tooltip cho nút giảm (min value) */}
                    {showTooltip && tooltipType === 'min' && (
                        <div ref={decrementTooltipRef} className="validation-tooltip decrement-tooltip">
                            {tooltipMessage}
                            <div className="tooltip-arrow"></div>
                        </div>
                    )}
                </div>

                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        className="value-input w-full"
                        inputMode="decimal"
                        pattern="[0-9.,]*"
                        title="Chỉ được nhập số, dấu chấm hoặc dấu phẩy"
                    />
                </div>

                <div className="control-btn-wrapper">
                    <button
                        onClick={handleIncrement}
                        disabled={isIncrementDisabled}
                        className="control-btn flex items-center justify-center"
                        type="button"
                    >
                        <img src={addIcon} alt="" />
                    </button>

                    {/* Tooltip cho nút tăng (max value) */}
                    {showTooltip && tooltipType === 'max' && (
                        <div ref={incrementTooltipRef} className="validation-tooltip increment-tooltip">
                            {tooltipMessage}
                            <div className="tooltip-arrow"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputPicker;
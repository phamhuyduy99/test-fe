import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import './InputPicker.css';

type Unit = '%' | 'px';

interface InputPickerProps {
    unit: Unit;
}

const InputPicker: React.FC<InputPickerProps> = ({ unit }) => {
    const [value, setValue] = useState<string>('0');
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [tooltipMessage, setTooltipMessage] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const prevUnitRef = useRef<Unit>(unit);
    const previousValidValueRef = useRef<string>('0');

    // Xử lý làm sạch giá trị
    const sanitizeValue = (input: string): string => {
        return input
            .replace(/,/g, '.')
            .replace(/[^\d.]/g, '')
            .replace(/(\..*)\./g, '$1');
    };

    // Kiểm tra giá trị hợp lệ và cập nhật tooltip
    const validateValue = (currentValue: string): { isValid: boolean; message: string } => {
        const numValue = parseFloat(currentValue);

        if (isNaN(numValue)) {
            return { isValid: false, message: 'Value must be a number' };
        }

        if (numValue <= 0) {
            return { isValid: false, message: 'Value must greater than 0' };
        }

        if (unit === '%' && numValue > 100) {
            return { isValid: false, message: 'Value must smaller than 100' };
        }

        return { isValid: true, message: '' };
    };

    // Lấy giá trị hợp lệ gần nhất
    const getNearestValidValue = (currentValue: string): string => {
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
        if (!validation.isValid) {
            setTooltipMessage(validation.message);
            setShowTooltip(true);

            // Tự động ẩn tooltip sau 2 giây
            setTimeout(() => {
                setShowTooltip(false);
            }, 2000);
        } else {
            setShowTooltip(false);
        }

        // Cập nhật giá trị hợp lệ
        setValue(nearestValidValue);
    };

    // Xử lý khi focus
    const handleFocus = (): void => {
        const validation = validateValue(value);
        if (!validation.isValid) {
            setTooltipMessage(validation.message);
            setShowTooltip(true);
        }
    };

    // Xử lý thay đổi input
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            setValue('');
            const validation = validateValue('');
            if (!validation.isValid) {
                setTooltipMessage(validation.message);
                setShowTooltip(true);
            }
            return;
        }

        const validPattern = /^[0-9.,]*$/;
        if (validPattern.test(inputValue)) {
            setValue(inputValue);
            const validation = validateValue(inputValue);
            if (!validation.isValid) {
                setTooltipMessage(validation.message);
                setShowTooltip(true);
            } else {
                // Nếu giá trị hợp lệ, cập nhật previousValidValue
                previousValidValueRef.current = inputValue;
                setShowTooltip(false);
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
        if (!validation.isValid) {
            setTooltipMessage(validation.message);
            setShowTooltip(true);
        } else {
            previousValidValueRef.current = cleaned;
            setShowTooltip(false);
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
        if (!validation.isValid) {
            setTooltipMessage(validation.message);
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
        }
    };

    const handleDecrement = (): void => {
        const numValue = parseFloat(value) || 0;
        const newValue = Math.max(numValue - 1, 0);
        setValue(newValue.toString());
        previousValidValueRef.current = newValue.toString();
        const validation = validateValue(newValue.toString());
        if (!validation.isValid) {
            setTooltipMessage(validation.message);
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
        }
    };

    // Kiểm tra điều kiện disable buttons
    const isDecrementDisabled: boolean = (parseFloat(value) || 0) <= 0;
    const isIncrementDisabled: boolean = unit === '%' && (parseFloat(value) || 0) >= 100;

    // Đóng tooltip khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
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
                setTooltipMessage('Value automatically adjusted to 100%');
                setShowTooltip(true);

                // Tự động ẩn tooltip sau 2 giây
                setTimeout(() => {
                    setShowTooltip(false);
                }, 2000);
            }
        }

        // Cập nhật previous unit
        prevUnitRef.current = unit;
    }, [unit, value]);

    return (
        <div className="input-picker">
            <div className="input-controls">
                <button
                    onClick={handleDecrement}
                    disabled={isDecrementDisabled}
                    className="control-btn"
                    type="button"
                >
                    -
                </button>

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
                        className="value-input"
                        inputMode="decimal"
                        pattern="[0-9.,]*"
                        title="Chỉ được nhập số, dấu chấm hoặc dấu phẩy"
                    />

                    {/* Tooltip hiển thị thông báo lỗi */}
                    {showTooltip && tooltipMessage && (
                        <div ref={tooltipRef} className="validation-tooltip">
                            {tooltipMessage}
                            <div className="tooltip-arrow"></div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleIncrement}
                    disabled={isIncrementDisabled}
                    className="control-btn"
                    type="button"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default InputPicker;
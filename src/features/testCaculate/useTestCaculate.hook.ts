import { useState } from 'react';

type Unit = '%' | 'px';

const useTestCaculateHook = () => {
    const [unitType, setUnitType] = useState<Unit>('%');
    const [value, setValue] = useState<string>('0');

    const handleUnitChange = (newUnit: Unit) => {
        // Khi chuyển từ px sang % và giá trị > 100, tự động điều chỉnh về 100
        if (newUnit === '%') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue > 100) {
                setValue('100');
            }
        }
        setUnitType(newUnit);
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
    };

    return {
        unitType,
        setUnitType: handleUnitChange,
        value,
        setValue: handleValueChange,
    };
};

export default useTestCaculateHook;
import React from 'react';

type Unit = '%' | 'px';

interface SwitchProps {
    unit: Unit;
    onUnitChange: (unit: Unit) => void;
}

const Switch: React.FC<SwitchProps> = ({ unit, onUnitChange }) => {
    return (
        <div className="unit-selector w-full">
            <button
                className={unit === '%' ? 'active' : ''}
                onClick={() => onUnitChange('%')}
                type="button"
            >
                %
            </button>
            <button
                className={unit === 'px' ? 'active' : ''}
                onClick={() => onUnitChange('px')}
                type="button"
            >
                px
            </button>
        </div>
    );
};

export default Switch;
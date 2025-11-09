import React from 'react';
import './Switch.css';

type Unit = '%' | 'px';

interface SwitchProps {
    unit: Unit;
    onUnitChange: (unit: Unit) => void;
}

const Switch: React.FC<SwitchProps> = ({ unit, onUnitChange }) => {
    return (
        <div className="unit-selector w-[140px] h-8 flex">
            <button
                className={`${unit === '%' ? 'active' : ''} flex items-center justify-center`}
                onClick={() => onUnitChange('%')}
                type="button"
            >
                <span className='text-xs text-[#f9f9f9]'>%</span>
            </button>
            <div className='h-full w-[4px] bg-[#212121]'></div>
            <button
                className={`${unit === 'px' ? 'active' : ''} flex items-center justify-center`}
                onClick={() => onUnitChange('px')}
                type="button"
            >
                <span className='text-xs text-[#f9f9f9]'>px</span>
            </button>
        </div>
    );
};

export default Switch;
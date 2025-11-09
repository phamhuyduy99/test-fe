
import InputPicker from "../../components/common/InputPicker/InputPicker";
import Switch from "../../components/common/Switch/Switch";
import useTestCaculateHook from "./useTestCaculate.hook";

const TestCaculate = () => {
    const { unitType, setUnitType } = useTestCaculateHook()

    return (
        <div className="flex flex-col ">
            <div className="flex gap-4 w-full">
                <span>Unit</span>
                <Switch
                    unit={unitType}
                    onUnitChange={setUnitType}
                />
            </div>
            <div className="flex gap-4 w-full">
                <span>Value</span>
                <InputPicker unit={unitType} />
            </div>
        </div>
    )
}

export default TestCaculate;
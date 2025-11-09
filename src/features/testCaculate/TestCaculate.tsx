
import InputPicker from "../../components/common/InputPicker/InputPicker";
import Switch from "../../components/common/Switch/Switch";
import useTestCaculateHook from "./useTestCaculate.hook";

const TestCaculate = () => {
    const { unitType, setUnitType } = useTestCaculateHook()

    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex gap-2 w-full items-center justify-start">
                <div className="text-[#aaaaaa] w-[100px] h-[36px] py-2 flex">
                    <span className="text-xs h-[20px] items-center">
                        Unit
                    </span>
                </div>

                <Switch
                    unit={unitType}
                    onUnitChange={setUnitType}
                />
            </div>
            <div className="flex gap-2 w-full items-center justify-start">
                <div className="text-[#aaaaaa] w-[100px] h-[36px] py-2 flex">
                    <span className="text-xs h-[20px] items-center">
                        Value
                    </span>
                </div>

                <InputPicker unit={unitType} />
            </div>
        </div >
    )
}

export default TestCaculate;
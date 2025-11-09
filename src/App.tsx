import TestCaculate from "./features/testCaculate/TestCaculate"

const App = () => {
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="bg-neutral-800 p-4 rounded-lg w-[280px] h-[120px]">
        <TestCaculate />
      </div>
    </div>
  )
}

export default App

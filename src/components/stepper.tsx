type ValueOf<T extends string[]> = T[number];

interface IProps<T extends string[]> {
  steps: T;
  step: ValueOf<T>;
}

const Stepper = <T extends string[]>({ steps, step }: IProps<T>) => {
  const stepStatusIndex = steps.findIndex(
    (status) => status.toLowerCase() === step?.toLowerCase()
  );

  const isStatusActive = (currentStatusIndex: number): boolean => {
    return currentStatusIndex === stepStatusIndex;
  };

  const isStatusCompleted = (currentStatusIndex: number): boolean => {
    return currentStatusIndex < stepStatusIndex;
  };

  return (
    <ul role="list" className="flex space-x-4">
      {steps.map((item, itemIdx) => {
        const currentStatusIndex = steps.findIndex(
          (currStatus) => currStatus.toLowerCase() === item.toLowerCase()
        );
        return (
          <li key={itemIdx}>
            <div className="flex items-center space-x-2">
              <div>
                {isStatusActive(currentStatusIndex) ? (
                  <div className="w-4 h-4 border grid place-items-center border-black rounded-full">
                    <div className="bg-black w-2 h-2 rounded-full"></div>
                  </div>
                ) : isStatusCompleted(currentStatusIndex) ? (
                  <div className="w-4 h-4 border grid place-items-center border-gray-400 rounded-full">
                    <div className="bg-gray-400 w-2 h-2 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 border grid place-items-center border-black rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <p
                  className={`${
                    isStatusActive(currentStatusIndex)
                      ? "text-black"
                      : "text-gray-500"
                  } text-sm font-bold whitespace-nowrap`}
                >{`${itemIdx + 1}. ${item}`}</p>
                {itemIdx !== steps.length - 1 ? (
                  <hr className="w-[30px]" />
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Stepper;

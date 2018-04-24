export const callPerSecondProbably = (
  func: Function,
  delta: number,
  callsPerSecondCount: number = 1
): void => {
  if (Math.random() < callsPerSecondCount * delta) {
    func();
  }
};

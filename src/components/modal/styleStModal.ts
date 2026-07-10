export const buildStModalClasses = () => {
  const overlay = [
    'fixed inset-0 z-[9999]',
    'flex items-center justify-center',
    'overflow-y-auto bg-black/60',
    'p-st-4'
  ].join(' ');

  return { overlay };
};

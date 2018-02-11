export const timer = async (timeInMs: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), timeInMs);
    });
};
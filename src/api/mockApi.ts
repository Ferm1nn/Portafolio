export const simulateApiCall = <T>(data: T, delay: number = 1500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
};

export const convertToBengali = (input: string | number) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const inputString = typeof input === 'string' ? input : input.toString();
    return inputString.split('').map(char => {
        const num = parseInt(char);
        return isNaN(num) ? char : bengaliNumbers[num];
    }).join('');
};


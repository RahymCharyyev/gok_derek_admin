export const formatNumber = (value: string, previousValue: string) => {
  const regex = /^\d*$/;
  if (regex.test(value)) {
    return value;
  }
  return previousValue;
};

export const formatPrice = (value: string, previousValue: string) => {
  const regex = /^\d*\.?\d{0,2}$/;
  if (regex.test(value)) {
    return value;
  }
  return previousValue;
};

export function formatDecimal(input: string, current: string): string {
  const sanitizedInput = input.replace(/[^\d.,]/g, '');

  const standardizedInput = sanitizedInput.replace(',', '.');

  const decimalRegex = /^\d*(\.\d{0,2})?$/;
  if (decimalRegex.test(standardizedInput)) {
    return standardizedInput;
  }

  return current;
}

export const formatLetters = (value: string, previousValue: string) => {
  const regex = /^[a-zA-ZäüçňöýşžÄÜÇŇÖÝŞŽ]*$/;
  if (regex.test(value)) {
    return value;
  }
  return previousValue;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

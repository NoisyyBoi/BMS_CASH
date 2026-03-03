// Format number in Indian numbering system (lakhs, crores)
export const formatIndianCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  
  // Convert to string and split into integer and decimal parts
  const [integerPart, decimalPart] = num.toFixed(2).split('.');
  
  // Indian numbering system: last 3 digits, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  // Return with decimal if not .00
  if (decimalPart && decimalPart !== '00') {
    return `₹${formatted}.${decimalPart}`;
  }
  
  return `₹${formatted}`;
};

// Format without rupee symbol
export const formatIndianNumber = (amount) => {
  const formatted = formatIndianCurrency(amount);
  return formatted.replace('₹', '');
};

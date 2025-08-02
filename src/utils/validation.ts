/**
 * Form Validation Utilities
 * Author: VB Entreprise
 * 
 * Comprehensive form validation functions for the ERP system
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  numeric?: boolean;
  custom?: (value: any) => string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  [key: string]: ValidationRule;
}

// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Validation functions
export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] };
  }

  const stringValue = String(value);

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('Invalid format');
  }

  // Email validation
  if (rules.email && !PATTERNS.EMAIL.test(stringValue)) {
    errors.push('Please enter a valid email address');
  }

  // URL validation
  if (rules.url && !PATTERNS.URL.test(stringValue)) {
    errors.push('Please enter a valid URL');
  }

  // Numeric validation
  if (rules.numeric && isNaN(Number(value))) {
    errors.push('Please enter a valid number');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate entire form
export const validateForm = (data: any, validationSchema: FieldValidation): ValidationResult => {
  const allErrors: string[] = [];
  let isValid = true;

  Object.keys(validationSchema).forEach(field => {
    const fieldRules = validationSchema[field];
    const fieldValue = data[field];
    const fieldValidation = validateField(fieldValue, fieldRules);

    if (!fieldValidation.isValid) {
      isValid = false;
      allErrors.push(...fieldValidation.errors.map(error => `${field}: ${error}`));
    }
  });

  return {
    isValid,
    errors: allErrors
  };
};

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  USER: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, email: true },
    phone: { pattern: PATTERNS.PHONE },
    role: { required: true }
  },
  LEAD: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    phone: { pattern: PATTERNS.PHONE },
    company: { required: true, minLength: 2, maxLength: 100 },
    value: { numeric: true, custom: (value) => value > 0 ? undefined : 'Value must be greater than 0' }
  },
  INVOICE: {
    clientId: { required: true },
    amount: { required: true, numeric: true, custom: (value) => value > 0 ? undefined : 'Amount must be greater than 0' },
    dueDate: { required: true, pattern: PATTERNS.DATE }
  },
  PROJECT: {
    name: { required: true, minLength: 3, maxLength: 100 },
    startDate: { required: true, pattern: PATTERNS.DATE },
    endDate: { required: true, pattern: PATTERNS.DATE },
    budget: { numeric: true, custom: (value) => value > 0 ? undefined : 'Budget must be greater than 0' }
  }
};

// Real-time validation hook
export const useFieldValidation = (value: any, rules: ValidationRule) => {
  const validation = validateField(value, rules);
  
  return {
    isValid: validation.isValid,
    errors: validation.errors,
    hasError: validation.errors.length > 0
  };
};

// Format validation error messages
export const formatValidationError = (field: string, error: string): string => {
  const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  return `${fieldName} ${error.toLowerCase()}`;
};

// Sanitize input values
export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Validate file upload
export const validateFile = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
} = {}): ValidationResult => {
  const errors: string[] = [];

  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = options.maxSize / (1024 * 1024);
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 
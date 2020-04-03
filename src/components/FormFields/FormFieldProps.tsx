import { ValidationOptions } from 'react-hook-form';

interface FormFieldProps {
  fieldName: string;
  fieldClass?: string;
  labelText?: string;
  validationOptions?: ValidationOptions;
  refObject?: any;
};

export default FormFieldProps;

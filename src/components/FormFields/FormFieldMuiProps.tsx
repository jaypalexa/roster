import { ValidationOptions } from 'react-hook-form';

interface FormFieldMuiProps {
  fieldName: string;
  fieldClass?: string;
  labelText?: string;
  validationOptions?: ValidationOptions;
  refObject?: any;
  disabled?: boolean;
};

export default FormFieldMuiProps;

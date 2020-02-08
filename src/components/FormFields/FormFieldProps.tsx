import { ValidationOptions } from 'react-hook-form';
import ReactHookFormProps from './ReactHookFormProps';

interface FormFieldProps {
  fieldName: string;
  labelText?: string;
  validationOptions?: ValidationOptions;
  reactHookFormProps: ReactHookFormProps;
};

export default FormFieldProps;

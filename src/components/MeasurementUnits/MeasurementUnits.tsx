import React from 'react';
import { useForm } from 'react-hook-form';
import './MeasurementUnits.sass';

const MeasurementUnits: React.FC = () => {

  type FormData = {
    measurementUnits: string;
  };

  // const defaultValues: FormData = {
  //   measurementUnits: '',
  // };

  let defaultValues = JSON.parse(localStorage.getItem('measurementUnits') || '{}');

  const methods = useForm<FormData>({
    defaultValues: defaultValues
  });

  const { handleSubmit, register, reset } = methods;

  const onSubmit = handleSubmit((values: FormData) => {
    console.log('in handleSubmit(): values', values);
    localStorage.setItem('measurementUnits', JSON.stringify(values));
    defaultValues = {...values};
  });

  const handleCancel = (): void => {
    console.log('in handleCancel()...');
    reset({ ...defaultValues });
  };

  return (
    <div id='measurement-units'>
      <div className='columns'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Measurement Units</h1>
          <form onSubmit={onSubmit}>

            <div className='field'>
              <div className='control'>
                <label className='radio'>
                  <input type='radio' name='measurementUnits' value='Metric' ref={register}/>
                  Metric
                </label>
                <label className='radio'>
                  <input type='radio' name='measurementUnits' value='Imperial' ref={register}/>
                  Imperial
                </label>
              </div>
            </div>

            <div className='field is-grouped is-grouped-right'>
              <p className='control'>
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => handleCancel()}
                />
              </p>

              <p className='control'>
                <input type='submit' className='button is-success is-fixed-width-medium' value='Save' />
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default MeasurementUnits;

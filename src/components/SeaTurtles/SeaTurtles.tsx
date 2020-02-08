import React, { useEffect, useState } from 'react';
import { ElementLike, useForm, ValidationOptions } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleService from '../../services/SeaTurtleService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import UnsavedChanges from '../UnsavedChanges/UnsavedChanges';
import './SeaTurtles.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

type FieldProps = {
  fieldName: string;
  labelText?: string;
  //register<Element extends ElementLike = ElementLike>(): (ref: Element | null) => void;
  register<Element extends ElementLike = ElementLike>(validationOptions: ValidationOptions): (ref: Element | null) => void;
  // register<Element extends ElementLike = ElementLike>(name: FieldName<any>, validationOptions?: ValidationOptions): void;
  // register<Element extends ElementLike = ElementLike>(namesWithValidationOptions: Record<FieldName<any>, ValidationOptions>): void;
  // register<Element extends ElementLike = ElementLike>(ref: Element, validationOptions?: ValidationOptions): void;
  // register<Element extends ElementLike = ElementLike>(refOrValidationOptions: ValidationOptions | Element | null, validationOptions?: ValidationOptions): ((ref: Element | null) => void) | void;
  validationOptions?: ValidationOptions;
}

interface ListFieldProps extends FieldProps {
  listItems: NameValuePair[];
}

export const ListField: React.FC<ListFieldProps> = ({fieldName, labelText, listItems, register, validationOptions}) => {
  return (
    <div className='field'>
      <label className={`label ${labelText ? '' : 'hidden'}`}>{labelText}</label>
      <div className='control is-expanded'>
        <div className='select is-fullwidth'>
          <select name={fieldName} ref={register(validationOptions || {})}>
            {listItems.map((e, key) => {
              return <option key={key} value={e.value}>{e.name}</option>;
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

//export default ListField;

const SeaTurtles: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [currentSeaTurtle, setCurrentSeaTurtle] = useState({} as SeaTurtleModel);
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [turtleSizes, setTurtleSizes] = useState([] as Array<NameValuePair>);
  const [turtleStatuses, setTurtleStatuses] = useState([] as Array<NameValuePair>);
  const { errors, handleSubmit, formState, register, reset, watch } = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const seaTurtleId = 'faceface-face-face-face-facefaceface';

  useEffect(() => {
    setSpecies(CodeListTableService.getList(CodeTableType.Species, true));
    setTurtleSizes(CodeListTableService.getList(CodeTableType.TurtleSize, true));
    setTurtleStatuses(CodeListTableService.getList(CodeTableType.TurtleStatus, true));
    // make async server request
    const getSeaTurtle = async () => {
      const fetchedSeaTurtle = await SeaTurtleService.getSeaTurtle(seaTurtleId);
      reset(fetchedSeaTurtle);
      setCurrentSeaTurtle(fetchedSeaTurtle);
    };
    getSeaTurtle();
  }, [reset]);

  useEffect(() => {
    // make async server request
    const getSeaTurtles = async () => {
      const fetchedSeaTurtles = await SeaTurtleService.getSeaTurtles(appContext.organizationId || '');
      setCurrentSeaTurtles(fetchedSeaTurtles);
    };
    getSeaTurtles();
  }, [appContext.organizationId]);

  // console.log(JSON.stringify(formState));

  const onSubmit = handleSubmit((modifiedSeaTurtle: SeaTurtleModel) => {
    // console.log('in handleSubmit(): modifiedSeaTurtle', modifiedSeaTurtle);
    const patchedSeaTurtle = { ...currentSeaTurtle, ...modifiedSeaTurtle };
    // console.log('in handleSubmit(): patchedSeaTurtle', patchedSeaTurtle);
    SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
    reset(patchedSeaTurtle);
    setCurrentSeaTurtle(patchedSeaTurtle);
    toast.success('Record saved');
  });

  const onCancel = () => {
    // console.log('in onCancel()...');
    // console.log('currentSeaTurtle', currentSeaTurtle);
    reset(currentSeaTurtle);
  };

  new TabHelper().initialize();

  return (
    <div id='seaTurtle'>
      <UnsavedChanges isDirty={formState.dirty}></UnsavedChanges>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Sea Turtles</h1>
          {/*Name*/}{/*SID #*/}{/*Species*/}
          <table className='table is-fullwidth is-bordered is-narrow table-header'>
            <thead>
              <tr>
                <th className='column-width-small'>Name</th>
                <th className='column-width-medium'>SID #</th>
                <th>Species</th>
              </tr>
            </thead>
          </table>
          <div className='sea-turtle-table-container'>
            <table className='table is-striped is-hoverable is-fullwidth is-bordered is-narrow'>
              <tbody>
                {
                  currentSeaTurtles.map((seaTurtle) => {
                    return <tr key={seaTurtle.sidNumber}>
                      <td className='column-width-small'>{seaTurtle.turtleName}</td>
                      <td className='column-width-medium'>{seaTurtle.sidNumber}</td>
                      <td>{seaTurtle.species}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>

          <form onSubmit={onSubmit}>

            <div className='tabs'>
              <ul>
                <li className='is-active'><a>General Information</a></li>
                <li><a>Tags</a></li>
                <li><a>Measurements</a></li>
              </ul>
            </div>

            <div>
              <section className='tab-content is-active'> {/* General Information */}
                <div className='field is-horizontal'>
                  <div className='field-body'>
                    <div className='field'>
                      <label className='label'>Name</label>
                      <div className='control'>
                        <input name='name'
                          className={`input ${!watch('seaTurtleName') ? 'is-danger' : ''}`}
                          type='text'
                          placeholder='Name'
                          ref={register({ required: 'Name is required' })}
                        />
                      </div>
                      <p className='help has-text-danger'>{errors.turtleName && errors.turtleName.message}</p>
                    </div>
                    <div className='field'>
                      <label className='label'>SID Number</label>
                      <div className='control is-expanded'>
                        <input name='sidNumber' className='input' type='text' placeholder='SID Number' ref={register({})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Stranding ID Number</label>
                      <div className='control is-expanded'>
                        <input name='strandingIdNumber' className='input' type='text' placeholder='Stranding ID Number' ref={register({})} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='field is-horizontal'>
                  <div className='field-body'>
                    <ListField fieldName='species' labelText='Species' listItems={species} register={register} />
                    <ListField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} register={register} />
                    <ListField fieldName='status' labelText='Status' listItems={turtleStatuses} register={register} />
                  </div>
                </div>
              </section>

              <section className='tab-content'> {/* Tags */}
              </section>

              <section className='tab-content'> {/* Measurements */}
              </section>
            </div>

            <div className='field is-grouped action-button-grouping'>
              <p className='control'>
                <input
                  type='button'
                  className='button is-danger is-fixed-width-medium'
                  value='Cancel'
                  onClick={() => onCancel()}
                  disabled={!formState.isValid}
                />
              </p>

              <p className='control'>
                <input
                  type='submit'
                  className='button is-success is-fixed-width-medium'
                  value='Save'
                  disabled={!formState.isValid}
                />
              </p>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default SeaTurtles;

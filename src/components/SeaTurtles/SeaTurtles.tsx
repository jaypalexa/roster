import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import TabHelper from '../../helpers/TabHelper';
import CodeListTableService, { CodeTableType } from '../../services/CodeTableListService';
import SeaTurtleService from '../../services/SeaTurtleService';
import NameValuePair from '../../types/NameValuePair';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import FormFieldRow from '../FormFields/FormFieldRow';
import ListFormField from '../FormFields/ListFormField';
import TextFormField from '../FormFields/TextFormField';
import UnsavedChanges from '../UnsavedChanges/UnsavedChanges';
import './SeaTurtles.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtles: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const methods = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const { handleSubmit, formState, reset } = methods;
  const [currentSeaTurtle, setCurrentSeaTurtle] = useState({} as SeaTurtleModel);
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
  const [species, setSpecies] = useState([] as Array<NameValuePair>);
  const [turtleSizes, setTurtleSizes] = useState([] as Array<NameValuePair>);
  const [turtleStatuses, setTurtleStatuses] = useState([] as Array<NameValuePair>);
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

  const onSubmit = handleSubmit((modifiedSeaTurtle: SeaTurtleModel) => {
    const patchedSeaTurtle = { ...currentSeaTurtle, ...modifiedSeaTurtle };
    SeaTurtleService.saveSeaTurtle(patchedSeaTurtle);
    reset(patchedSeaTurtle);
    setCurrentSeaTurtle(patchedSeaTurtle);
    toast.success('Record saved');
  });

  const onCancel = () => {
    reset(currentSeaTurtle);
  };

  new TabHelper().initialize();

  return (
    <div id='seaTurtle'>
      <UnsavedChanges isDirty={formState.dirty}></UnsavedChanges>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Sea Turtles</h1>
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

          <FormContext {...methods} >
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
                  <FormFieldRow>
                    <TextFormField fieldName='turtleName' labelText='Name' validationOptions={{required: 'Name is required'}} />
                    <TextFormField fieldName='sidNumber' labelText='SID Number' />
                    <TextFormField fieldName='strandingIdNumber' labelText='Stranding ID Number' />
                  </FormFieldRow>
                  <FormFieldRow>
                    <ListFormField fieldName='species' labelText='Species' listItems={species} />
                    <ListFormField fieldName='turtleSize' labelText='Size' listItems={turtleSizes} />
                    <ListFormField fieldName='status' labelText='Status' listItems={turtleStatuses} />
                  </FormFieldRow>
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
                    disabled={!formState.dirty}
                  />
                </p>

                <p className='control'>
                  <input
                    type='submit'
                    className='button is-success is-fixed-width-medium'
                    value='Save'
                    disabled={!formState.dirty || !formState.isValid}
                  />
                </p>

              </div>
            </form>
          </FormContext>

        </div>
      </div>
    </div>
  );
};

export default SeaTurtles;

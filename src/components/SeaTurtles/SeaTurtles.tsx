import NavigationPrompt from 'react-router-navigation-prompt';
import React, { useEffect, useState } from 'react';
import SeaTurtleModel from '../../types/SeaTurtleModel';
import SeaTurtleService from '../../services/SeaTurtleService';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/AppContext';
import { useForm } from 'react-hook-form';
import './SeaTurtles.sass';
/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtles: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [currentSeaTurtle, setCurrentSeaTurtle] = useState({} as SeaTurtleModel);
  const [currentSeaTurtles, setCurrentSeaTurtles] = useState([] as Array<SeaTurtleModel>);
  const { errors, handleSubmit, formState, register, reset, watch } = useForm<SeaTurtleModel>({ mode: 'onChange' });
  const seaTurtleId = 'faceface-face-face-face-facefaceface';

  useEffect(() => {
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

  let tabs = document.querySelectorAll('.tabs li');
  let tabsContent = document.querySelectorAll('.tab-content');

  let deactvateAllTabs = function () {
    tabs.forEach(function (tab) {
      tab.classList.remove('is-active');
    });
  };

  let hideTabsContent = function () {
    tabsContent.forEach(function (tabContent) {
      tabContent.classList.remove('is-active');
    });
  };

  let activateTabsContent = function (tab: Element) {
    tabsContent[getIndex(tab)].classList.add('is-active');
  };

  let getIndex = function (el: Element) {
    const nodes = Array.prototype.slice.call(el?.parentElement?.children);
    return nodes.indexOf(el);
  };

  tabs.forEach(function (tab: Element) {
    tab.addEventListener('click', function () {
      deactvateAllTabs();
      hideTabsContent();
      tab.classList.add('is-active');
      activateTabsContent(tab);
    });
  })

  return (
    <div id='seaTurtle'>
      <NavigationPrompt when={formState.dirty}>
        {({ onConfirm, onCancel }) => (
          <div className='modal is-active'>
            <div className='modal-background'></div>
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Unsaved Changes</p>
              </header>
              <section className='modal-card-body'>
                <p>You have unsaved changes. Are you sure you want to leave?</p>
              </section>
              <footer className='modal-card-foot'>
                <button className='button is-success' onClick={onConfirm}>Yes</button>
                <button className='button is-danger' onClick={onCancel}>No</button>
              </footer>
            </div>
          </div>
        )}
      </NavigationPrompt>

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
                      <td className='column-width-small'>{seaTurtle.name}</td>
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
                      <p className='help has-text-danger'>{errors.name && errors.name.message}</p>
                    </div>
                    <div className='field'>
                      <label className='label'>SID Number</label>
                      <div className='control is-expanded'>
                        <input name='sidNumber' className='input' type='text' placeholder='SID Number' ref={register({})} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>Species</label>
                      <div className='control is-expanded'>
                        <input name='species' className='input' type='text' placeholder='Species' ref={register({})} />
                      </div>
                    </div>
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

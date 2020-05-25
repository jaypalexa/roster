import AboutRoster from 'components/AboutRoster/AboutRoster'
import BlankForms from 'components/BlankForms/BlankForms'
import HatchlingsEvents from 'components/HatchlingsEvents/HatchlingsEvents'
import HoldingTankGraphs from 'components/HoldingTankGraphs/HoldingTankGraphs'
import HoldingTankMeasurements from 'components/HoldingTankMeasurements/HoldingTankMeasurements'
import HoldingTanks from 'components/HoldingTanks/HoldingTanks'
import Home from 'components/Home/Home'
import Login from 'components/Login/Login'
import NotFound from 'components/NotFound/NotFound'
import Organization from 'components/Organization/Organization'
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute'
import Report from 'components/Report/Report'
import ReportOptions from 'components/ReportOptions/ReportOptions'
import Reports from 'components/Reports/Reports'
import SeaTurtleMorphometrics from 'components/SeaTurtleMorphometrics/SeaTurtleMorphometrics'
import SeaTurtleMorphometricsGraphs from 'components/SeaTurtleMorphometricsGraphs/SeaTurtleMorphometricsGraphs'
import SeaTurtles from 'components/SeaTurtles/SeaTurtles'
import SeaTurtleTags from 'components/SeaTurtleTags/SeaTurtleTags'
import WashbacksEvents from 'components/WashbacksEvents/WashbacksEvents'
import React from 'react'
import { Route, Switch } from 'react-router-dom'

const routes = () => 
  <Switch>
    <ProtectedRoute exact path='/' component={Home} />
    <ProtectedRoute exact path='/sea-turtles' component={SeaTurtles} />
    <ProtectedRoute exact path='/sea-turtle-tags' component={SeaTurtleTags} />
    <ProtectedRoute exact path='/sea-turtle-morphometrics' component={SeaTurtleMorphometrics} />
    <ProtectedRoute exact path='/sea-turtle-morphometrics-graphs' component={SeaTurtleMorphometricsGraphs} />
    <ProtectedRoute exact path='/holding-tanks' component={HoldingTanks} />
    <ProtectedRoute exact path='/holding-tank-measurements' component={HoldingTankMeasurements} />
    <ProtectedRoute exact path='/holding-tank-graphs' component={HoldingTankGraphs} />
    <ProtectedRoute exact path='/hatchlings-events' component={HatchlingsEvents} />
    <ProtectedRoute exact path='/washbacks-events' component={WashbacksEvents} />
    <ProtectedRoute exact path='/reports' component={Reports} />
    <ProtectedRoute exact path='/report-options/:reportId' component={ReportOptions} />
    <ProtectedRoute exact path='/report' component={Report} />
    <ProtectedRoute exact path='/blank-forms' component={BlankForms} />
    <ProtectedRoute exact path='/organization' component={Organization} />
    <ProtectedRoute exact path='/about-roster' component={AboutRoster} />
    <Route exact path='/login' component={Login} />
    <Route component={NotFound} />
  </Switch>

export default routes

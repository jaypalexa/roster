import HatchlingsEvents from 'components/HatchlingsEvents/HatchlingsEvents'
import HoldingTankGraphs from 'components/HoldingTankGraphs/HoldingTankGraphs'
import HoldingTankMeasurements from 'components/HoldingTankMeasurements/HoldingTankMeasurements'
import HoldingTanks from 'components/HoldingTanks/HoldingTanks'
import Home from 'components/Home/Home'
import Login from 'components/Login/Login'
import NotFound from 'components/NotFound/NotFound'
import Organization from 'components/Organization/Organization'
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute'
import Reports from 'components/Reports/Reports'
import SeaTurtleMorphometrics from 'components/SeaTurtleMorphometrics/SeaTurtleMorphometrics'
import SeaTurtleMorphometricsGraphs from 'components/SeaTurtleMorphometricsGraphs/SeaTurtleMorphometricsGraphs'
import SeaTurtles from 'components/SeaTurtles/SeaTurtles'
import SeaTurtleTags from 'components/SeaTurtleTags/SeaTurtleTags'
import WashbacksEvents from 'components/WashbacksEvents/WashbacksEvents'
import React from 'react'
import { Route, Switch } from 'react-router-dom'

const routes = (setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>) => 
  <Switch>
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/' component={Home} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/sea-turtles' component={SeaTurtles} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/sea-turtle-tags' component={SeaTurtleTags} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/sea-turtle-morphometrics' component={SeaTurtleMorphometrics} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/sea-turtle-morphometrics-graphs' component={SeaTurtleMorphometricsGraphs} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/holding-tanks' component={HoldingTanks} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/holding-tank-measurements' component={HoldingTankMeasurements} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/holding-tank-graphs' component={HoldingTankGraphs} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/hatchlings-events' component={HatchlingsEvents} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/washbacks-events' component={WashbacksEvents} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/reports' component={Reports} />
    <ProtectedRoute setLoggedInUserName={setLoggedInUserName} exact path='/organization' component={Organization} />
    <Route exact path='/login' render={ (routeProps) => <Login {...{setLoggedInUserName, ...routeProps}} /> } />
    <Route component={NotFound} />
  </Switch>

export default routes

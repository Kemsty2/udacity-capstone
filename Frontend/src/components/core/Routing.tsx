//  Component Okay

import React, {useContext} from 'react'
import { Router, Route } from 'react-router-dom'
import {createBrowserHistory} from 'history'
import App from '../../App'
import { Auth0Context } from '../../contexts/auth0-context'

const history = createBrowserHistory()

function MakeAuthRouting (){

  const auth0 = useContext(Auth0Context)

  return (
    <Router history={history}>
      <div>        
        <Route
          render={props => {            
            return <App {...props} auth={auth0} />
          }}
        />
      </div>
    </Router>
  )
}

export default MakeAuthRouting;

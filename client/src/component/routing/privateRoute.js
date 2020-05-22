import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CreateProfile } from '../profile-forms/CreateProfile'
// import { loadUser } from '../../actions/auth';

const PrivateRoute = ({ component: CreateProf,auth:{isAuthenticated,loading},...rest}) => 
(
    <Route {...rest} render={props=>!isAuthenticated && !loading?(
    <Redirect to="/login"/>):
            <CreateProf{...props}/>}/>
    
)

PrivateRoute.propTypes = {
    auth:PropTypes.object.isRequired,

}
const mapStateToProps=state=>({
    auth:state.auth
})

export default connect(mapStateToProps) (PrivateRoute)

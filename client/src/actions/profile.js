import axios from 'axios';
import api from '../utils/api'
import {setAlert} from './alert';
import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_REPOS
} from './types';

//get current user profiles

export const getCurrentProfile=()=>async dispatch=>{
    try {
        console.log('chal rha')
        const res =await axios.get('api/profile/me')
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        console.log(res,"rishu")
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        })
        
    }
}

//get all profile

export const getProfiles = () => async dispatch => {
    dispatch({
        type:CLEAR_PROFILE
    })
    try {
        
        const res = await api.get('/profile')
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
        
    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }
}

//get profile by id

export const getProfileById = userId => async dispatch => {
    try {
        console.log(axios.defaults)
        const res = await api.get(`/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

    } catch (err) {
        console.log(err, 'aaaaaaaaaaaaa')
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }
}

//get github repos

export const getGithubRepos = username => async dispatch => {

    try {

        const res = await api.get(`/profile/github/${username}`)
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }
}

//create or update profile
export const createProfile=(formData,history,edit=false)=>async dispatch=>{
    try {
        const config={
            headers:{
                'content-type':'application/json'
            }
        }

        const res=await axios.post('api/profile',formData,config,)
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience added','success'))
        history.push('/dashboard')
     
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
        
    }
}

//add experience

export const addExperience=(formData,history)=>async dispatch=>{
    try {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const res = await api.put('/profile/experience', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('experience added', 'success'))
        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }

}

//add education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const res = await api.put('/profile/education', formData, config)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('education added', 'success'))
        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }

}

//delete experience

export const deleteExperience=id=>async dispatch=>{
    try {
        const res=await api.delete(`/profile/experience/${id}`)
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('experience removed', 'success'))
        
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
        
    }
}

//delete education

export const deleteEducation = id => async dispatch => {
    try {
        const res = await api.delete(`/profile/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('education removed', 'success'))

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })

    }
}

//delete account

export const deleteAccount = () => async dispatch => {
    if(window.confirm('are you sure? this can NOT be undone')){
        try {
            await api.delete('/profile')
            dispatch({type:CLEAR_PROFILE})
            dispatch({type: ACCOUNT_DELETED})

            dispatch(setAlert('your account has been permanantly deleted'))

        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })

        }

    }
    
}
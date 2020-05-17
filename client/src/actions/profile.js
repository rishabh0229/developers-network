import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR
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
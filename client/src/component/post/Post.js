import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import {getPost} from '../../actions/post';
import CommentForm from '../post/CommentForm';

const Post = ({getPost,post:{post,loading},match}) => {
    console.log(post)
    useEffect(()=>{
        getPost(match.params.id)
    },[])
    return loading || post===null?<Spinner/>:<Fragment>
        <Link to='/posts' className='btn'>
            back to posts
        </Link>
        <PostItem post={post} showActions={false}/>
        <CommentForm postId={post._id}/>
    </Fragment>
}

Post.propTypes = {
    getPost:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,

}
const mapStateToProps=state=>({
    post:state.post
})

export default connect(mapStateToProps,{getPost})(Post)

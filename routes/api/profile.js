const express = require('express');
const router = express.Router();
const auth=require('../middlewere/auth');
const Profile=require('../../models/profile');
const User=require('../../models/User');
const { check, validationResult } = require("express-validator/check");
const request=require('request');
const config=require('config');

//@route     GET api/profile/me
//@desc      get current user profile
//@ascess    private
router.get('/me', auth, async(req, res) =>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate(
            'user',
            ['name','avatar']
        );
        if(!profile){
            return res
              .status(400)
              .json({ msg: "there is no profile for this user" });
        }
        res.json(profile)
        

    }catch(err){
        console.error(err.message)
        res.status(500).send('server error')
    }
});

//@route     POST api/profile
//@desc      create ar update a user profile
//@ascess    private

router.post('/',
[
    auth,[
    check('status','status is required')
    .not()
    .isEmpty(),
    check('skills','skill is required')
    .not()
    .isEmpty()
]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    //build profile object
    const profileFields={};
    profileFields.user=req.user.id;
    
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    //build social objects

    profileFields.social={}
    if (youtube) profileFields.social.youtube=youtube;
    if (twitter) profileFields.social.twitter=twitter;
    if (facebook) profileFields.social.facebook=facebook;
    if (linkedin) profileFields.social.linkedin=linkedin;
    if (instagram) profileFields.social.instagram=instagram;

    try{
        let profile=await Profile.findOne({user:req.user.id});
        if(profile){
            //update
            profile= await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );
            console.log("jhg",profile);
            return res.json(profile);
        }
        // create
        profile=new Profile(profileFields);
        await profile.save()
        console.log("jhg",profile)
        res.json(profile)

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
    
    

})
//@route     GET api/profile/user/:user_id
//@desc      get profile by user ID
//@ascess    private
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile)
        return res.status(400).json({msg:'there is no profile for this user'});
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'profile not found'})
        }
        res.status(500).send('server error')
        
    }
})
//@route     DELETE api/profile
//@desc      delete profile,user and post
//@ascess    private

router.delete('/',auth, async (req,res)=>{
    try {
        //@todo-remove user posts
        //remove profile
        await Profile.findOneAndRemove({user:req.user.id})
        //remove user
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg:'user deleted'})
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
})
//@route     PUT api/profile/experience
//@desc      add profile experience 
//@ascess    private
router.put(
    '/experience',
    [
        auth,
        [
            check('title','title is required').not().isEmpty(),
            check('company','company is required').not().isEmpty(),
            check('from','from date is required').not().isEmpty()
        ]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;

    const newExp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    console.log(req.body)
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
        
    }
})
//@route     DELETE api/profile/experience/:exp_id
//@desc      dlete expreience from profile
//@ascess    private
router.delete('/experience/:exp_id',auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeindex=profile.experience.map(items=>items.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeindex,1);

        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
        
    }
})

//@route     PUT api/profile/education
//@desc      add profile education 
//@ascess    private
router.put(
    '/education',
    [
        auth,
        [
            check('school','school is required').not().isEmpty(),
            check('degree','degree is required').not().isEmpty(),
            check('fieldofstudy','fieldofstudy is required').not().isEmpty()
        ]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    console.log(req.body)
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
        
    }
})
//@route     DELETE api/profile/education/:edu_id
//@desc      dlete education from profile
//@ascess    private
router.delete('/education/:edu_id',auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeindex=profile.education
        .map(items=>items.id)
        .indexOf(req.params.edu_id)
        profile.education.splice(removeindex,1);

        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
        
    }
})
//@route     DELETE api/profile/github/:username
//@desc      get user repos from github
//@ascess    public
router.get('/github/:username',(req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
                &client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}
        }
        console.log(options)
        request(options,(error,response,body)=>{
            if(error) console.error(error)
            //console.log(response,body)
            if(response.statusCode!=200){
               return res.status(404).json({msg:'no github profile found'})
            }

            res.json(JSON.parse(body));

        })
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
})

module.exports = router;
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../libs/dbConnect.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

const collection = db.collection('users');

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const query = {
      $or: [{ email }, { username }],
    };
    const existingUser = await collection.findOne(query);
    if (existingUser) {
      return next({
        status: 422,
        message: 'Email or Username is already registered.',
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = {
      username,
      email,
      password: hashedPassword,
      avatar: 'https://gravatar.com/avatar/26986d0781b53710262696bbc2cfca5b?s=200&d=robohash&r=x',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { insertedId } = await collection.insertOne(user);
    const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET);
    user._id = insertedId;
    const { password: pass, updatedAt, createdAt, ...rest } = user;
    res
      .cookie('taskboard_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next({ status: 500, error });
  }
};

export const signin = async (req,res,next) =>{

  const {email,password} = req.body;

  try{
    const validUser = await collection.findOne({email});
    if(!validUser){
      return next ({status:404,message:'User not found!'}); // next parameter=> call next middleware in the sequence
    }
    const validPassword = await bcrypt.compare(password,validUser.password); // password=> entered password , validUser.password => password which is stored in Database
                                                                             // why bcrypt.compare=> it will decrypt the database password
    if(!validPassword){
      return next({status:401, message:'Wrong password'});
    }
    const token = jwt.sign({id:validUser._id}, process.env.AUTH_SECRET);  // here we are sending token to database ,
                                                                          // database's id is assigning to id and env.AUTH_SECRET is assigning to sign() => Genetrated a token as token
    const {password:pass,updatedAt,createdAt,...rest} = validUser; // 
    res 
       .cookie('taskly_token',token,{httpOnly:true})  // httpOnly => hypertext transfer protocol
                                                        // cookie will automatically transfer to the  server
       .status(200)
       .json(rest);
  }catch(error){
    next({status:500,error});
  }
};

export const signOut = async(req,res,next)=>{
  try{
    res.clearCookie('taskly_token');
    res.status(200).json({message:'Sign out successful'});
  }catch(error){
    next({status:500});
  }
};

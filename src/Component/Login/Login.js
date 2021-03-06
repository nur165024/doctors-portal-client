import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from 'react-router-dom';
import loginImage from '../../images/login-image.png';
import './Login.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './Firebase';
import { UserLoginContext } from '../../App';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


const Login = () => {
    // error message handle
    const [errorMessage,setErrorMessage] = useState({
        message : '',
        status : false,
    });
    const [errorButton,setErrorButton] = useState(true)

    // after login uesr Redirect
    let history = useHistory();
    let location = useLocation();
    const [loggedInUser, setLoggedInUser] = useContext(UserLoginContext);
    let { from } = location.state || { from: { pathname: "/admin/dashboard" } };

    // form submit 
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        const {email,password} = data;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setLoggedInUser(user);
            history.replace(from);
        })
        .catch((error) => {
            const errorMessage = error.message;
            setErrorMessage({
                message : errorMessage,
                status : true,
            });
            console.log(errorMessage);
        });
    }

    const handleErrorMessage = () => {
        setErrorButton(false)
    }

    return (
        <section id="userLogin">
            <div className="container">
                <div className="row d-flex align-items-center">
                    <div className="col-md-6">
                        <h2 className="text-center mb-5 text-secondary">Login</h2>
                        {
                            errorButton && 
                            errorMessage.status === true && 
                            <div class="alert alert-danger alert-dismissible">
                                <button onClick={handleErrorMessage} type="button" class="close" data-dismiss="alert">&times;</button>
                                <span id="userRegisterMessage">{errorMessage.message}</span>
                            </div>
                        }
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div class="form-group">
                                <label htmlFor="email">User Email</label>
                                <input type="email" {...register('email', {required:true})} name="email" class="form-control" id="email" placeholder="User Email" />
                                <p className="text-danger">{errors.email && "Email is required"}</p>
                            </div>
                            <div class="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" {...register('password', {required:true})} name="password" class="form-control" id="password" placeholder="Password" />
                                <p className="text-danger">{errors.password && "Password is required"}</p>
                            </div>
                            <Link className="text-danger text-right d-block" to="#">Forgot your password</Link>
                            <button type="submit" class="btn btn-primary btn-block btn-setColor mt-4">Submit</button>
                            <Link className="text-danger text-center d-block" to="/register">Register</Link>
                        </form>
                    </div>
                    <div className="col-md-6">
                        <div className="login-image">
                            <img src={loginImage} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
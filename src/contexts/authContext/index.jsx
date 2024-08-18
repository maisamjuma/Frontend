import React, {useContext, useState, useEffect} from "react";
import {auth} from "../../firebase/firebase";
// import { GoogleAuthProvider } from "firebase/auth";
import {onAuthStateChanged} from "firebase/auth";
import PropTypes from 'prop-types'; // Import PropTypes

const AuthContext = React.createContext();

//our Hook:
export function useAuth() {//

    const context = useContext(AuthContext); //the return value is the result of calling useContext (by providing this AuthContext as an argument)

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;

}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);//if the user will be logged in then this will be set to True //otherwise this will be set to its default value which is false
    // const [isEmailUser, setIsEmailUser] = useState(false);
    // const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [loading, setLoading] = useState(true);//initially it will be set to True //which simply means that our code is trying to find out what is the current Auth state of the users in our project
    /* (trying to load the current Auth state of the users in our project)*/


    useEffect(() => {//we subscribe to the AuthStateChanged event so whenever the authentication state is going to be changed (such as if the user is logging in) (or if a user is logging out)-> then we want to subscribe to those event changes {by simply listening to them}
        //for that we need to import line 2
        const unsubscribe = onAuthStateChanged(auth, initializeUser);//initializeUser is a call back function that will be called to handle when we receive any user info
        //this unsubscribe can be used for cleanup (so when the Auth provider component is going to be unmounted then we can simply return this unsubscribe function)
        return unsubscribe;
    }, []);

    /*
    when a user has successfully logged in then initializeUser is going to be provided with the users information as an argument
    */
    async function initializeUser(user) {
        if (user) {
            setCurrentUser({...user});//by simply spreading out the users properties into a new object (so that we are not maintaining any references to this user argument)

            /*
            since we have set the Current User (by setCurrentUser function) -> then we can also be sure that the user has logged in, so we can simply call setUserLoggedIn(true);
            but first, we check if provider is email and password login:
            */
            // const isEmail = user.providerData.some(
            //     (provider) => provider.providerId === "password"
            // );
            // setIsEmailUser(isEmail);

            /*check if the auth provider is Google or not:*/
            //   const isGoogle = user.providerData.some(
            //     (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
            //   );
            //   setIsGoogleUser(isGoogle);

            setUserLoggedIn(true);

        } else { //if the user has logged out then we will not receive the valid user object
            setCurrentUser(null);
            setUserLoggedIn(false);
        }

        setLoading(false);
    }

    const value = {// here, we are exposing the value object which is going to be const value equals to a new object literal
        currentUser,
        userLoggedIn,   //if the user is logged in or not
        loading        //if the hook is loading the user information or not

        // isEmailUser,
        // isGoogleUser,
        // setCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );


}
// Add PropTypes validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
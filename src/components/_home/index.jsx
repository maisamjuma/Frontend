// import React from 'react'
// import {useAuth} from '../../contexts/authContext'
//
// const Home = () => {
//     /*
//
//     to display a message
//     which will simply print the users email or users display name (whichever is available)
//
//     */
//     const {currentUser} = useAuth() //useAuth is a hook
//     return (
//         <div className='text-2xl font-bold pt-14'>
//             {/*
//             from this home component we can simply return a message {hello ... }
//             and if displayName of currentUser is available -> we print displayName
//             otherwise -> we print email of currentUser
//             */}
//             Hello {currentUser.displayName ? currentUser.displayName : currentUser.email},
//             you are now logged in.
//         </div>
//         /*
//
//         this condition is important
//         because when a user will log in (or create an account) using email and password
//         then their display name is not going to be available
//
//         although we can set it explicitly by simply creating a profile page and allowing the user to enter their display name
//         or by simply showing a dialogue when the user logs in for the first time (asking for their name)
//
//         but in any case if display name is not available then we have to use email
//         but the display name is going to be available with the Google's authentication
//
//         */
//     )
// }
//
// export default Home
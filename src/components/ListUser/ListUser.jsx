import React, {useEffect, useState} from 'react'
import {listUsers} from "../../Services/UserService.js";
import classes from "*.module.css";
import {useNavigate} from "react-router-dom";


const ListUser = () => {

    // const [user] useState(*initial value of the state variable(in this case we used empty array )*)
    //  useState returns an array with two values:
    //  first is the state variable/value (in this case: users)
    //  second is a function that updates the state variable (in this case: setUsers)

    const [users, setUsers] = useState([]) //useState hook allows us to define the state variables in a functional components

    const navigator = useNavigate();

    //  the following is a logic to get the response of the rest api
    //  and store that data in a "state variable" (in this case: users)
    useEffect(
        () => { //first parameter: call Back function

            listUsers().then((response)=>{
                setUsers(response.data)
            }).catch(error => console.log(error))


        }, [] //second parameter: Dependency list (in this case there are no dependencies, so we will keep it as an empty array)
    );

    /*

        const dummyData =[

            {
                "userId": 1,
                "username": "Rami_R",
                "email": "RamiRimawi059@icloud.com",
                "password": "AbuR123456",
                "firstName": "Rami",
                "lastName": "Remawi",
                "role": "backnd_developer",
                "isAdmin": false,
                "createdAt": "2024-07-28T12:34:56",
                "updatedAt": "2024-07-30T01:30:12"
            },
            {
                "userId": 2,
                "username": "Osa-_-",
                "email": "o.osaidb2015@gmail.com",
                "password": "osaidPassword123",
                "firstName": "Osaid",
                "lastName": "Baba",
                "role": "backend_developer",
                "isAdmin": false,
                "createdAt": "2024-07-29T12:00:00",
                "updatedAt": "2024-07-29T12:00:00"
            }

        ]
    */

    function addNewUser() {
        //whenever user click on add addNewUser button -> user should navigate to add-user page
        navigator('/add-user')
    }

    function updateUser(id){
        navigator(`/edit-user/${id}`)
    }

    return (
        <div className='container'>
            <div className={classes.bgPrimary}>
            <h2 className=' rounded py-2 px-4 text-center '>List of Users</h2>
            </div>
            <div className="d-flex gap-3">
            <button type='button' className='btn btn-secondary mb-2' onClick={addNewUser}>Add User</button>
            <button type='button' className='btn btn-secondary mb-2'>Assign Team Leaders</button>
            </div>
            <table className="table table-striped table-bordered">
                <thead>
                <tr>
                    <th>User Id</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>

                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Is Team Leader?</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    users.map(user => (
                        <tr key={user.id}>
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.role}</td>
                            <td>{user.isAdmin}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.updatedAt}</td>
                            <td>
                                <button type='button' className='btn btn-info mb-2'
                                        onClick={() => updateUser(user.userId)}>Update
                                </button>

                            </td>
                        </tr>
                    ))
                }

                </tbody>

            </table>
        </div>
    )
}
export default ListUser
// style={{backgroundColor: '#4d0026'}}
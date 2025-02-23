import { createContext, useContext } from 'react';
import { useLocalStorage } from '../util.jsx';
const UserContext = createContext();
const UserProvider = props => {
    const [user, setUser] = useLocalStorage('taskboard_user', null);
    const updateUser = user => {
        setUser(user);
    };
    const value = {
        user,
        updateUser,
    };
    return (
        <UserContext.Provider
            value={value}>{props.children}</UserContext.Provider>
    );
};
const useUser = () => {      
    const context = useContext(UserContext); //UserContext is an object , context=> React's context object 
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
export { UserProvider, useUser };

// How to use Context 
// -----------------------
// 1. import  createContext and useContext from React.       
// 2. create a object context 
// useContext => will provide facility to use anywhere context object
// createContext => will provide facility to create context object    
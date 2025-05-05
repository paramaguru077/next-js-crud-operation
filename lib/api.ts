import axios from 'axios';

const API = axios.create({
    baseURL:'https://reqres.in/api'
})
export async function getUsers(page=1){
    try{
        const  res = await API.get(`/users?page=${page}`,{
            headers:{
                'x-api-key': 'reqres-free-v1'
            }
            
                
        })
        return res.data.data;

    }
    catch(e){
        console.log("Error Fetching Users",e)
        return [];

    }

}

export async function createUser(user){
    try{
        const res = await API.post('/users',user,{
            headers:{
                'Content-Type': 'application/json',
                 'x-api-key': 'reqres-free-v1',
            }
        });
        return res.data;
    }
    catch(e){
        console.log(e);
    }
}

export const updateUser = async(id,updateUser)=>{
    try{

        const res = await API.put(`/users/${id}`,updateUser,{
            headers:{
                'Content-Type': 'application/json',
                'x-api-key': 'reqres-free-v1',
            }
        })

        return {...res.data,id}
    }
    catch(e){
        console.log(error);
        return null;

    }


}

export const deleteUser = async (id)=>{
    try{
        const res = await API.delete(`/users/${id}`,{
            headers:{
                'Content-Type': 'application/json',
                'x-api-key': 'reqres-free-v1',
            }
        });

        return res.status ===204;

    }
    catch(e){
        console.log(e);

    }
}
import axios from 'axios'
import {React,useContext,useEffect,useState} from 'react'
import { UserContext } from '../../App'
import LoadingSpinner from '../LoadingSpinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const [isLoading,setLoading]=useState(false);
    const navigate=useNavigate()
    const userId=localStorage.getItem('userId')
    //console.log(userId)
    const {dispatch}= useContext(UserContext)

    const logout=async()=>{
        try{ 
            setLoading(true);
        const response=await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout/${userId}`,{
            // userId,
            withCredentials: true, // include credentials in the request
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              // "userId": localStorage.getItem("userId")
            }})
            console.log(response);
            if(response.status===200){
                dispatch({type:"USER",payload:null})
                dispatch({type:"USER_TYPE",payload:null})
               localStorage.clear()
                setLoading(false)
                toast.success("Logout Successful", {
                  toastId: 'logout',
              })

      

                
            }
            navigate("/login",{replace:true})

        }catch(error){
            console.log(error)
        }

    }
    useEffect(()=>{
        logout()
    },[])
  return (
    <>
    {
        isLoading ?  <LoadingSpinner/>:null
    }
    </>
  )

}

export default Logout
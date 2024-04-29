import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function useCategory() {
  const [categories, setCategories] = useState([]);

/////////////get all///////
//  const getallCategory = async () => {
//    try {
//      const response = await axios.get("http://localhost:3000/category");
//      console.log(response);
//      if (response === 200) {
//        setCategories(response.data);
//      } 
//    } catch (error) {
//      console.log("Error:", error.message);
//      toast.error("Something went wrong");
//    }

//  };
  const getallCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/category");
      if (data?.status === 200) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log("Error:", error.message);
      toast.error("Something went wrong");
    }
  };
 useEffect(()=>{
getallCategory()
 },[]);
 return categories;
}

import react, {useState, useEffect, useContext} from "react";
import { FirebaseContext } from '../firebase';
import { collection, query, getDocs, orderBy } from "firebase/firestore";

const useProducto = orden =>{
    const [ productos, guardarProductos ] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(()=>{
        async function obtenerProductos(){
        const q = query(collection(firebase.db, "productos"), orderBy(orden, "desc"));

        const querySnapshot = await getDocs(q);
        const queryProductos = querySnapshot.docs.map((doc) => {
            return {
            id: doc.id,
            ...doc.data()
            }
        });

        guardarProductos(queryProductos); 
        }

        obtenerProductos();
    },[]);

    return {
        productos
    }
}

export default useProducto;

import{initializeApp} from"firebase/app";
import firebaseConfig from"./config";
import{ getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile}from"@firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from '@firebase/storage';

class Firebase{
    constructor(){
        const app=initializeApp(firebaseConfig);
        this.auth=getAuth(app);
        this.db=getFirestore(app);
        this.storage=getStorage(app);
        this.storageRef = ref(this.storage);
    }

    async registrar(nombre, email, password){
        try{
            const newuser = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            
            return await updateProfile(this.auth.currentUser, {
                displayName: nombre
            });

        }catch(error){
            console.error(error);
        }
    }

    //Inicia Sesion 
    async login(email, password){
        return signInWithEmailAndPassword(
            this.auth,
            email,
            password
        );
    }

    // Cierra la sesion
    async cerrarSesion(){
        await signOut(
            this.auth
        );
    }
}
const firebase=new Firebase();
export default firebase;
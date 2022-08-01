import React, {useState, useContext} from 'react';
import { css } from '@emotion/react';
import Router, {useRouter} from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layouts/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase, { FirebaseContext } from '../firebase';
import { collection , addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

import Error404 from '../components/layouts/404';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  //imagen: '',
  url: '',
  descripcion: ''
}


const NuevoProducto = () =>{

  //state de las imagenes
  const [ nombreimagen, guardarNombre ] = useState('');
  const [ subiendo, guardarSubiendo ] = useState(false);
  const [ progreso, guardarProgreso ] = useState('0');
  const [ urlimagen, guardarUrlImagen ] = useState('');

  const [ error, guardarError ] = useState(false);

  const { valores, errores, submitForm, handleChange, handlSubmit, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  //Context con las operaciones crud de firebase
  const { usuario , firebase } = useContext(FirebaseContext);

  async function crearProducto(){

    // Si el usuario no esta autenticado llevar al login
    if(!usuario){
      return router.push('/login');
    }


    // crear el objeto nuevo producto
    const producto = {
      nombre,
      empresa, 
      url, 
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }


    // insertarlo en la base de datos
    try {
      
      // Add a new document with a generated id.
      await addDoc(collection(firebase.db, "productos"), producto);

      return router.push('/');

    } catch (error) {
        console.error(error)
    }

  }

  // Detecta que la imagen se esta subindo
  const handleUploadStart = () =>{
    guardarProgreso(0);
    guardarSubiendo(true);
  }
 
  // Progreso se va guardando
  const handleProgress = progreso => guardarProgreso({progreso});
 
  // En caso de error, se va ejutar
  const handleUploadError = error => {
    guardarSubiendo(error);
    console.error(error);
  };

  // si se subio correctamente
  const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase
      .storage
      .ref(firebase.storage, `products/${nombreimagen.lastModified}${nombreimagen.name}`)
      .getDownloadURL()
      .then(url => {
        guardarUrlImagen(url)
      });
  };

  /* const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      guardarNombre(e.target.files[0])
    }
  } */

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg'
  };

  const handleFile = e => {
    const storageRef = ref( firebase.storage, `products/${e.target.files[0].lastModified}${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0], metadata);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      guardarProgreso(progress);
      //console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.log({error});
          break;
        case 'storage/canceled':
          // User canceled the upload
          console.log({error});
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          console.log({error});
          break;
      }
    },() =>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        guardarUrlImagen(downloadURL);
      });
    });
  }


  if(!usuario) return  

  return(
    <div>
      <Layout>
        { !usuario ? <Error404/> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario 
              onSubmit={handlSubmit}
              noValidate
            >
              <fieldset>
                <legend>Información General</legend>
              
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text"
                    id="nombre"
                    placeholder='Tu Nombre'
                    name='nombre'
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text"
                    id="empresa"
                    placeholder='Nombre Empresa o Compañia'
                    name='empresa'
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                {/*  <FileUploader 
                    accept="image/*"
                    id="imagen"
                    name='imagen'
                    randomizeFilename // genera nombre aleatorio a la imagen 
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  /> */} 
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    name="image"
                    onInput={(e) => handleFile(e)}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">Url</label>
                  <input 
                    type="url"
                    id="url"
                    placeholder='URL del producto'
                    name='url'
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}

              </fieldset>

              <fieldset>
                <legend>Sobre tu Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id="descripcion"
                    name='descripcion'
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}

              </fieldset>

              {error && <Error>{error}</Error>}

              {progreso}

              <InputSubmit 
                type="submit"
                value="Crear producto"
              />

            </Formulario>
          </>
        )}
      </Layout>
    </div>
  )
}

export default NuevoProducto;
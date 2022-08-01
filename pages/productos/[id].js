import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { FirebaseContext } from '../../firebase';
import { doc ,getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Layout from '../../components/layouts/Layout';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Error404 from '../../components/layouts/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import { async } from '@firebase/util';

const ContenedorProducto = styled.div `
    @media(min-width: 764px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Producto = () => {

    // State del componente
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({});

    // Router para obtener el id actual de la URL
    const router = useRouter();
    const { query: {id}} = router;

    // Context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    const obtenerProductos = async () =>{
        // Obtener los datos del documento
        const productoQuery = doc(firebase.db, "productos", id);
        const response = await getDoc(productoQuery);

        if(response.exists()){ // funcion exists es de firebase
            guardarProducto(response.data());
        }else{
            guardarError(true);
        }
    }

    useEffect(()=>{
        if(id){
            obtenerProductos();
        }
    },[id]);


    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    // Administrar y validar los votos
    const votarProducto = () =>{
        if(!usuario){
            return router.push('/login');
        }

        // Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return; // include: devuelve true si encontro el id del usuario

        // Guardar el ID del usuario que ha votado
        const nuevoHanVotado = [...haVotado, usuario.uid]; 

        // Actualizar en la DB
        const productoQuery = doc(firebase.db, "productos", id);
        const response = updateDoc(productoQuery, {
            votos: nuevoTotal,
            haVotado: nuevoHanVotado
        });

        // Actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        });

        obtenerProductos();

    }
    
    // Funciones para crea comentarios
    const comentarioChange = e =>{
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        });
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id =>{
        if(creador.id == id){
            return true;
        }
    }

    const agregarComentario = e =>{
        e.preventDefault();

        if(!usuario){
            return router.push('/login');
        }

        // Informacion extra al comentario
        comentario.usarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentario y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        // Actualizar la DB
        const productoQuery = doc(firebase.db, "productos", id);
        const response = updateDoc(productoQuery, {
            comentarios: nuevosComentarios
        });

        // Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        });

        obtenerProductos();

    }

    // función que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () =>{
        if(!usuario) return false;

        if(creador.id == usuario.uid){
            return true;
        }
    }

    // Elimina un producto de la db
    const eliminarProducto = async () =>{
        if(!usuario){
            return router.push('/login');
        }

        if(creador.id !== usuario.uid){
            return router.push('/');
        }

        try{
            const productoQuery = doc(firebase.db, "productos", id);
            const response = await deleteDoc(productoQuery); 
            router.push('/');
        }catch(error){
            console.log(error);
        }
    }

   
    return (
        <Layout>
            { error ? <Error404/> : (
                <div className='contenedor'>
                    <h1 css={css`
                        text-aling: center;
                        margin-top: 5rem;
                    `}>
                        {nombre}
                    </h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: { formatDistanceToNow(new Date(creado), { locale: es }) }</p>
                            <p>Por: {creador.nombre}</p>
                            <img src={urlimagen} />
                            <p>{descripcion}</p>

                            
                            {usuario && (
                                <>
                                    <h2>Agregar tu comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input 
                                                type="text"
                                                name="mensaje"
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit 
                                            type="submit"
                                            value="Agregar Comentario"
                                        />
                                    </form>
                                </>
                            )}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>
                            

                            {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                <ul>
                                    {comentarios.map((comentario, i) =>(
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por: 
                                                <span css={css`
                                                    font-weight: bold;
                                                `}>
                                                {' '}{comentario.usuarioNombre}
                                                </span>
                                            </p>
                                            {esCreador(comentario.usarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <aside>
                            <Boton 
                                target='_blank'
                                bgColor="true"
                                href={url}
                            >Visitar URL</Boton>

                            <div css={css`
                                margin-top: 5rem;
                            `}>
                                <p css={css`
                                    text-aling: center>
                                `}>{votos} Votos</p>

                                {usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >Votar</Boton>
                                )}

                            </div>
                        </aside>
                    </ContenedorProducto>

                    {puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>
            )}
        </Layout>
    )
}

export default Producto;
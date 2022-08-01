import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const Productos = styled.li`
    padding: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e1e1e1;
`;

const DescripcionProducto = styled.div`
    flex: 0 1 600px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 2rem;
`;

const Titulo = styled.a`
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
`;

const TextoDescripcion = styled.p`
    font-size: 1.2rem;
    margin: 0;
    color: #888;
`;

const Comentarios = styled.div`
    margin-top: 2rem;
    display: flex;
    align-items: center;

        div{
            display: flex;
            align-items: center;
            border: 1px solid #e1e1e1;
            padding: .3rem 1rem;
            margin-right: 2rem;
        }
        img{
            width: 2rem;
            margin-rigth: 2rem
        }
        p{
            font-size: 1.2rem;
            margin-right: 1rem;
            font-weight: 700;

            &:last-of-type{
                margin:0;
            }
        }
`;

const Votos = styled.div`
    flex: 0 0 auto;
    text-align: center;
    border: 1px solid #e1e1e1;
    padding: 1rem 1.5rem;

    div{
        font-size: 1rem;
    }

    p{
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
    }
`;

const Imagen = styled.img`
    width: 200px;
`;

function DetallesProductos({producto}) {
    const [state, setState] = useState('');

    useEffect(() => {
        return () => {

        }
    }, []);

    const { id, comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos } = producto;

    return (
        <Productos>
           <DescripcionProducto>
                <div>
                    <Imagen src={urlimagen} />
                </div>
                <div>
                    <Link href="/productos/[id]" as={`/productos/${id}`}>
                        <Titulo>{nombre}</Titulo>
                    </Link> 
                    <TextoDescripcion>{descripcion}</TextoDescripcion>

                    <Comentarios>
                        <div>
                            <img src="/static/img/comentarios.png"/>
                            <p>{comentarios.length} Comentarios</p>
                        </div>
                    </Comentarios>

                    <p>Publicado hace: { formatDistanceToNow(new Date(creado), { locale: es }) }</p>
                </div>
           </DescripcionProducto>
           
           <Votos>
                <div>&#9650;</div>
                <p>{votos}</p>
           </Votos>
        </Productos>
    )
}

export default DetallesProductos;


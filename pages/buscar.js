import React, { useState ,useEffect } from 'react';
import Layout from '../components/layouts/Layout';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import DetallesProductos from '../components/layouts/DetallesProductos';

import useProducto from '../hooks/usuProductos';



const Buscar = () =>{
  const router =  useRouter();
  const { query: {q} } = router;
  
  // Todos los productos
  const { productos } = useProducto('creado');  
  const [ resultado, guardarResultado ] = useState([]);
  
  useEffect(()=>{
    if(productos.length !== 0){
      const busqueda = q.toLocaleLowerCase(); // transforma tecto en minuscula
      const filtro = productos.filter(producto =>{
        return(
          producto.nombre.toLocaleLowerCase().includes(busqueda) || 
          producto.descripcion.toLocaleLowerCase().includes(busqueda)
        )
      });
      guardarResultado(filtro);
    }
  }, [q, productos])

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {resultado.map(producto =>(
                <DetallesProductos 
                  key={producto.id}
                  producto={producto}
                >

                </DetallesProductos>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Buscar;
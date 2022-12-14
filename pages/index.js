import React from 'react';
import Layout from '../components/layouts/Layout';
import styled from '@emotion/styled';
import DetallesProductos from '../components/layouts/DetallesProductos';

import useProducto from '../hooks/usuProductos';

const Home = () => {

  const {productos} = useProducto('creado');

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {productos.map(producto =>(
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

export default Home;
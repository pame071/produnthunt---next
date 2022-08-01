import React, {useContext} from "react";
import Link from "next/link";
import Styled from '@emotion/styled'; // para style components
import { css } from '@emotion/react'; // para agregar css directo en los elementos, (cuando solo usa pocas lineas de css)
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Boton from '../ui/Boton';
import { FirebaseContext } from "../../firebase";

const ContenedorHeader = Styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media(min-width:768px){
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = Styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;


const Header = () => {

    const { usuario , firebase } = useContext(FirebaseContext);

    return (
        <header
            css={css`
                border-bottom: 2px solid #e1e1e1;
                padding: 1rem 0;
            `}
        >
            <ContenedorHeader>
                <div 
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    <Buscar />

                    <Navegacion />
                </div>
                <div 
                    css={css`
                        display: flex;
                        align-items: center;
                    `}

                >
                  { usuario ? ( 

                    <>
                        <p css={css`
                            margin-right: 2rem;
                        `}> Hola : {usuario.displayName}</p>

                        <Boton
                            bgColor="true"
                            onClick={()=> firebase.cerrarSesion()}
                        >Cerrar Sesión</Boton>
                    </>

                   ) : ( 
                    <>
                        <Link href="/login">
                                <Boton
                                bgColor="true"
                                >Login</Boton> 
                            </Link>
                        <Link href="/crear-cuenta">
                            <Boton>Crear cuenta</Boton>
                        </Link>

                    </>
                   ) }
                </div>
            </ContenedorHeader>
        </header>
    )
}

export default Header;
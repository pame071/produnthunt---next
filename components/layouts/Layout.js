import React from "react";
import Header from "./Header";
import { Global, css } from "@emotion/react"; // Css Globales
import Head from "next/head"; // para agregar todo lo que va en head( importart css, metas, title, etc)

const Layout = props => {
    return (
        <>
            <Global 
                style={css`
                    html{
                        font-size: 62.5%;
                        box-sizing: border-box;
                    }
                    *, *:before, *:after{
                        box-sizing: inherit;
                    }
                    body{
                        font-size: 1.6rem;
                        line-height: 1.5;
                        font-family: 'PT Sans', serif;
                    }
                    h1, h2, h3{
                        margin: 0 0 2rem 0;
                        line-height: 1,5;
                    }
                    h1, h2{
                        font-family: 'Roboto Slab', serif;
                        font.weight: 700;
                    }

                    h3{
                        font-family: 'PT Sans', serif;
                    }
                    ul{
                        list-style: none;
                        margin: 0;
                        padding: 0;
                    }
                    a{
                        text-decoration: none;
                    }

                    img{
                        max-width: 100%;
                    }
                `}
            />
            <Head>
                <title>Product Hunt Firebase</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
                <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,700;1,400&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
                <link href="/static/css/app.css"  rel="stylesheet"/>
            </Head>

            <Header />

            <main>
                {props.children}
            </main>
        </>
    )
}
  

export default Layout;
export default function validarCrearProducto(valores){
    let errores = {};

    // Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El Nombre es obligatorio";
    }

    // Validar la empresa del usuario
    if(!valores.empresa){
        errores.empresa = "El Nombre de Empresa es obligatorio";
    }

    // Validar la url
    if(!valores.url){
        errores.url = "La url del producto es obligatorio";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL no valida";
    }


    // Validar la descripcion
    if(!valores.descripcion){
        errores.descripcion = "Agregar una validadción de tu profucto";
    }

    return errores;
}
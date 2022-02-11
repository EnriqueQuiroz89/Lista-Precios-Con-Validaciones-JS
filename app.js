console.log("Agregado");

/// Inicializar CLOUDINARI para la carga de imagenes.
const cloudName = 'muchosregistros';      // Mi cuenta
const unsignedUploadPreset = 'bbisdqo0';  // Mi almacen publico

// URL que invoca el recuadro para elegir la imagen de INPUT de abajo
var fileSelect = document.getElementById("fileSelect");
// Es el INPUT de tipo file para cargar un archivo
var fileElem = document.getElementById("fileElem");

/**Texto de los botones*/
const addToList = 'Agregar a la lista';
const cancel = 'Cancelar';

// Constantes formulario
const miArticulo = document.getElementById('articulo'),
    miCantidad = document.getElementById('cantidad'),
    miNota = document.getElementById('nota'),
    miImagen = document.getElementById('imagen');

const urlImagenDefault = 'https://res.cloudinary.com/muchosregistros/image/upload/w_100,c_scale/v1644423533/hyfqmzt4ppv3awfbuo0e.png';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();


//Controla la accion del boton enviar
const form = document.getElementById('form');
// controlar Funcion Submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarOrCancelar();
});

// Carga Imagen por default
setImagenPorDefault(urlImagenDefault);

/**Carga una imagen por default para un producto*/
function setImagenPorDefault(url) {
    // Coloca Url por default
    document.getElementById('imagen').value = url;
    // Agrega Imagen por default a la galeria 
    let imgDefault = new Image(); // HTML5 Constructor
    imgDefault.src = url;  /**Asigna el nuevo URL reconfigurado con escala*/
    imgDefault.alt = 'Imagen de articulo por default';  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(imgDefault); /**Agrega a la Galeria la imagen recien creada*/
}

// Valida que los campos esten llenos
function checkInputs() {
    // Obtiene los valores desde los inputs
    const articuloValue = miArticulo.value.trim();
    const cantidadValue = miCantidad.value.trim();
    const notaValue = miNota.value.trim();
    const imagenValue = miImagen.value.trim();

    let haveAnError = false;

    if (articuloValue === '') {
        // Show Error
        setErrorFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
        haveAnError = true;
    } else {
        setSuccessFor(miArticulo);
    }

    if (cantidadValue === '') {
        // Show Error
        setErrorFor(miCantidad, 'La cantidad no puede quedar vacio');
        haveAnError = true;
    } else {
        setSuccessFor(miCantidad);
    }

    if (notaValue === '') {
        // Show Error
        setErrorFor(miNota, 'La nota no puede quedar vacia');
        haveAnError = true;
    } else {
        setSuccessFor(miNota);
    }

    return haveAnError;

}

function setErrorFor(input, message) {
    const formControl = input.parentElement;  // .form-control
    const small = formControl.querySelector('small');

    // agrega el mensaje4 de error dentro de Small 
    small.innerText = message;
    // Agrega la clase error
    formControl.className = 'form-control error';
}

function setSuccessFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase error
    formControl.className = 'form-control success';
}

// Cambia la funcion del Boton Guardar
function guardarOrCancelar() {  /// Esta podria ir dentro de la funcion Guardar
    var texto = document.getElementById('boton').innerHTML;

    switch (texto) {
        case cancel:
            //Limpia el Formulario
            resetFormulario();
            // Suprime el boton de Guardar cambios               
            document.getElementById('guardar-edicion').style.display = 'none';
            break;
        case addToList:
            //Valida los campos y escribe en Firebase mediante guardar()
            if (checkInputs() === false) {
                console.log('No hubo errores, envia los datos');
                guardar();
                //  resetFormulario();
            } else {
                console.log('Hubo errores, no envies los datos');
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            console.log('Ningun texto coincide');
            document.getElementById('boton').innerHTML = addToList;
            break;
    }
}

// Util para obtener el foco
miArticulo.addEventListener("click", function (e) {
    console.log("Elija el articulo");
}, false);



/**Como se precarga la imagen que va a Cloudinary*/
/**SELECCION DE IMAGEN*/
/** Pasos
 *  1. Al hacer Click en el Link "Elige imagen" invoca funcion(e) anonima
 *  2. La funcion anonima evalua si existe la variable "fileElem" 
 *  3. fileElem es la invocacion  de un input de tipo archivo que esta oculto
 *  4. Al existir fileElem la funcion simula un Click en el campo y despliega 
 *     la ventana para elegir.   
 */
 fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

/**Se invoca desde el campo tipo FILE al percibir un cambio*/
// *********** Handle selected files ******************** //
var handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        uploadFile(files[i]); // call the function to upload the file
    }
};

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    /**Limpia de la Galeria la Imagen Anterior*/
    document.getElementById('gallery').innerHTML = '';
    // Reset the upload progress bar
    document.getElementById('progress').style.width = 0;

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {

        document.getElementById('porcentaje').innerHTML = ``; /*Resetea el porcentaje*/
        /**Calcula el progeso de la carga*/
        var progress = Math.round((e.loaded * 100.0) / e.total);
        /**Incrementa el ancho del progreso*/
        document.getElementById('progress').style.width = progress + "%";

        /**Crea y agrega la etiqueta que contiene el avance en Numero*/
        var newLabel = document.createElement('label');
        newLabel.innerHTML = `${progress} %`;
        document.getElementById('porcentaje').appendChild(newLabel);

        console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);

        console.log(progress);
        if (progress === 100) {
            /**Cambia de color al finalizar la carga*/
            document.getElementById('progress').style.background = "lime";
        }

    });

    /**Area barra de progreso*/
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

            /**Extrae la URL del JSON respuesta*/
            var url = response.secure_url;
            console.log(url); /**URL extraida de la respuesta */

            // Create a thumbnail of the uploaded image, with 150px width
            var tokens = url.split('/'); /**DIVIDE LA URL y su delimitador es */

            console.log(tokens); /**Arreglo de strings con el resultado de la division. */

            tokens.splice(-2, 0, 'w_100,c_scale'); /**Inserta elemento dos posiciones antes ultimo*/
            // w=width y h=height --> 150=150 px                 

            var img = new Image(); // HTML5 Constructor
            img.src = tokens.join('/');  /**Asigna el nuevo URL reconfigurado con escala*/
            img.alt = response.public_id;  /**Por si no se muestra la imagen*/

            document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

            // Agregar url del Thumbnail al formulario
            document.getElementById('imagen').value = img.src;
            /**Muestra la opcion para cambiar Imagen*/
            document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
} // Fin de upload FILE



// Agregar documentos
function guardar() {
    //Tres varaibles para la tarea
    var articulo = document.getElementById('articulo').value,
        cantidad = document.getElementById('cantidad').value,
        nota = document.getElementById('nota').value,
        imagen = document.getElementById('imagen').value;

    db.collection("compras").add({
        articulo: articulo,
        cantidad: cantidad,
        nota: nota,
        imagen: imagen,
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //Restaura el formulario
            resetFormulario();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function actualizar() {
    // El ID no va a cambiar
    var compraRef = db.collection("compras").doc(id);
    // Capturar los cambios en los Textfield si los hubo
    var articuloEditado = document.getElementById('articulo').value;
    var cantidadEditada = document.getElementById('cantidad').value;
    var notaEditada = document.getElementById('nota').value;
    var imagenEditada = document.getElementById('imagen').value;

    // realiza la actualizacion
    return compraRef.update({
        articulo: articuloEditado,
        cantidad: cantidadEditada,
        nota: notaEditada,
        imagen: imagenEditada,
    })
        .then(() => {
            console.log("Document successfully updated!");
            //Limpia el formulari
            resetFormulario();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

// LEER Documentos
// Creamos una var de donde queremos pintar la tabla
var table = document.getElementById('table');

//  Visualizacion en Tiempo Real
/** Cambios 
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

db.collection("compras").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().articulo}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().articulo}</td>
        <td>${doc.data().cantidad}</td>
        <td>${doc.data().nota}</td>
        </tr>
        <tr>
        <td><img src="${doc.data().imagen}" alt="${doc.data().imagen}"></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().cantidad}','${doc.data().nota}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `
    });
});

// BORRAR documentos
function eliminar(id) {
    db.collection("compras").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


// EDITAR documento
function editar(id, articulo, cantidad, nota, imagen) {
    //Limpia la galeria de la imagen por default
    limpiaGaleria()

    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('articulo').value = articulo;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('nota').value = nota;
    document.getElementById('imagen').value = imagen;
    // Muestra la imagen en Galery para que pueda ser editada.
    var img = new Image(); // HTML5 Constructor
    img.src = imagen;  /**Asigna el nuevo URL reconfigurado con escala*/
    img.alt = imagen;  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

    //Edita el texto del boton
    document.getElementById('boton').innerHTML = cancel;

    /**Cambia el Texto por si el User quiere cambiar la imagen */
    document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';

    var btnGuardarEdicion = document.getElementById('guardar-edicion');
    btnGuardarEdicion.style.display = 'unset';
    // Crea una funcion anonima para ejecutar cuando se haga click

    btnGuardarEdicion.onclick = function () {

        // El ID no va a cambiar
        var compraRef = db.collection("compras").doc(id);
        // Capturar los cambios en los Textfield si los hubo
        var articuloEditado = document.getElementById('articulo').value;
        var cantidadEditada = document.getElementById('cantidad').value;
        var notaEditada = document.getElementById('nota').value;
        var imagenEditada = document.getElementById('imagen').value;

        // realiza la actualizacion
        return compraRef.update({
            articulo: articuloEditado,
            cantidad: cantidadEditada,
            nota: notaEditada,
            imagen: imagenEditada,
        })
            .then(() => {
                console.log("Document successfully updated!");
                //Limpia el formulario
                resetFormulario();
                //Vuelve a ocultar el de edicion
                btnGuardarEdicion.style.display = 'none';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

function resetFormulario() {
    // Si exito Regresa al boton su texto original
    document.getElementById('boton').innerHTML = addToList;
    // Limpia los campos
    document.getElementById('articulo').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('nota').value = '';
    document.getElementById('imagen').value = '';

    /**Limpia la Galeria*/
    limpiaGaleria();
    /**Resetea las validaciones de los campos*/
    resetValidaciones();
    /**Resetea la barra de progreso*/
    document.getElementById('progress').style.width = 0;
    /**Borra el porcentaje en numero*/
    document.getElementById('porcentaje').innerHTML = '';
    // Regresa el texto original
    document.getElementById('fileSelect').innerHTML = 'Elije una imagen';
    //Restablece la imagen Por Default
    setImagenPorDefault(urlImagenDefault);
}

function limpiaGaleria() {
    document.getElementById('gallery').innerHTML = '';
}

function resetValidaciones() {
    miArticulo.className = 'form-control default';
    miCantidad.className = 'form-control default';
    miNota.className = 'form-control default';
    miImagen.className = 'form-control default';

    /**Ejecute  */
    console.log('Ejecute el reset de las validaciones');

}


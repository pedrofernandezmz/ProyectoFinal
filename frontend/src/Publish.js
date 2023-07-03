import React, { useState } from "react";
import "./Publish.css";
import "./css/materialize.css"
import logo from "./images/home.svg"
import Cookies from "universal-cookie";

const Cookie = new Cookies();
console.log(Cookie.get("id_user"));

async function getUserById(id){
    return await fetch('http://localhost:9000/user/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
}).then(response => response.json())

}

function goto(path){
  window.location = window.location.origin + path
}


function gotologin(){
  goto("/login")
}


function retry() {
  goto("/")
}

function logout(){
  Cookie.set("id_user", -1, {path: "/"})
  // Eliminar la cookie "name"
  Cookie.remove('name');
  // Eliminar la cookie "lastname"
  Cookie.remove('lastname');
  document.location.reload()
}

function gotocart(){
  goto("/cart")
}

function gotocompras(){
  goto("/compras")
}


function Publish() {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState({})


  if (Cookie.get("id_user") > -1 && !isLogged){
    getUserById(Cookie.get("id_user")).then(response => setUser(response))
    setIsLogged(true)
  }

  if (!(Cookie.get("id_user") > -1) && isLogged){
    setIsLogged(false)
  }

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    tittle: '',
    description: '',
    street: '',
    city: '',
    size: '',
    rooms: '',
    bathrooms: '',
    price: '',
    image: '',
    userid: ""+Cookie.get("id_user")+"",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithParsedSize = {
      ...formData,
      size: parseInt(formData.size),
      rooms: parseInt(formData.rooms),
      bathrooms: parseInt(formData.bathrooms),
      price: parseInt(formData.price),
      userid: parseInt(formData.userid),
    };
  
    fetch('http://localhost:8090/properties/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataWithParsedSize),
    })
      .then((response) => {
        if (response.ok) {
          alert('¡Cargado exitosamente!');
        } else {
          throw new Error('Error al cargar los datos');
        }
      })
      .catch((error) => {
        console.error('Error al enviar la solicitud:', error);
        alert('Ha ocurrido un error');
      });
    console.log(formData);
  };

  const handleMouseOver = () => {
    setShowDeleteAccount(true);
  };

  const handleMouseLeave = () => {
    setShowDeleteAccount(false);
  };

  const handleDeleteAccount = () => {
    // Lógica para eliminar la cuenta aquí
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    logout();
  };

  const handleCancelDelete = () => {
    // Restablecer el estado del mensaje de confirmación
    setShowConfirmation(false);
  };

  const login = (
    <div>
  <ul id="nav-mobile" className="right hide-on-med-and-down">
    <li onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <a onClick={logout} className="black-text">Cerrar Sesión</a>
      {showDeleteAccount && (
        <a onClick={handleDeleteAccount} className="black-text2">Eliminar Cuenta</a>
      )}
    </li>
  </ul>
  <div className="confirmation-container">
  {showConfirmation ? (
    <div className="confirmation">
      <p className="alerta">¿Estás seguro que quieres eliminar tu cuenta?</p>
      <p className="alerta">Se borraran tus publicaciones, mensajes y usuario</p>
      <button className="alertaboton" onClick={handleCancelDelete}>Cancelar</button>
      <button className="alertaboton eliminar" onClick={handleConfirmDelete}>Sí, eliminar cuenta</button>
    </div>
  ) : null}
</div>
</div>
  )

  const renderFailedSearch = (
    <a>NO SE ENCUENTRA PRODUCTO</a>
  )

  return (
    <div className="home">
      <nav class=" yellow accent-2 ">
        <div class="nav-wrapper">
          <a href="/" class="brand-logo center blue-text text-darken-2"><img src={logo} width="50px" height="70px" /></a> 
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li>{isLogged ? login : <a onClick={gotologin} class="black-text">Iniciar Sesion</a>}</li>
          </ul>
        </div>
      </nav>
      <div class="row" id="main">
      <div className="product" style={{ marginLeft: '200px', marginRight: '200px' }}>
      <h5 className="text-blue33">Completa el formulario</h5>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="tittle">Título:</label>
        <input type="text" id="tittle" name="tittle" value={formData.tittle} onChange={handleChange} required />

        <label htmlFor="description">Descripción:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />

        <label htmlFor="street">Calle:</label>
        <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />

        <label htmlFor="city">Ciudad:</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />

        <label htmlFor="size">Tamaño:</label>
        <input type="number" id="size" name="size" value={formData.size} onChange={handleChange} required />

        <label htmlFor="rooms">Habitaciones:</label>
        <input type="number" id="rooms" name="rooms" value={formData.rooms} onChange={handleChange} required />

        <label htmlFor="bathrooms">Baños:</label>
        <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />

        <label htmlFor="price">Precio:</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />

        <label htmlFor="image">URL de la imagen:</label>
        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} required />

        <button className="button33" type="submit">Enviar</button>
      </form>
    </div>
      </div>

      <div id="mySidenav" className="sidenav">

        </div>
    </div>
  );
}

export default Publish;
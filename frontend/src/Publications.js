import React, { useState } from "react";
import "./Publications.css";
import "./css/materialize.css"
import logo from "./images/home.svg"
import Cookies from "universal-cookie";

const Cookie = new Cookies();

async function getUserById(id){
    return await fetch('http://localhost:9000/user/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
}).then(response => response.json())

}

async function getProducts(){
  var id = Cookie.get('id_user');
  return await fetch("http://localhost:8000/search/q="+id+"", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
}

async function getProductsByCategoryId(id){
  //solo para probar corregir
  return await fetch("http://localhost:8000/search/q="+id+"", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
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

function showProducts(products) {
  return products.map((product) => (
    <div className="row product margenes">
      <hr />
      <div obj={product} key={product.id} className="product">
        <div className="col s4">
          <img className="imagenn" src={product.image} onError={(e) => (e.target.onerror = null, e.target.src = "./images/default.jpg")} />
        </div>
        <div className="col s4">
          <div className="product-details">
            <div>
              <h3 className="text-blue22">{product.tittle}</h3>
              <h4 className="precio">{product.street}, {product.city}</h4>
              <h5 className="superficie">Superficie Total: {product.size} m²</h5>
            </div>
            <div className="right2">
              <button className="ver-publicacion" onClick={() => { Cookie.set('item', (product.id), { path: '/' }); gotocart();}}>Ver Publicación</button>
              <button className="eliminar-publicacion" onClick={() => eliminarPublicacion(product.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}

function logout(){
  Cookie.set("id_user", -1, {path: "/"})
  // Eliminar la cookie "name"
  Cookie.remove('name');
  // Eliminar la cookie "lastname"
  Cookie.remove('lastname');
  document.location.reload()
}

function eliminarPublicacion(Id){
  fetch(`http://localhost:8090/propertydelete/${Id}`, {
    method: 'DELETE'
  })
    .then(response => {
      // Manejar la respuesta
      if (response.ok) {
        console.log('Propiedad eliminada');
      } else {
        console.log('Error al eliminar propiedad');
      }
    })
    .catch(error => {
      console.log('Error al realizar la solicitud:', error);
    });
  fetch('http://localhost:8983/solr/property/update?commit=true', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    delete: {
      query: 'id:'+Id+'',
    },
  }),
})
  .then(response => {
    if (response.ok) {
      console.log('Documentos eliminados correctamente');
    } else {
      console.log('Error al eliminar los documentos');
    }
  })
  .catch(error => {
    console.log('Error de red:', error);
  });
  document.location.reload()
}

function eliminarcuenta(){
  const userId = Cookie.get("id_user");
  fetch(`http://localhost:8070/messages2/${userId}`, {
    method: 'DELETE'
  })
    .then(response => {
      // Manejar la respuesta
      if (response.ok) {
        console.log('Mensajes eliminados');
      } else {
        console.log('Error al eliminar mensajes');
      }
    })
    .catch(error => {
      console.log('Error al realizar la solicitud:', error);
    });

  // Borrar publicaciones
  fetch(`http://localhost:8090/propertiesdelete/${userId}`, {
    method: 'DELETE'
  })
    .then(response => {
      // Manejar la respuesta
      if (response.ok) {
        console.log('Publicaciones eliminadas');
      } else {
        console.log('Error al eliminar publicaciones');
      }
    })
    .catch(error => {
      console.log('Error al realizar la solicitud:', error);
    });

    // const data = {
    //   "delete": {
    //     "query": "userid:${userId}"
    //   }
    // };
  
    // fetch("http://localhost:8983/solr/property/update?commit=true", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(data)
    // })
    //   .then(response => response.json())
    //   .then(responseData => {
    //     // Manejar la respuesta del servidor si es necesario
    //     console.log(responseData);
    //   })
    //   .catch(error => {
    //     // Manejar errores de la petición
    //     console.error(error);
    //   });

  // Borrar cuenta
  fetch(`http://localhost:9000/userdelete/${userId}`, {
    method: 'DELETE'
  })
    .then(response => {
      // Manejar la respuesta
      if (response.ok) {
        console.log('Cuenta eliminada');
      } else {
        console.log('Error al eliminar cuenta');
      }
    })
    .catch(error => {
      console.log('Error al realizar la solicitud:', error);
    });

  logout();
}

function search(){
  let input, filter, a, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  a = document.getElementsByClassName("product");
  for (i = 0; i < a.length; i++) {
    let txtValue = a[i].children[1].textContent || a[i].children[1].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "inherit";
    } else {
      a[i].style.display = "none";
    }
  }
  if(input.value.toUpperCase().length <= 0){
    for(i = 0; i < a.length; i++){
      a[i].style.display = "inherit";
    }
  }

}

function gotocart(){
  goto("/cart")
}

function gotocompras(){
  goto("/compras")
}

async function getProductBySearch(query){
  return fetch("http://localhost:8000/search/q="+query+"", {
    method: "GET",
    header: "Content-Type: application/json"
  }).then(response=>response.json())
}


function Publications() {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState("")
  const [failedSearch, setFailedSearch] = useState(false)


  if (Cookie.get("id_user") > -1 && !isLogged){
    getUserById(Cookie.get("id_user")).then(response => setUser(response))
    setIsLogged(true)
  }

  if (!(Cookie.get("id_user") > -1) && isLogged){
    setIsLogged(false)
  }

  if (products.length <= 0){
    getProducts().then(response => {setProducts(response)})
  }

  if (!cartItems && Cookie.get("cartItems")){
    setCartItems(Cookie.get("cartItems"))
  }

  async function searchQuery(query){

    await getProductBySearch(query).then(response=>{
      console.log(query)
      if(response != null){
        if(response.length > 0){
          setProducts(response)
          setFailedSearch(false)
        }else{
          setProducts([])
          setFailedSearch(true)
        }
      }
      else{
        setFailedSearch(false)
        getProducts().then(response=>setProducts(response))
      }
    })


  }

  async function categories(id){

    await getProductsByCategoryId(id).then(response=>{
      console.log(response)
      if(response != null){
        if(response.length > 0){
          setProducts(response)
          setFailedSearch(false)
        }else{
          setProducts([])
          setFailedSearch(true)
        }
      }
      else{
        setFailedSearch(false)
        getProducts().then(response=>setProducts(response))
      }
    })


  }

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    eliminarcuenta();
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
        {products.length > 0 || failedSearch ? showProducts(products, setCartItems) : <a>NO HAY PRODUCTOS </a>}
      </div>

      <div id="mySidenav" className="sidenav">

        </div>
    </div>
  );
}

export default Publications;
import React, { useState } from "react";
import "./Home.css";
import "./css/materialize.css"
import logo from "./images/home.svg"
import Heart from "./images/heart.svg"
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

// async function getCategories(){
//   return await fetch('http://127.0.0.1:8080/categories', {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(response => response.json())
// }

async function getProducts(){
  return await fetch("http://localhost:8090/properties/all", {
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

function gotopublications(){
  goto("/publications")
}

function gotopublish(){
  goto("/publish")
}


function retry() {
  goto("/")
}

function addToCart(id, setCartItems){
  let cookie = Cookie.get("cart");

  if(cookie == undefined){
    Cookie.set("cart", id + ",1;", {path: "/"});
    setCartItems(1)
    return
  }
  let newCookie = ""
  let isNewItem = true
  let toCompare = cookie.split(";")
  let total = 0;
  toCompare.forEach((item) => {
    if(item != ""){
      let array = item.split(",")
      let item_id = array[0]
      let item_quantity = array[1]
      if(id == item_id){
        item_quantity = Number(item_quantity) + 1
        isNewItem = false
      }
      newCookie += item_id + "," + item_quantity + ";"
      total += Number(item_quantity);
    }
  });
  if(isNewItem){
    newCookie += id + ",1;"
    total += 1;
  }
  cookie = newCookie
  Cookie.set("cart", cookie, {path: "/"})
  Cookie.set("cartItems", total, {path: "/"})
  setCartItems(total)
  return
}

function showProducts(products, setCartItems){
  return products.map((product) =>
    <div class="col s2" onClick={() => { Cookie.set('item', (product.id), { path: '/' }); gotocart();}}>
      <div class="product large" key={product.id} className="product">
      {/* <img src={'http://172.19.0.9:8090/properties/64a2be0926fc8c998265b9b6.jpg'} alt="Imagen" />
      <img src={`http://172.19.0.9:8090/properties/${product.id}.jpg`} alt="Imagen2" /> */}
        <div class="product-image">
        <img width="128px" height="300px" src={product.image}  onError={(e) => (e.target.onerror = null, e.target.src = "./images/default.jpg")}/>
        </div>
        <div class="product-content">
          <span class="text-blue"><a className="name">{product.tittle}</a></span>
          <p>| {product.size} m²</p>
          <p>Ciudad: {product.city}</p>
          <p>Direccion: {product.street}</p>
        </div>
        {/* <div class="product-action">
          <a class="waves-effect waves-light btn yellow black-text" onClick={() => addToCart(product.product_id, setCartItems)}>Agregar al carrito</a>
        </div> */}
      </div>
    </div>
 )
}

function logout(){
  Cookie.set("id_user", -1, {path: "/"})
  // Eliminar la cookie "name"
  Cookie.remove('name');
  // Eliminar la cookie "lastname"
  Cookie.remove('lastname');
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

    fetch('http://localhost:8983/solr/property/update?commit=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delete: {
          query: 'userid:'+userId+'',
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

function deleteCategory(){
  Cookie.set("category", 0, {path: "/"})
  goto("/")
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


function Home() {
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
    {/* <li><a onClick={gotocart} className="black-text"><i className="material-icons black-text">shopping_cart</i></a></li>
    <li><p className="black-text">{cartItems > 0 ? cartItems : 0}</p></li> */}
    <li className="heart" onClick={gotopublications}><img src={Heart} alt="Heart" width="40" height="40" /></li>
    <li><a onClick={gotopublish} className="black-text3">Publicar!</a></li>
    {/* <li><a onClick={logout} className="black-text">Cerrar Sesion</a></li> */}
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
            <form class="col s12">
              <div class="input-field">
              <input type="search" id="search" placeholder="Buscar Productos" onKeyDown={(e) => e.keyCode === 13 ? searchQuery(e.target.value) : void(0)} required onChange={search}/>
              {/* <input type="search" id="search" placeholder="Buscar Productos" onKeyDown={(e) => e.keyCode === 13 ? searchQuery(e.target.value) : void(0)}/>
                <input id="search" type="search" required onChange={search}/> */}
                <label class="label-icon" for="search"><i class="material-icons black-text">search</i></label>
                <i class="material-icons" onClick={() => categories(0)}>close</i>
              </div>
            </form>
          <a href="/" class="brand-logo center blue-text text-darken-2"><img src={logo} width="50px" height="70px" /></a> 
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li>{isLogged ? login : <a onClick={gotologin} class="black-text">Iniciar Sesion</a>}</li>
          </ul>
        </div>
      </nav>
      <div class="categories">
      {/* <img src="http://arqui-sw-2-main-back-1:8090//properties/XVlBzgbaiC.jpg" alt="Mi imagen" /> */}
      <button class="botoncats" onClick={() => categories(0)}>
            TODO
          </button>
      <button class="botoncats" onClick={() => categories("casa")}>
            CASAS
          </button>
          <button class="botoncats" onClick={() => categories("departamento")}>
            DEPARTAMENTOS
          </button>
          <button class="botoncats" onClick={() => categories("terreno")}>
            TERRENOS
          </button>
          <button class="botoncats" onClick={() => categories("local")}>
            LOCALES
          </button>
          <button class="botoncats" onClick={() => categories("oficina")}>
            OFICINAS
          </button>
          <button class="botoncats" onClick={() => categories("campo")}>
            CAMPOS
          </button>
          </div>
      <div class="row" id="main">
        {products.length > 0 || failedSearch ? showProducts(products, setCartItems) : <a>NO HAY PRODUCTOS </a>}
      </div>

      <div id="mySidenav" className="sidenav">

        </div>
    </div>
  );
}

export default Home;
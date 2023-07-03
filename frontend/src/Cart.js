import React, { useState } from "react";
import "./Cart.css";
import "./css/materialize.css"
import { ReactComponent as DeleteIcon } from "./images/delete.svg";
import logo from "./images/home.svg"
import Cookies from "universal-cookie";

const Cookie = new Cookies();
console.log(Cookie.get('item'));
console.log(Cookie.get("id_user"));
console.log(Cookie.get('name'));
console.log(Cookie.get("lastname"));
console.log(Cookie.get("userproduct"));

async function getUserById(id){
    return await fetch('http://localhost:9000/user/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
}).then(response => response.json())
.then(response => {
  Cookie.set("name", response.name, {path: '/'})
  Cookie.set("lastname", response.last_name, {path: '/'})
})

}

async function getProducts() {
  var id2 = Cookie.get('item');
  try {
    const response = await fetch(`http://localhost:8090/properties/${id2}/id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    Cookie.set("userproduct", data.userid, { path: '/' });
    return [data];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getMessages(){
  var id3 = Cookie.get('item');
  return await fetch("http://localhost:8070/properties/"+id3+"/messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
}

function Mensajes(mensaje) {
  var id4 = Cookie.get('item');
  var iduser = parseInt(Cookie.get("id_user"), 10);
  const data = {
    id: "1",
    userid: iduser,
    propertyid: id4,
    username: ""+Cookie.get('name')+" "+Cookie.get('lastname')+"",
    body: mensaje,
    created_at: "05/07/2022"
  };

  fetch("http://localhost:8070/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseData => {
      // Manejar la respuesta del servidor si es necesario
      console.log(responseData);
    })
    .catch(error => {
      // Manejar errores de la petición
      console.error(error);
    });
  };
  

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

function showProducts(products, messages, setCartItems){
  return products.map((product) =>
    <div class="col s2" onClick={() => { Cookie.set('item', (product.id), { path: '/' });}}>

<div class="product large" key={product.id} className="product">
        <div class="product-image22">
        <img class="imagen22" width="650px" height="530px" src={product.image}  onError={(e) => (e.target.onerror = null, e.target.src = "./images/default.jpg")}/>
        </div>
        <div class="product-content22">
          <span class="text-blue22"><a className="name">{product.tittle}</a></span>
          <p class="descripcion">{product.description}</p>
          <p class="precio">USD ${product.price}</p>
          <table class="tabla">
            <tr>
              <td class="negrita">Ciudad:</td>
              <td>{product.city}</td>
            </tr>
            <tr>
              <td class="negrita">Calle:</td>
              <td>{product.street}</td>
            </tr>
            <tr>
              <td class="negrita">Superficie Total:</td>
              <td>{product.size} m²</td>
            </tr>
            <tr>
              <td class="negrita">Habitaciones:</td>
              <td>{product.rooms}</td>
            </tr>
            <tr>
              <td class="negrita">Baños:</td>
              <td>{product.bathrooms}</td>
            </tr>
          </table>
        </div>
        <div class="mapa">
        <iframe class="mapa2" src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDy2pYKjByYvXsvfUo_4w5Vq5Khp87nx5U&q="+product.street+","+product.city}></iframe>      
        </div>
        <div class="mensajes">
          <p class="negrita">MENSAJES</p>
        <div className="formmensaje">
        <form>
        <div class="form-group">
          <textarea class="form-control status-box" rows="2" placeholder="Escribe un mensaje..." id="mensajess"></textarea>
        </div>
      </form>
      <div class="button-group pull-right">
        {/* <p class="counter">140</p> */}
        <a href="#" class="btn btn-primary" onClick={() => { Mensajes(document.getElementById('mensajess').value); window.location.reload(); }}>ENVIAR</a>
      </div>
      </div>
        </div>
        {showMessages(messages)}
      </div>
    </div>
 )
}

function showMessages(messages){
  const valorCookie = parseInt(Cookie.get("id_user"), 10);
  const valorCookie2 = parseInt(Cookie.get("userproduct"), 10);
  return messages.map((message) => (
    <div className="mensajes" key={message.id}>
      {message.userid === valorCookie && (
        <div className="delete-icon" onClick={() => eliminarMensaje(message.id)}>
          <DeleteIcon className="delete-icon-svg" />
        </div>
      )}
      <div className="message-content">
        <p className="fecha">{message.created_at}</p>
        <div className={`rectangulo ${message.userid === valorCookie ? 'azul' : ''} ${message.userid === valorCookie2 ? 'amarillo' : ''}`}>
          <span className="negrita">{message.username === 'undefined undefined' ? 'Anónimo' : (message.username || 'Anónimo')}</span>: {message.body}
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

function eliminarMensaje(messageid){
  fetch(`http://localhost:8070/messages/${messageid}`, {
    method: 'DELETE'
  })
    .then(response => {
      // Manejar la respuesta
      if (response.ok) {
        console.log('Mensaje eliminados');
      } else {
        console.log('Error al eliminar mensaje');
      }
    })
    .catch(error => {
      console.log('Error al realizar la solicitud:', error);
    });
  document.location.reload()
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
  const [messages, setMessages] = useState([])
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

  // if (messages.length <= 0){
  //   getMessages().then(response => {setMessages(response)})
  // }

  if (messages.length <= 0) {
    getMessages()
      .then(response => {
        if (response.length > 0) {
          setMessages(response);
        } else {
          setMessages([{ username: 'anónimo', text: 'No hay mensajes' }]);
        }
      });
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

  const login = (
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      {/* <li><a onClick={gotocart} class="black-text"><i class="material-icons black-text">shopping_cart</i></a></li>
      <li><p class="black-text">{cartItems > 0 ? cartItems : 0}</p></li>
      <li><a onClick={gotocompras} class="black-text">Mis Compras</a></li> */}
      <li><a onClick={logout} class="black-text">Cerrar Sesion</a></li>
    </ul>
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
      <div class="row22" id="main">
        {products.length > 0 || failedSearch ? showProducts(products, messages, setCartItems) : <a>NO HAY PRODUCTOS </a>}
      </div>

      <div id="mySidenav" className="sidenav">

        </div>
    </div>
  );
}

export default Home;
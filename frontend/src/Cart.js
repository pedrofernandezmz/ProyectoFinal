import React, { useState } from "react";
import "./Cart.css";
import "./css/materialize.css"
import logo from "./images/home.svg"
import Cookies from "universal-cookie";

const Cookie = new Cookies();
console.log(Cookie.get('item'));

async function getUserById(id){
    return await fetch('http://127.0.0.1:8080/user/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
}).then(response => response.json())

}

async function getCategories(){
  return await fetch('http://127.0.0.1:8080/categories', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
}

async function getProducts(){
  var id2 = Cookie.get('item');
  return await fetch("http://localhost:8983/solr/avisos/select?&defType=lucene&indent=true&q=id:"+id2+"&q.op=OR&rows=100", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
}

async function getProductsByCategoryId(id){
  //solo para probar corregir
  return await fetch("http://localhost:8983/solr/avisos/select?&defType=lucene&indent=true&q=description:%22%27"+id+"%27%22%0Atitle:%22%27"+id+"%27%22&q.op=OR&rows=100", {
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

function showProducts(products, setCartItems){
  return products.map((product) =>
    <div class="col s2" align="center">
      <div class="product large" key={product.id} className="product">
        <div class="product-image">
        <img width="300px" height="300px" src={product.image}  onError={(e) => (e.target.onerror = null, e.target.src = "./images/default.jpg")}/>
        </div>
        <div class="product-image">
        <img width="300px" height="300px" src={product.image2}  onError={(e) => (e.target.onerror = null, e.target.src = "./images/default.jpg")}/>
        </div>
        <div class="product-content">
          <span class="text-blue"><a className="name">{product.title}</a></span>
          <p>Provincia: {product.province}</p>
          <p>Ciudad: {product.city}</p>
          <p>Direccion: {product.direction}</p>
          <p>Descripcion: {product.description}</p>
          <p>Vendedor: {product.seller}</p>
        </div>
      </div>
    </div>
 )
}

function logout(){
  Cookie.set("id_user", -1, {path: "/"})
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
  return fetch("http://localhost:8983/solr/avisos/select?&defType=lucene&indent=true&q=description:%22%27"+query+"%27%22%0Atitle:%22%27"+query+"%27%22&q.op=OR&rows=100", {
    method: "GET",
    header: "Content-Type: application/json"
  }).then(response=>response.json())
}


function Cart() {
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
    getProducts().then(response => {setProducts(response.response.docs)})
  }

  if (!cartItems && Cookie.get("cartItems")){
    setCartItems(Cookie.get("cartItems"))
  }

  async function searchQuery(query){

    await getProductBySearch(query).then(response=>{
      console.log(query)
      if(response.response.docs != null){
        if(response.response.docs.length > 0){
          setProducts(response.response.docs)
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
      console.log(response.response.docs)
      if(response.response.docs != null){
        if(response.response.docs.length > 0){
          setProducts(response.response.docs)
          setFailedSearch(false)
        }else{
          setProducts([])
          setFailedSearch(true)
        }
      }
      else{
        setFailedSearch(false)
        getProducts().then(response=>setProducts(response.response.docs))
      }
    })


  }

  const login = (
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a onClick={gotocart} class="black-text"><i class="material-icons black-text">shopping_cart</i></a></li>
      <li><p class="black-text">{cartItems > 0 ? cartItems : 0}</p></li>
      <li><a onClick={gotocompras} class="black-text">Mis Compras</a></li>
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
            <form class="col s12">
              <div class="input-field">
              </div>
            </form>
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

export default Cart;
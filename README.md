#### Para Poner las cosas en el Solr
docker run -d -p --name some-solr 8983:8983 solr solr-precreate property

***
# Api Properties

### > POST InsertProperty
```bash
 {
     "tittle": "Departamento Grande en Nueva",
     "description": "Dpto comodo, ideal para estudiantes o personas jovenes",
     "country": "Argentina",
     "city": "Cordoba",
     "state":"Cordoba",
     "street":"Belgrano 295",
     "size":  90,
     "rooms": 3,
     "bathrooms": 1,
     "service": "Venta",
     "price": 250000,
     "image": "https://imgar.zonapropcdn.com/avisos/1/00/49/04/77/69/720x532/1793449465.jpg",
     "userid":1
 }
```
***
### POST InsertManyProperties
```bash
[
{
    "tittle": "CASA BONITA",
    "description": "hermosa casa, comoda",
    "country": "Argentina",
    "city": "Potrero de Garay",
  ....
 },{
    "tittle": "Casa en Alta Cordoba",
     "description": "Casa con espacios amplios y patio para interno",
     "country": "Argentina",
     "city": "Cordoba",
   ....
 },
]
```
***
### GET Property
Se usa el ID
localhost:8090/properties/63dbaaf59261396ac24f9c7f
```bash
 {
     "id": "63dbaaf59261396ac24f9c7f",
     "tittle": "CASA BONITA",
     ....
 }

```
 

# Componenten

## Gateway
Hier komt al het verkeer van buiten langs alvorens juist terecht te komen, eventuele firewalls & Security measures worden hier ook genomen

## Discovery Service
### Special Tech: Netflix Eureka
Hier vinden alle microservices elkanders IP en registreren ze zich ook op

## Config Service
Dit is de centrale service waar alle properties en configs uitgelezen worden door andere microservices

## Frontend
### Tech: Angular
Bestaat uit een monolithic angular applicatie

## EventBus
### Tech: RabbitMq
Is verantwoordelijk voor de messagebus, queue versturen en onvtangen van berichten naar en van publishers en subscribers

## Database
### Tech: MySQL

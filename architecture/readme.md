# Communicatie

## PostService
PostService zal communiceren met ReviewService via een eventbus omwille van de grootte van posts, en het belang van het aankomen van de posts.
Postservice zal communiceren met CommentService via Openfeign Synchrone communicatie

## ReviewService
ReviewService zal communiceren met PostService via een eventbus omwille van het belang van de redacteurs dat hun spullen aankomen, en dat zij ook grote posts en bestanden binnenkrijgen.
ReviewService zal communiceren met CommentService via Openfeign syunchrone communicatie

## CommentService
Commentservice zal met beide andere services synchroon communiceren via Openfeign.



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

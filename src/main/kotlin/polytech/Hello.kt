package polytech

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.javalin.Javalin
import io.javalin.staticfiles.Location
import javalinjwt.JWTProvider
import javalinjwt.JavalinJWT
import javalinjwt.examples.JWTResponse

fun main(args: Array<String>) {

    // simulation d'une base de données
    data class Message(val text: String)
    val messages: MutableList<Message> = mutableListOf(
        Message("Morgen"),
        Message("Good Morning"),
        Message("Bonjour")
    )

    data class Ingredient(val label: String)
    val kebabIngredients: MutableList<Ingredient> = mutableListOf(
        Ingredient("Bread"),
        Ingredient("Meat"),
        Ingredient("Cheese")
    )

    data class User(var name: String, var level: String)

    val algorithm = Algorithm.HMAC256("very_secret")

    val generator = { user, alg ->
        val token = JWT.create()
            .withClaim("name", user.name)
            .withClaim("level", user.level)
        token.sign(alg)
    }

    val verifier = JWT.require(algorithm).build()

    val provider = JWTProvider(algorithm, generator, verifier)

    val validateHandler = { ctx ->
        val decodedJWT = JavalinJWT.getTokenFromHeader(ctx).flatMap(provider::validateToken)

        if (!decodedJWT.isPresent()) {
            ctx.status(401).result("Missing or invalid token")
        } else {
            ctx.result("Hi " + decodedJWT.get().getClaim("name").asString())
        }
    }

    val app = Javalin.create()

    app.enableStaticFiles("./public", Location.EXTERNAL).start(7000)

    app.before("/*/*", validateHandler)

    app.get("/hello") { ctx -> ctx.result("Hello World") }

    app.get("/hello-world") { ctx -> ctx.json(Message("Hello World")) }

    app.get("/messages") { ctx -> ctx.json(messages) }

    app.post("/messages") { ctx ->

        val newMessage = Message(ctx.formParam("text").toString())
        messages.add(newMessage)
        ctx.json(newMessage).status(201)
    }

    app.get("/kebab-ingredients") { ctx -> ctx.json(kebabIngredients) }

    app.post("/kebab-ingredients") { ctx ->
        val newIngredient = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.add(newIngredient)
        ctx.json(newIngredient).status(201)
    }

    app.delete("/kebab-ingredients") { ctx ->
        val ingredientToDelete = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.remove(ingredientToDelete)
        ctx.json(ingredientToDelete).status(201)
    }

    app.post("/admin/login") { ctx ->
        val mockUser = User("Mocky McMockface", "user")
        val token = provider.generateToken(mockUser)
        ctx.json(JWTResponse(token))
    }
}

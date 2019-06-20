package polytech

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.javalin.Javalin
import io.javalin.security.Role
import io.javalin.security.SecurityUtil.roles
import io.javalin.staticfiles.Location
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import javalinjwt.JavalinJWT
import javalinjwt.examples.JWTResponse
import javalinjwt.JWTAccessManager
import java.util.HashMap

enum class Roles : Role {
    ANYONE,
    USER,
    ADMIN
}

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


    val rolesMapping = HashMap<String, Role>()
    rolesMapping[Roles.ADMIN.name] = Roles.ADMIN
    rolesMapping[Roles.USER.name] = Roles.USER

    val algorithm = Algorithm.HMAC256("very_secret")

    val generator = JWTGenerator<User> { user, alg ->
        val token = JWT.create()
            .withClaim("name", user.name)
            .withClaim("level", user.level)
        token.sign(alg)
    }

    val verifier = JWT.require(algorithm).build()

    val provider = JWTProvider(algorithm, generator, verifier)

    val accessManager = JWTAccessManager("level", rolesMapping, Roles.ANYONE)

    val app = Javalin.create()

    app.enableStaticFiles("./public", Location.EXTERNAL)

    app.before(JavalinJWT.createHeaderDecodeHandler(provider))
    app.accessManager(accessManager)

    app.start(7000)

    app.get("/hello", {
        ctx -> ctx.result("Hello World")
    }, roles(Roles.ANYONE))

    app.get("/hello-world", {
        ctx -> ctx.json(Message("Hello World"))
    }, roles(Roles.ANYONE))

    app.get("/messages", {
        ctx -> ctx.json(messages)
    }, roles(Roles.ANYONE))

    app.post("/messages", { ctx ->

        val newMessage = Message(ctx.formParam("text").toString())
        messages.add(newMessage)
        ctx.json(newMessage).status(201)
    }, roles(Roles.ANYONE))

    app.get("/kebab-ingredients", {
        ctx -> ctx.json(kebabIngredients)
    }, roles(Roles.ANYONE))

    app.post("/kebab-ingredients", { ctx ->
        val newIngredient = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.add(newIngredient)
        ctx.json(newIngredient).status(201)
    }, roles(Roles.USER, Roles.ADMIN))

    app.delete("/kebab-ingredients", { ctx ->
        val ingredientToDelete = Ingredient(ctx.formParam("label").toString())
        kebabIngredients.remove(ingredientToDelete)
        ctx.json(ingredientToDelete).status(201)
    }, roles(Roles.USER, Roles.ADMIN))

    app.post("/admin/login", { ctx ->
        val mockUser = User("Mocky McMockface", Roles.ADMIN.name)
        val token = provider.generateToken(mockUser)
        ctx.json(JWTResponse(token))
    }, roles(Roles.ANYONE))
}

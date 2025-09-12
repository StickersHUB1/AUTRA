const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// Crear sesión de Checkout
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated", "Debes iniciar sesión");

  const quantity = data.cantidad || 1;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Utilizaciones Autra Digital",
            },
            unit_amount: 1500, // 15€ en céntimos
          },
          quantity: quantity,
        },
      ],
      success_url: "https://autra-digital.web.app/dashboard_avanzado.html",
      cancel_url: "https://autra-digital.web.app/utilizaciones_store.html",
      client_reference_id: uid,
      metadata: { utilizaciones: quantity.toString() },
    });

    return { id: session.id };
  } catch (err) {
    console.error("❌ Error creando sesión:", err.message);
    throw new functions.https.HttpsError("internal", "Error creando sesión");
  }
});

// Webhook Stripe
exports.stripeWebhook = functions.https.onRequest((req, res) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const quantity = session.metadata.utilizaciones || 1;

    admin.firestore().collection("users").doc(userId).update({
      utilizaciones: admin.firestore.FieldValue.increment(Number(quantity)),
    })
    .then(() => {
      console.log(`✅ Utilizaciones añadidas a ${userId}: +${quantity}`);
      res.status(200).send("ok");
    })
    .catch((err) => {
      console.error("🔥 Error al actualizar Firestore:", err.message);
      res.status(500).send("Error Firestore");
    });
  } else {
    res.json({ received: true });
  }
});

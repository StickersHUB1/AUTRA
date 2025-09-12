const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

exports.stripeWebhook = functions.https.onRequest((req, res) => {
  let event;

  // 🔹 Verificar firma del webhook
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

  // 🔹 Manejar evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.client_reference_id;
    const quantity = session.metadata.utilizaciones || 1;

    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        utilizaciones: admin.firestore.FieldValue.increment(Number(quantity)),
      })
      .then(() => {
        console.log(`✅ Utilizaciones actualizadas para ${userId}: +${quantity}`);
        return res.status(200).json({ received: true });
      })
      .catch((err) => {
        console.error("🔥 Error al actualizar Firestore:", err.message);
        return res.status(500).send("Error al actualizar Firestore");
      });
  } else {
    // Otros eventos
    return res.status(200).json({ received: true });
  }
});

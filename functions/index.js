const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // lo mandas desde tu checkout
    const userId = session.client_reference_id;
    const quantity = session.metadata.utilizaciones || 1;

    await admin.firestore().collection("users").doc(userId).update({
      utilizaciones: admin.firestore.FieldValue.increment(Number(quantity))
    });

    console.log(`✅ Utilizaciones actualizadas para ${userId}: +${quantity}`);
  }

  res.json({ received: true });
});

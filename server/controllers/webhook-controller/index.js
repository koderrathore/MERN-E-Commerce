import User from "../../models/auth-model/index.js"
import { Webhook } from "svix";

export const clerkWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(400).json({
      success: false,
      message: "Webhook Secret needed!",
    });
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (error) {
    console.error("Webhook verify failed:", error.message);
    return res.status(400).json({
      success: false,
      message: "Webhook Verification Failed!",
    });
  }

  console.log("EVENT TYPE:", evt.type);
  console.log("EVENT DATA:", evt.data);

  let newUser = null;

  if (evt.type === "user.created") {
    const existingUser = await User.findOne({ clerkID: evt.data.id });
    if (existingUser) {
      return res.status(200).json({ success: true });
    }

    newUser = await User.create({
      clerkID: evt.data.id,
      username: evt.data.username || evt.data.email_addresses[0].email_address,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_image_url,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Webhook processed",
  });
};

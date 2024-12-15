import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.DATABASE_ID;

const sendMessage = async (sender, recipient, message) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Sender: { rich_text: [{ text: { content: sender } }] },
        Recipient: { rich_text: [{ text: { content: recipient } }] },
        Message: { title: [{ text: { content: message } }] },
      },
    });
    console.log("✅ Mensaje enviado con éxito:", response.id);
  } catch (error) {
    console.error("❌ Error al enviar el mensaje:", error.message);
  }
};

const readMessages = async (recipient) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Recipient",
        rich_text: { equals: recipient },
      },
    });

    console.log("📩 Mensajes encontrados:");
    response.results.forEach((page) => {
      const sender = page.properties.Sender.title[0]?.text.content;
      const message = page.properties.Message.rich_text[0]?.text.content;
      console.log(`- De: ${sender} | Mensaje: ${message}`);
    });
  } catch (error) {
    console.error("❌ Error al leer los mensajes:", error.message);
  }
};

(async () => {
  console.log("🚀 Iniciando pruebas con Notion API...");

  await sendMessage("Elito Sanz", "Alejo", "¡Hola desde Notion API!");
  await readMessages("Alejo");
})();

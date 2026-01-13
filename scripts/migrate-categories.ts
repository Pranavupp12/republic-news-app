const { PrismaClient } = require('@prisma/client');

// CHANGE: Rename 'prisma' to 'db' to avoid name conflicts
const db = new PrismaClient();

async function main() {
  console.log("🚀 Starting migration: String -> String[]...");

  try {
    // CHANGE: Use 'db' here instead of 'prisma'
    const result = await db.$runCommandRaw({
      update: "Article", 
      updates: [
        {
          // Find docs where 'category' is still a STRING
          q: { category: { $type: "string" } },
          
          // Wrap that string in an array: "News" -> ["News"]
          u: [ { $set: { category: ["$category"] } } ],
          
          multi: true,
        },
      ],
    });

    console.log("✅ Migration complete!");
    console.log("Result:", result);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    // CHANGE: Use 'db' here
    await db.$disconnect();
  }
}

main();
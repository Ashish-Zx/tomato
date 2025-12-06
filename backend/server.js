const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");

connectDB();

app.listen(8000, () => {
  console.log(`Server is running on port www.localhost:8000`);
});
